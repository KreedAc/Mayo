import type { Metadata } from 'next'
import '../../styles/mayo.css'
import '../../styles/admin.css'

export const metadata: Metadata = {
  title: 'MAYO Admin — Area Riservata',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
