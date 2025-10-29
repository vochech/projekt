"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      <p className="text-sm opacity-70">
        {email ? <>Přihlášen: <strong>{email}</strong></> : "Nejste přihlášen."}
      </p>
    </div>
  );
}
