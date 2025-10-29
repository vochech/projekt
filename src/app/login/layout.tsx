// src/app/login/layout.tsx
export const metadata = {
  title: "Login",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      {children}
    </div>
  );
}
