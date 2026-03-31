"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";

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
    setLoading(true);

    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setForm({
        name: "",
        phone: "",
        relationship: "",
        message: "",
        attendance: "attend",
      });
    }

    setLoading(false);
  };

  return (
    <section className="py-24 px-6 bg-[#FFF5F5] relative">
      <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-accent/10 relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif text-center mb-8 text-foreground">
          Send Your Wishes
        </h2>
        <p className="text-center text-foreground/80 mb-10">
          We would be honored to have you celebrate our special day with us.
        </p>

        <form onSubmit={submitForm} className="space-y-6">
          <div>
            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-background/50 border border-muted/20 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-foreground"
            />
          </div>
          <div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full bg-background/50 border border-muted/20 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-foreground"
            />
          </div>

          <div>
            <select
              name="relationship"
              value={form.relationship}
              onChange={handleChange}
              required
              className="w-full bg-background/50 border border-muted/20 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-foreground appearance-none"
            >
              <option value="">Relationship</option>
              <option>Family</option>
              <option>Friend</option>
              <option>Relative</option>
              <option>Colleague</option>
              <option>Neighbor</option>
            </select>
          </div>

          <div>
            <textarea
              name="message"
              placeholder="A message for Janes & Henry..."
              value={form.message}
              onChange={handleChange}
              className="w-full bg-background/50 border border-muted/20 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[120px] text-foreground resize-none"
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
              <span className="text-foreground">Joyfully Accept</span>
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
              <span className="text-foreground">Regretfully Decline</span>
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full bg-accent text-white py-4 rounded-2xl font-medium tracking-wide hover:bg-[#E05B92] transition-colors focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
          >
            {loading ? "Sending..." : "Confirm RSVP"}
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
                    className="absolute top-6 right-6 text-muted hover:text-foreground transition-colors bg-background rounded-full p-2"
                >
                    <X size={20} />
                </button>
                
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-accent fill-accent animate-pulse" size={32} />
                </div>

                <h3 className="text-3xl font-serif text-accent mb-4">Thank You!</h3>
                <p className="text-lg text-muted mb-8">
                  Your response has been received. We are so grateful for your love and support!
                </p>

                <p className="font-script text-2xl text-accent/80">
                  With love, Janes & Henry
                </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
