"use client";

import { useState } from "react";

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
    <section className="py-24 px-6 bg-[#FFF5F5]">
      <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-accent/10">
        <h2 className="text-3xl md:text-5xl font-serif text-center mb-8 text-foreground">
          Send Your Wishes
        </h2>
        <p className="text-center text-muted mb-10">
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

          {success && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-2xl text-center border border-green-100">
              Thank you! Your RSVP has been received. 🤍
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
