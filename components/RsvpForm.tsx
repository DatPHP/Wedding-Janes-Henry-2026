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
    <section className="py-20 px-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-serif text-center mb-8">
        Send Your Wishes 💌
      </h2>

      <form onSubmit={submitForm} className="space-y-4">
        <input
          name="name"
          placeholder="Tên của bạn"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
            name="phone"
            type="tel"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3"
        />

        <select
          name="relationship"
          value={form.relationship}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-3"
        >
          <option value="">Quan hệ</option>
          <option>Gia đình</option>
          <option>Bạn bè</option>
          <option>Anh em họ</option>
          <option>Đồng nghiệp</option>
          <option>Khách hàng</option>
          <option>Hàng xóm</option>
        </select>

        <textarea
          name="message"
          placeholder="Lời chúc dành cho Janes & Henry"
          value={form.message}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 min-h-[120px]"
        />

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="attendance"
              value="attend"
              checked={form.attendance === "attend"}
              onChange={handleChange}
            />
            Đi trực tiếp
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="attendance"
              value="online"
              checked={form.attendance === "online"}
              onChange={handleChange}
            />
            Gửi thiệp online
          </label>
        </div>

        <button
          disabled={loading}
          className="w-full bg-rose-500 text-white py-3 rounded-xl hover:bg-rose-600 transition"
        >
          {loading ? "Đang gửi..." : "Gửi lời chúc"}
        </button>

        {success && (
          <p className="text-center text-green-600">
            Cảm ơn bạn đã gửi lời chúc ❤️
          </p>
        )}
      </form>
    </section>
  );
}
