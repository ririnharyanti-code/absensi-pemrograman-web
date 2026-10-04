import { createClient } from '@supabase/supabase-js'
export async function POST(req: Request) {
  const { password, action } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD) return Response.json({ error: 'Password salah' }, { status: 401 })
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const latest = () => db.from('meetings').select('*').order('date', { ascending: false }).order('meeting_number', { ascending: false }).limit(1).single()
  let { data: m } = await latest()
  if (action === 'toggle') await db.from('meetings').update({ status: m.status === 'open' ? 'closed' : 'open' }).eq('id', m.id)
  if (action === 'regen') await db.from('meetings').update({ qr_token: crypto.randomUUID().slice(0, 8) }).eq('id', m.id)
  m = (await latest()).data
  const { data: students } = await db.from('students').select('id,name,npm').order('name')
  const { data: att } = await db.from('attendances').select('student_id,status,attendance_time').eq('meeting_id', m.id)
  return Response.json({ meeting: m, students, att })
}
