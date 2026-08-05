import "./globals.css"
import AppShell from "@/components/layout/AppShell"
import StoreProvider from "@/store/provider"
import ToastContainer from "@/components/ui/ToastContainer"

export const metadata = {
  title: "mohsion",
  description: "A collaborative task manager with realtime capabilities.",
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <StoreProvider>
          <AppShell>{children}</AppShell>
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  )
}
