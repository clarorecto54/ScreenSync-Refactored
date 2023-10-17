import { SocketProvider } from '@/components/hooks/useSocket'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GlobalContextProvider } from '@/components/hooks/useGlobals'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ScreenSync',
  description: 'TUPC Screen Mirroring Solution',
  icons: {
    icon: "/_logo__tup_COQ_icon.ico"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalContextProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </GlobalContextProvider>
      </body>
    </html>
  )
}
