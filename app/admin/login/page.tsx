"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      alert("Wrong password");
      return;
    }

    const data = await res.json();
    localStorage.setItem("admin_token", data.token);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-6 rounded w-80">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>

        <input
          type="password"
          className="border w-full p-2 mb-4"
          placeholder="Admin password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-black text-white w-full py-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}
