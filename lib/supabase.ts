import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export const STATUS = {
  hadir: { label: 'Hadir', desc: 'Hadir mengikuti perkuliahan', on: 'border-green-600 bg-green-50 text-green-600', dot: 'bg-green-100 text-green-700' },
  izin: { label: 'Izin', desc: 'Tidak hadir dengan izin', on: 'border-blue-600 bg-blue-50 text-blue-600', dot: 'bg-blue-100 text-blue-700' },
  sakit: { label: 'Sakit', desc: 'Tidak hadir karena sakit', on: 'border-orange-600 bg-orange-50 text-orange-600', dot: 'bg-orange-100 text-orange-700' },
  alpa: { label: 'Alpa', desc: 'Tidak hadir tanpa keterangan', on: 'border-red-600 bg-red-50 text-red-600', dot: 'bg-red-100 text-red-700' },
} as const
export type Status = keyof typeof STATUS
