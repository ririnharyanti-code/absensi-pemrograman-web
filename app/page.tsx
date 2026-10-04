'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CalendarDays, QrCode, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
export default function Home() {
  const [m, setM] = useState<any>(null)
  useEffect(() => { supabase.rpc('get_meeting').then(r => setM(r.data)) }, [])
  const open = m.status === 'open', live = m.live
  return (<main className="mx-auto max-w-md px-4 py-8 fade">
    <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-400 p-6 text-white shadow-md">
      <div className="mb-4 flex gap-3 opacity-90"><CalendarDays/><CheckCircle2/><QrCode/></div>
      <p className="text-sm font-medium opacity-90">Sistem Absensi Online</p>
      <h1 className="text-3xl font-bold">Pemrograman Web</h1>
      <p className="mt-2 text-sm opacity-90">Absensi kuliah menjadi lebih mudah, cepat, dan terorganisir.</p>
    </section>
    {m && <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
      <p className="font-semibold">Pertemuan ke-{m.meeting_number}</p>
      <p className="text-sm text-slate-500">{new Date(m.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
      <p className="text-sm">{live ? '🟢 Absensi Dibuka' : '🔴 Absensi Ditutup'}</p>
      <p className="text-xs text-slate-500">Jadwal {m.start_time?.slice(0, 5)}–{m.end_time?.slice(0, 5)} WIB</p>
      {open && <Link href={`/attendance?t=${m.qr_token}`} className="mt-4 block rounded-xl bg-indigo-600 py-4 text-center font-semibold text-white transition hover:bg-indigo-700 active:scale-95">MULAI ABSENSI</Link>}
    </div>}
    <p className="mt-4 text-center text-sm text-slate-500">📷 Atau scan QR Code dari dosen menggunakan kamera HP.</p>
  </main>)
}
