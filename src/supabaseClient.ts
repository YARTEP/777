import { createClient } from '@supabase/supabase-js'

// Жёстко прописываем ключи (без переменных окружения)
const supabaseUrl = 'https://dcftxrbokaymopwfjznz.supabase.co'
const supabaseAnonKey = 'sb_publishable_E3ZR3rreGqtZRS-Mdw6L6A_tRU_tZh6'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
