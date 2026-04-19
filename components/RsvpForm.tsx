"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { toast } from "react-toastify";
import { z } from "zod";

const rsvpSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ và tên"),
  phone: z.string().regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0."),
  relationship: z.string().min(1, "Vui lòng chọn mối quan hệ"),
  message: z.string().optional().default(""),
  attendance: z.string().min(1, "Vui lòng chọn xác nhận tham dự"),
});


export default function RsvpForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    relationship: "",
    message: "",
    attendance: "attend",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zod validation
    const result = rsvpSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setForm({
          name: "",
          phone: "",
          relationship: "",
          message: "",
          attendance: "attend",
        });
      } else {
        toast.error(data.error || "Gửi thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Lỗi mạng. Vui lòng kiểm tra kết nối internet.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full relative">
      <div className="w-full bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 relative z-10">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[3px] uppercase text-rose-400 mb-3">
            ✦ Gửi lời chúc ✦
          </p>
          <h2 className="text-4xl font-serif text-neutral-900 mb-4">
            Chúng tôi trân trọng sự hiện diện của bạn
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-sm leading-relaxed">
            Điền thông tin xác nhận tham dự và để lại lời chúc. Lời chúc của bạn sẽ
            xuất hiện ngay lập tức trên trang này.
          </p>
        </div>

        <form onSubmit={submitForm} className="space-y-6">
          <div>
            <input
              name="name"
              placeholder="Họ và Tên"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-background/50 border border-muted/20 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-black"
            />
          </div>
          <div>
            <input
              name="phone"
              type="tel"
              placeholder="Số Điện Thoại"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full bg-background/50 border border-muted/20 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-black"
            />
          </div>

          <div>
            <select
              name="relationship"
              value={form.relationship}
              onChange={handleChange}
              required
              className="w-full bg-background/50 border border-muted/20 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-black appearance-none"
            >
              <option value="">Mối Quan Hệ</option>
              <option value="Family">Gia đình</option>
              <option value="Friend">Bạn bè</option>
              <option value="Relative">Họ hàng</option>
              <option value="Colleague">Đồng nghiệp</option>
              <option value="Neighbor">Hàng xóm</option>
            </select>
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Gửi lời chúc đến Janes & Henry..."
              value={form.message}
              onChange={handleChange}
              className="w-full bg-background/50 border border-muted/20 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[120px] text-black resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2 pb-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${form.attendance === "attend" ? "border-accent bg-accent" : "border-muted/30 group-hover:border-accent/50"}`}>
                {form.attendance === "attend" && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <input
                type="radio"
                name="attendance"
                value="attend"
                checked={form.attendance === "attend"}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-black">Sẵn Sàng Tham Dự</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${form.attendance === "online" ? "border-accent bg-accent" : "border-muted/30 group-hover:border-accent/50"}`}>
                {form.attendance === "online" && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <input
                type="radio"
                name="attendance"
                value="online"
                checked={form.attendance === "online"}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-black">Xin Phép Vắng Mặt</span>
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full bg-accent text-white py-4 rounded-2xl font-medium tracking-wide hover:brightness-110 hover:-translate-y-1 transition-all focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
          >
            {loading ? "Đang Gửi..." : "Xác Nhận"}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSuccess(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white p-10 md:p-14 rounded-[32px] shadow-2xl relative z-10 max-w-md w-full border border-accent/10 text-center"
            >
                <button 
                    onClick={() => setSuccess(false)}
                    className="absolute top-6 right-6 text-muted hover:text-black transition-colors bg-background rounded-full p-2"
                >
                    <X size={20} />
                </button>
                
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-accent fill-accent animate-pulse" size={32} />
                </div>

                <h3 className="text-3xl font-serif text-accent mb-4">Cảm Ơn Bạn!</h3>
                <p className="text-lg text-muted mb-8">
                  Xác nhận của bạn đã được gửi thành công. Sự yêu thương của bạn là thước đo hạnh phúc của chúng tôi!
                </p>

                <p className="font-script text-2xl text-accent/80">
                  Với trọn tình yêu, Janes & Henry
                </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
