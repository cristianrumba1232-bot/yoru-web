import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cdueiibdsiglwjookcjf.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdWVpaWJkc2lnbHdqb29rY2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDg1OTcsImV4cCI6MjA5ODMyNDU5N30.22_C4cvGHLQwhlxR2RR5fsXrjeOtvpp5YcKGK6dzNA0'

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
