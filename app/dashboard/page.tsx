'use client'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Users, Check, FileText, Heart, AlertCircle } from 'lucide-react'
import { STATUS, Status } from '../../lib/supabase'
export default function Dashboard() {
  const [pw, setPw] = useState(''), [d, setD] = useState<any>(null), [err, setErr] = useState(''), [f, setF] = useState('semua'), [q, setQ] = useState('')
  const call = async (action = 'list') => { const r = await fetch('/api/admin', { method: 'POST', body: JSON.stringify({ password: pw, action }) }); const j = await r.json(); r.ok ? (setD(j), setErr('')) : setErr(j.error) }
  if (!d) return (<main className="mx-auto max-w-sm px-4 py-16"><div className="rounded-2xl bg-white p-6 shadow-sm"><h1 className="mb-3 text-xl font-bold">Dashboard Dosen</h1>
    <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Password admin" className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-500"/>
    {err && <p className="mt-2 text-sm text-red-600">{err}</p>}<button onClick={() => call()} className="mt-3 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white">Masuk</button></div></main>)
  const { meeting: m, students, att } = d
  const rows = students.map((s: any, i: number) => { const a = att.find((x: any) => x.student_id === s.id); return { no: i + 1, ...s, status: a?.status as Status | undefined, time: a ? new Date(a.attendance_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) : '-' } })
  const cnt = (k: string) => rows.filter((r: any) => r.status === k).length
  const shown = rows.filter((r: any) => (f === 'semua' || r.status === f) && (r.name + r.npm).toLowerCase().includes(q.toLowerCase()))
  const open = m.status === 'open'
  const cards = [[Users, 'Total Mahasiswa', rows.length, 'text-indigo-600 bg-indigo-50'], [Check, 'Hadir', cnt('hadir'), 'text-green-600 bg-green-50'], [FileText, 'Izin', cnt('izin'), 'text-blue-600 bg-blue-50'], [Heart, 'Sakit', cnt('sakit'), 'text-orange-600 bg-orange-50'], [AlertCircle, 'Alpa', cnt('alpa'), 'text-red-600 bg-red-50']] as const
  return (<main className="fade mx-auto max-w-5xl space-y-5 px-4 py-6">
    <h1 className="text-2xl font-bold">Absensi Pemrograman Web <span className="text-base font-medium text-slate-500">· Pertemuan ke-{m.meeting_number}</span></h1>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{cards.map(([I, l, n, c]) => <div key={l} className="rounded-2xl bg-white p-4 shadow-sm"><span className={`inline-flex rounded-lg p-2 ${c}`}><I size={18}/></span><p className="mt-2 text-sm text-slate-500">{l}</p><p className="text-2xl font-bold">{n}</p></div>)}</div>
    <div className="grid gap-5 md:grid-cols-3">
      <div className="rounded-2xl bg-white p-5 text-center shadow-sm"><h2 className="font-semibold">QR Code Absensi</h2>
        <div className="my-3 flex justify-center"><QRCodeSVG value={`${location.origin}/attendance?t=${m.qr_token}`} size={180}/></div>
        <p className="text-sm">{open ? '🟢 Absensi Dibuka' : '🔴 Absensi Ditutup'}</p>
        <button onClick={() => call('toggle')} className={`mt-3 w-full rounded-xl py-2.5 font-semibold text-white ${open ? 'bg-red-600' : 'bg-green-600'}`}>{open ? 'Tutup Absensi' : 'Buka Absensi'}</button>
        <button onClick={() => call('regen')} className="mt-2 w-full rounded-xl border border-indigo-600 py-2.5 font-semibold text-indigo-600">Regenerate QR</button></div>
      <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-2"><div className="mb-3 flex flex-wrap gap-2">
        {['semua', 'hadir', 'izin', 'sakit', 'alpa'].map(k => <button key={k} onClick={() => setF(k)} className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${f === k ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'}`}>{k}</button>)}</div>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari nama atau NPM..." className="mb-3 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-indigo-500"/>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-slate-500"><tr>{['No', 'Nama', 'NPM', 'Status', 'Waktu'].map(h => <th key={h} className="p-2">{h}</th>)}</tr></thead>
          <tbody>{shown.map((r: any) => <tr key={r.id} className="border-t border-slate-100"><td className="p-2">{r.no}</td><td className="p-2 font-medium">{r.name}</td><td className="p-2">{r.npm}</td>
            <td className="p-2">{r.status ? <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS[r.status as Status].dot}`}>{STATUS[r.status as Status].label}</span> : <span className="text-slate-400">Belum absen</span>}</td><td className="p-2">{r.time}</td></tr>)}</tbody></table></div></div></div>
  </main>)
}
