import '@/app/globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Tian's Mini World",
  description: 'A personal digital universe showing my global connections and experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <html lang="en">
    <body>
      {children}
    </body>
  </html>;
}
