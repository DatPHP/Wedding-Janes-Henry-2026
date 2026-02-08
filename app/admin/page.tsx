"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type WeddingForm = {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  message: string;
  attendance: string;
  submitted_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<WeddingForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    // ❌ Chưa login
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // ✅ Đã login → gọi API có Authorization
    fetch("/api/admin/forms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setData(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const exportExcel = async () => {
    const token = localStorage.getItem("admin_token");

    const res = await fetch("/api/admin/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-guests.xlsx";
    a.click();
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Wedding Guests Dashboard
        </h1>

        <div className="flex gap-3">
          <button
            onClick={exportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Export Excel
          </button>

          <button
            onClick={logout}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Relationship</th>
              <th className="border p-2">Attendance</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No submissions yet
                </td>
              </tr>
            )}

            {data.map(row => (
              <tr key={row.id}>
                <td className="border p-2">{row.name}</td>
                <td className="border p-2">{row.phone}</td>
                <td className="border p-2">{row.relationship}</td>
                <td className="border p-2">{row.attendance}</td>
                <td className="border p-2">{row.message}</td>
                <td className="border p-2">
                  {new Date(row.submitted_at).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
