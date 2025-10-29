import "./globals.css";
import SidebarNav from "../components/layout/SidebarNav";
import TopBarUser from "../components/layout/TopBarUser";

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
            {/* Top bar s user menu vpravo */}
            <header className="h-14 border-b bg-white/70 backdrop-blur-sm flex items-center justify-between px-4">
              <div className="text-sm opacity-70">Employee interface</div>
              <TopBarUser />
            </header>
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
