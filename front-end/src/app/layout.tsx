"use client"

import "./globals.css"
import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"
import  StoreProvider from "@/store/provider"


export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)


  return (
    <html lang="en">
      <body className="bg-black text-white">

        <StoreProvider>

          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className='min-h-screen flex flex-col'>

            <Navbar onMenuClick={() => setSidebarOpen(true)} />

            <main className="flex-1">
              {children}
            </main>

          </div>

        </StoreProvider>

      </body>
    </html>
  )
}
