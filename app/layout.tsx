import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Meeting Workspace – Rakumon Edition', description: 'Rakumon weekly meeting report workspace' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>}
