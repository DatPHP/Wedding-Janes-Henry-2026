"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
  
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
  
    fetch("/api/admin/forms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        return res.json();
      })
      .then(setData);
  }, []);
  

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Wedding Guest Submissions
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Relationship</th>
            <th>Attendance</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.phone}</td>
              <td>{row.relationship}</td>
              <td>{row.attendance}</td>
              <td>
                {new Date(row.submitted_at).toLocaleString("vi-VN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
