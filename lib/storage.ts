// lib/storage.ts
// Простая обёртка над AsyncStorage для сохранения текущих request/activeRental между перезапусками приложения.
// Используется в демо-режиме; в продакшене лучше хранить это в бэкенде (Convex/Firebase) по userId.

import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  CURRENT_REQUEST_ID: 'rental:currentRequestId',
  ACTIVE_RENTAL_ID: 'rental:activeRentalId'
}

export const storage = {
  async setCurrentRequestId(id: string | null) {
    try {
      if (id == null) await AsyncStorage.removeItem(KEYS.CURRENT_REQUEST_ID)
      else await AsyncStorage.setItem(KEYS.CURRENT_REQUEST_ID, id)
    } catch (e) { console.warn('storage.setCurrentRequestId', e) }
  },

  async getCurrentRequestId(): Promise<string | null> {
    try {
      const v = await AsyncStorage.getItem(KEYS.CURRENT_REQUEST_ID)
      return v
    } catch (e) { console.warn('storage.getCurrentRequestId', e); return null }
  },

  async clearCurrentRequestId() { await storage.setCurrentRequestId(null) },

  async setActiveRentalId(id: string | null) {
    try {
      if (id == null) await AsyncStorage.removeItem(KEYS.ACTIVE_RENTAL_ID)
      else await AsyncStorage.setItem(KEYS.ACTIVE_RENTAL_ID, id)
    } catch (e) { console.warn('storage.setActiveRentalId', e) }
  },

  async getActiveRentalId(): Promise<string | null> {
    try { return await AsyncStorage.getItem(KEYS.ACTIVE_RENTAL_ID) } catch (e) { console.warn('storage.getActiveRentalId', e); return null }
  },

  async clearActiveRentalId() { await storage.setActiveRentalId(null) }
}
