"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Lock, KeyRound } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json.message ?? "Mật khẩu không đúng");
        setLoading(false);
        return;
      }

      // Cookie is set automatically by the API (HttpOnly).
      toast.success("Chào mừng trở lại! 💍");
      router.push("/admin");
    } catch {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent-light blur-3xl opacity-50" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-accent-light blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[32px] p-8 md:p-12 text-center">
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center shadow-inner">
              <Heart className="w-8 h-8 text-accent fill-accent/20" />
            </div>
          </div>

          <h1 className="text-3xl font-serif text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted text-sm mb-8">
            Access the wedding dashboard to manage guests and memories.
          </p>

          <form onSubmit={login} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-muted/50" />
              </div>
              <input
                type="password"
                className="w-full pl-11 pr-4 py-4 bg-white border border-muted/20 rounded-2xl outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground placeholder:-muted/50 shadow-sm"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-white py-4 rounded-2xl font-medium tracking-wide hover:bg-neutral-800 transition-colors focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Secure Login
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-muted/10">
            <p className="font-script text-2xl text-accent/80">Janes & Henry</p>
          </div>
        </div>
      </div>
    </div>
  );
}
