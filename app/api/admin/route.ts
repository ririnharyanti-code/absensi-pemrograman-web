import { createClient } from '@supabase/supabase-js'
export async function POST(req: Request) {
  const { password, action } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD) return Response.json({ error: 'Password salah' }, { status: 401 })
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // pertemuan "hari ini" diambil dari fungsi SQL yang sama dengan halaman mahasiswa
  const cur = (await db.rpc('get_meeting', { t: null })).data
  const byToken = () => db.from('meetings').select('*').eq('qr_token', cur.qr_token).single()
  let { data: m } = await byToken()

  if (action === 'toggle') await db.from('meetings').update({ status: m.status === 'open' ? 'closed' : 'open' }).eq('id', m.id)
  if (action === 'regen') {
    const newToken = crypto.randomUUID().slice(0, 8)
    await db.from('meetings').update({ qr_token: newToken }).eq('id', m.id)
    cur.qr_token = newToken
  }
  m = (await byToken()).data
  const live = (await db.rpc('get_meeting', { t: m.qr_token })).data?.status === 'open'

  const { data: students } = await db.from('students').select('id,name,npm').order('name')
  const { data: att } = await db.from('attendances').select('student_id,status,attendance_time').eq('meeting_id', m.id)
  return Response.json({ meeting: { ...m, live }, students, att })
}