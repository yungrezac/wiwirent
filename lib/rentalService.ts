// lib/rentalService.ts
// Improved mock rental service with subscription/event support.
// TODO: Replace with Convex (database + functions) and Stripe (payments/subscriptions) in production.

import { storage } from './storage'

export type RentalStatus = 'requested' | 'invited' | 'contract_signed' | 'paid' | 'active'

export type RentalRequest = {
  id: string
  listingId: string
  status: RentalStatus
  invitedAt?: number
  contractSignedAt?: number
  firstPaidAt?: number
  createdAt?: number
}

let store: Record<string, RentalRequest> = {}

type Callback = (req: RentalRequest | null) => void

const subscribers: Record<string, Callback[]> = {}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function emitChange(id: string) {
  const req = store[id] ? { ...store[id] } : null
  const subs = subscribers[id] || []
  subs.forEach(cb => {
    try { cb(req) } catch (e) { console.warn('rentalService subscriber error', e) }
  })
}

function cleanupOld() {
  // keep store small in demo
  const ids = Object.keys(store)
  if (ids.length > 200) {
    const sorted = ids.sort((a,b) => (store[a].createdAt||0) - (store[b].createdAt||0))
    const toRemove = sorted.slice(0, ids.length - 200)
    toRemove.forEach(id => delete store[id])
  }
}

export const rentalService = {
  // Create a viewing request and simulate manager invitation after a short delay
  createViewingRequest: async (listingId: string) => {
    const id = `rr_${Date.now()}`
    const now = Date.now()
    const req: RentalRequest = { id, listingId, status: 'requested', createdAt: now }
    store[id] = req
    cleanupOld()
    // Persist current request id so app can recover after restart
    try { await storage.setCurrentRequestId(id) } catch (e) { console.warn('rentalService: storage failed', e) }
    // Emit created
    emitChange(id)
    // Simulate manager inviting user after 3s (replace with webhook in prod)
    setTimeout(() => {
      if (!store[id]) return
      store[id] = { ...store[id], status: 'invited', invitedAt: Date.now() }
      emitChange(id)
    }, 3000)
    // Return a shallow copy
    return { ...req }
  },

  getRequest: async (id: string | undefined) => {
    if (!id) return null
    await delay(120)
    return store[id] ? { ...store[id] } : null
  },

  listRequests: async () => {
    // Return all requests (used by admin demo)
    await delay(80)
    return Object.values(store).map(r => ({ ...r }))
  },

  signContract: async (id: string) => {
    if (!store[id]) throw new Error('Request not found')
    store[id] = { ...store[id], status: 'contract_signed', contractSignedAt: Date.now() }
    emitChange(id)
    return { ...store[id] }
  },

  bindCardAndPayFirstMonth: async (id: string, cardToken: string) => {
    if (!store[id]) throw new Error('Request not found')
    // Simulate payment processing
    await delay(900)
    store[id] = { ...store[id], status: 'paid', firstPaidAt: Date.now() }
    emitChange(id)
    // After payment, activate (simulate backend process)
    setTimeout(async () => {
      if (!store[id]) return
      store[id] = { ...store[id], status: 'active' }
      emitChange(id)
      // Persist active rental id and clear current request id
      try { await storage.setActiveRentalId(id); await storage.setCurrentRequestId(null) } catch (e) { console.warn('rentalService: storage failed', e) }
    }, 500)
    return { ...store[id] }
  },

  // Subscribe to changes for a specific request id. Returns unsubscribe function.
  subscribe: (id: string, cb: Callback) => {
    if (!subscribers[id]) subscribers[id] = []
    subscribers[id].push(cb)
    // Immediately call with current value
    try { cb(store[id] ? { ...store[id] } : null) } catch (e) { console.warn(e) }
    return () => {
      subscribers[id] = (subscribers[id] || []).filter(x => x !== cb)
    }
  },

  // Admin helpers for demo: directly set status
  adminSetStatus: async (id: string, status: RentalStatus) => {
    if (!store[id]) throw new Error('Request not found')
    store[id] = { ...store[id], status }
    if (status === 'invited') store[id].invitedAt = Date.now()
    if (status === 'contract_signed') store[id].contractSignedAt = Date.now()
    if (status === 'paid') store[id].firstPaidAt = Date.now()
    emitChange(id)
    // If admin sets active directly, persist active rental
    if (status === 'active') {
      try { await storage.setActiveRentalId(id); await storage.setCurrentRequestId(null) } catch (e) { console.warn('rentalService: storage failed', e) }
    }
    return { ...store[id] }
  }
}
