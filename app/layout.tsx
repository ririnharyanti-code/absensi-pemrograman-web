import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
export const metadata = { title: 'Absensi Pemrograman Web' }
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="id" className={inter.variable}><body>
    <nav className="sticky top-0 z-10 border-b border-indigo-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-indigo-600"><GraduationCap size={22}/>Web Absensi</Link>
        <div className="flex gap-5 text-sm font-medium text-slate-600"><Link href="/attendance">Absensi</Link><Link href="/dashboard">Dashboard</Link></div>
      </div></nav>{children}</body></html>)
}
