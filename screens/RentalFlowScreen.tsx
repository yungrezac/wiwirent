import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import { theme } from '../lib/theme'
import { rentalService } from '../lib/rentalService'
import Stepper from '../components/Stepper'
import StatusBadge from '../components/StatusBadge'

const steps = [
  'Заявка на просмотр',
  'Подтверждение и приглашение',
  'Подписание договора',
  'Привязка карты и оплата',
  'Текущий наём'
]

export default function RentalFlowScreen(){
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>()
  const navigation = useNavigation()
  const params: any = (route.params ?? {})
  const listingId = params.id

  const [stepIndex, setStepIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [request, setRequest] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsub: (() => void) | null = null
    async function start() {
      if (listingId && !requestId) {
        setLoading(true)
        setError(null)
        try{
          const r = await rentalService.createViewingRequest(listingId)
          setRequestId(r.id)
          setRequest(r)
          setStepIndex(0)
          // Subscribe to live updates for this request (mock of real-time backend)
          unsub = rentalService.subscribe(r.id, (updated) => {
            setRequest(updated)
            if (!updated) return
            switch (updated.status) {
              case 'requested': setStepIndex(0); break
              case 'invited': setStepIndex(1); break
              case 'contract_signed': setStepIndex(2); break
              case 'paid': setStepIndex(3); break
              case 'active': setStepIndex(4); break
            }
            if (updated.status === 'active') {
              // Navigate to ActiveRental replacing the flow
              navigation.replace('ActiveRental' as any, { requestId: updated.id })
            }
          })
        }catch(e){
          console.error(e)
          setError('Не удалось отправить заявку. Попробуйте ещё раз.')
        }
        finally{ setLoading(false) }
      }
    }
    start()
    return () => { if (unsub) unsub() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId])

  async function handleSignContract(){
    if (!requestId) return
    setLoading(true)
    setError(null)
    try{
      await rentalService.signContract(requestId)
    }catch(e){
      console.error(e)
      setError('Ошибка при подписании договора')
    }
    finally{ setLoading(false) }
  }

  async function handleBindCardAndPay(){
    if (!requestId) return
    setLoading(true)
    setError(null)
    try{
      // TODO: Здесь должна быть интеграция с Stripe для токенизации карты.
      await rentalService.bindCardAndPayFirstMonth(requestId, 'tok_test_card')
    }catch(e){
      console.error(e)
      setError('Ошибка при оплате карточкой')
    }
    finally{ setLoading(false) }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Оформление аренды</Text>
      <Text style={styles.sub}>Пошаговый процесс — от заявки до активации найма</Text>

      <Stepper steps={steps} currentIndex={stepIndex} />

      <View style={styles.content}>
        {loading && <ActivityIndicator color={theme.colors.primary} />}
        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        {request && (
          <View style={{ marginBottom: theme.spacing.md }}>
            <StatusBadge status={request.status} />
            <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: theme.spacing.xs }}>ID заявки: {request.id}</Text>
          </View>
        )}

        {stepIndex === 0 && (
          <View>
            <Text style={styles.title}>Заявка отправлена</Text>
            <Text style={styles.text}>Мы отправили вашу заявку на просмотр. Менеджер получит уведомление и пригласит на удобное время.</Text>
          </View>
        )}

        {stepIndex === 1 && (
          <View>
            <Text style={styles.title}>Приглашение на просмотр</Text>
            <Text style={styles.text}>Менеджер пригласил вас. После осмотра нажмите кнопку, чтобы отметить просмотр и перейти к договору.</Text>
            <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleSignContract} disabled={loading}>
              <Text style={styles.buttonText}>Я посетил осмотр / Подписать договор</Text>
            </TouchableOpacity>
          </View>
        )}

        {stepIndex === 2 && (
          <View>
            <Text style={styles.title}>Договор</Text>
            <Text style={styles.text}>Просмотрите условия договора. Нажмите, чтобы подтвердить подписание.</Text>
            <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleSignContract} disabled={loading}>
              <Text style={styles.buttonText}>Подписать договор</Text>
            </TouchableOpacity>
          </View>
        )}

        {stepIndex === 3 && (
          <View>
            <Text style={styles.title}>Привязка карты и оплата</Text>
            <Text style={styles.text}>Привяжите карту для ежемесячных списаний. Мы спишем первый платёж сразу.</Text>
            <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleBindCardAndPay} disabled={loading}>
              <Text style={styles.buttonText}>Привязать карту и оплатить</Text>
            </TouchableOpacity>
          </View>
        )}

        {stepIndex === 4 && (
          <View>
            <Text style={styles.title}>Наём активен</Text>
            <Text style={styles.text}>Поздравляем — ваш найм активен. Просматривать платежи и договор можно в профиле.</Text>
            <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.replace('ActiveRental' as any, { requestId })}>
              <Text style={styles.buttonOutlineText}>Открыть текущий наём</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { fontSize: theme.type.h2, fontWeight: '700', color: theme.colors.onSurface, padding: theme.spacing.md, paddingTop: theme.spacing.lg },
  sub: { color: theme.colors.onSurfaceVariant, paddingHorizontal: theme.spacing.md },
  content: { padding: theme.spacing.md, marginTop: theme.spacing.sm },
  title: { fontSize: theme.type.h3, fontWeight: '700', color: theme.colors.onSurface },
  text: { color: theme.colors.onSurfaceVariant, marginTop: theme.spacing.sm },
  button: { marginTop: theme.spacing.md, backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radii.md, alignItems: 'center' },
  buttonText: { color: theme.colors.onPrimary, fontWeight: '700' },
  buttonOutline: { marginTop: theme.spacing.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outline, padding: theme.spacing.md, borderRadius: theme.radii.md, alignItems: 'center' },
  buttonOutlineText: { color: theme.colors.onSurface }
})
