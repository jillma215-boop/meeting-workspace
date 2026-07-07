import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My World – Jill Workspace',
  description: "Jill's personal workspace for Work, Rakumon, and reports",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ja"><body>{children}</body></html>;
}
