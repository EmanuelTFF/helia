import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { anonKey, supaUrl } from '@/constants/supabase'

const supabaseUrl = supaUrl
const supabaseAnonKey = anonKey

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
