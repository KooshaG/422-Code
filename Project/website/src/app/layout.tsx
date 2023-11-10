import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextAuthProvider } from '@/NextAuthProvider'
import TRPCProvider from '@/trpc/client'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <TRPCProvider>
          <body className={inter.className}>{children}</body>
        </TRPCProvider>
      </NextAuthProvider>
    </html>
  )
}
