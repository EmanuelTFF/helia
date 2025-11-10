import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { anonKey, supaUrl } from '@/constants/supabase'

const supabaseUrl = "https://pyetqzwcuglgesbrddse.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZXRxendjdWdsZ2VzYnJkZHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Njc0MzIsImV4cCI6MjA2NTI0MzQzMn0.XlMw_hfuTC_nDOGF4Ly9PKMEq_FppJmOtE5apwGUXPA"

// Verificação básica de configuração
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e/ou anon key não foram definidos corretamente.')
}

// Criação do cliente Supabase com persistência de sessão
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Evita múltiplos listeners ao usar AppState
let autoRefreshInitialized = false

function initAutoRefresh() {
  if (autoRefreshInitialized) return
  autoRefreshInitialized = true

  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}

// Inicia o controle de auto refresh
initAutoRefresh()

export default supabase
