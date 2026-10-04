'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Search, FileText, Heart, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase, STATUS, Status } from '../../lib/supabase'
const ICON = { hadir: Check, izin: FileText, sakit: Heart, alpa: AlertCircle }
function Form() {
  const t = useSearchParams().get('t')
  const [m, setM] = useState<any>(null), [q, setQ] = useState(''), [res, setRes] = useState<any[]>([])
  const [stu, setStu] = useState<any>(null), [st, setSt] = useState<Status | null>(null)
  const [step, setStep] = useState<'form' | 'confirm' | 'done'>('form'), [err, setErr] = useState(''), [busy, setBusy] = useState(false), [time, setTime] = useState('')
  useEffect(() => { supabase.rpc('get_meeting', { t }).then(r => setM(r.data)) }, [t])
  useEffect(() => { if (stu) return; supabase.rpc('search_students', { q }).then(r => setRes(r.data || [])) }, [q, stu])
  const submit = async () => {
    setBusy(true); setErr('')
    const { data } = await supabase.rpc('submit_attendance', { t: m.qr_token, n: stu.npm, s: st })
    setBusy(false)
    if (data?.ok) { setTime(new Date(data.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).replace('.', ':') + ' WIB'); setStep('done') }
    else { setErr(data?.error || 'Terjadi kesalahan.'); setStep('form') }
  }
  if (!m) return <p className="p-8 text-center text-slate-500">Memuat…</p>
  const open = m.status === 'open', tgl = new Date(m.date).toLocaleDateString('id-ID', { dateStyle: 'long' })
  if (step === 'done') return (<div className="fade rounded-3xl bg-white p-6 text-center shadow-md">
    <CheckCircle2 className="mx-auto text-green-600" size={64}/><h1 className="mt-3 text-2xl font-bold">Absensi Berhasil!</h1>
    <p className="text-slate-500">Data kehadiran Anda telah berhasil disimpan.</p>
    <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-left"><p className="font-semibold">{stu.name}</p><p className="text-sm text-slate-500">NPM: {stu.npm}</p>
      <span className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${STATUS[st!].dot}`}>{STATUS[st!].label.toUpperCase()}</span>
      <p className="mt-2 text-sm">{time} · Pertemuan ke-{m.meeting_number}</p></div>
    <a href="/" className="mt-5 block rounded-xl bg-indigo-600 py-3 font-semibold text-white">Kembali ke Beranda</a></div>)
  if (step === 'confirm') return (<div className="fade rounded-3xl bg-white p-6 shadow-md"><h1 className="text-xl font-bold">Konfirmasi Absensi</h1>
    <dl className="mt-4 space-y-2 text-sm">{[['Nama', stu.name], ['NPM', stu.npm], ['Status', STATUS[st!].label], ['Pertemuan', `Pertemuan ke-${m.meeting_number}`], ['Tanggal', tgl]].map(([a, b]) => <div key={a} className="flex justify-between border-b border-slate-100 pb-2"><dt className="text-slate-500">{a}</dt><dd className="font-medium">{b}</dd></div>)}</dl>
    <button disabled={busy} onClick={submit} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-semibold text-white active:scale-95 disabled:opacity-60">{busy && <Loader2 className="animate-spin" size={18}/>}Konfirmasi Absensi</button>
    <button onClick={() => setStep('form')} className="mt-2 w-full rounded-xl border border-indigo-600 py-3 font-semibold text-indigo-600">Kembali</button></div>)
  return (<div className="fade space-y-4">
    <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-400 p-5 text-white"><p className="text-sm opacity-90">Pemrograman Web</p><h1 className="text-xl font-bold">Absensi Pertemuan ke-{m.meeting_number}</h1><p className="mt-1 text-sm">{open ? '🟢 Absensi Dibuka' : '🔴 Absensi saat ini ditutup'}</p></div>
    {err && <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">{err}</p>}
    <div className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="mb-2 font-semibold">Identitas Mahasiswa</h2>
      {stu ? <div className="flex items-center justify-between rounded-xl bg-indigo-50 p-3"><div><p className="font-semibold">{stu.name}</p><p className="text-sm text-slate-500">{stu.npm}</p></div><button className="text-sm text-indigo-600" onClick={() => { setStu(null); setQ('') }}>Ganti</button></div> : <>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-indigo-500"><Search size={18} className="text-slate-400"/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Ketik nama atau NPM" className="w-full py-3 outline-none"/></div>
        {res.map(r => <button key={r.npm} onClick={() => setStu(r)} className="mt-2 block w-full rounded-xl border border-slate-100 p-3 text-left hover:bg-indigo-50"><span className="font-medium">{r.name}</span><span className="block text-sm text-slate-500">{r.npm}</span></button>)}</>}</div>
    <div className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="mb-3 font-semibold">Pilih Status Kehadiran</h2>
      <div className="grid grid-cols-2 gap-3">{(Object.keys(STATUS) as Status[]).map(k => { const I = ICON[k], on = st === k
        return <button key={k} onClick={() => setSt(k)} className={`relative rounded-2xl border-2 p-4 text-left transition duration-200 ${on ? STATUS[k].on : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:shadow-sm'}`}>
          {on && <Check size={16} className="absolute right-2 top-2"/>}<I size={24}/><p className="mt-2 font-bold">{STATUS[k].label.toUpperCase()}</p><p className="text-xs text-slate-500">{STATUS[k].desc}</p></button> })}</div></div>
    <button disabled={!open || !stu || !st} onClick={() => setStep('confirm')} className="w-full rounded-xl bg-indigo-600 py-4 font-semibold text-white transition hover:bg-indigo-700 active:scale-95 disabled:bg-slate-300">✓ KIRIM ABSENSI</button></div>)
}
export default function Page() { return <main className="mx-auto max-w-md px-4 py-6"><Suspense><Form/></Suspense></main> }
