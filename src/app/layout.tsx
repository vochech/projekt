import "./globals.css";
import SidebarNav from "../components/layout/SidebarNav";

export const metadata = {
  title: "projekt",
  description: "Employee-first workspace (MVP)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="antialiased text-gray-900">
        <div className="flex">
          {/* Sidebar */}
          <SidebarNav />
          {/* Content */}
          <div className="flex-1 min-h-screen">
            {/* Top bar (může být doplněn o user menu / search) */}
            <header className="h-14 border-b bg-white/70 backdrop-blur-sm flex items-center px-4">
              <div className="text-sm opacity-70">Employee interface</div>
            </header>
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
