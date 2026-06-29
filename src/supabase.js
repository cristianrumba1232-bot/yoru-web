import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ldxtoykbcuypjfyerhoo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkeHRveWtiY3V5cGpmeWVyaG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDkwMjksImV4cCI6MjA5NzQ4NTAyOX0.tiHApVfW5K3_2Nn3p7HsTj3SqeHwyGsRYlduY4CZbXc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.auth.getSession()
    if (error) {
      console.error('❌ Error de conexión con Supabase:', error)
    } else {
      console.log('✅ Supabase conectado correctamente')
    }
  } catch (error) {
    console.error('❌ Error de conexión con Supabase:', error)
  }
}
