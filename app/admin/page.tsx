"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, Image as ImageIcon, LogOut, Download, Trash2, UploadCloud, Loader2 } from "lucide-react";

type WeddingForm = {
    id: string;
    name: string;
    phone: string;
    relationship: string;
    message: string;
    attendance: string;
    submitted_at: string;
};

type Memory = {
    id: string;
    image_name: string;
    image_url: string;
};

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"guests" | "memories">("guests");
    
    // Guests State
    const [guests, setGuests] = useState<WeddingForm[]>([]);
    const [loadingGuests, setLoadingGuests] = useState(true);

    // Memories State
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loadingMemories, setLoadingMemories] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Initial Auth & Data Fetch
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        fetchGuests(token);
        fetchMemories();
    }, [router]);

    const fetchGuests = async (token: string) => {
        try {
            setLoadingGuests(true);
            const res = await fetch("/api/admin/forms", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 401) {
                localStorage.removeItem("admin_token");
                router.push("/admin/login");
                return;
            }
            const data = await res.json();
            if (data) setGuests(data);
        } catch (error) {
            console.error("Failed to fetch guests", error);
        } finally {
            setLoadingGuests(false);
        }
    };

    const fetchMemories = async () => {
        try {
            setLoadingMemories(true);
            const res = await fetch("/api/memories");
            const data = await res.json();
            if (Array.isArray(data)) setMemories(data);
        } catch (error) {
            console.error("Failed to fetch memories", error);
        } finally {
            setLoadingMemories(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
    };

    const exportExcel = async () => {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/export", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wedding-guests.xlsx";
        a.click();
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await fetch("/api/admin/memories", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
                body: formData,
            });
            await fetchMemories();
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const handleDeleteMemory = async (id: string, imageUrl: string) => {
        if (!confirm("Are you sure you want to permanently delete this photo?")) return;

        setDeletingId(id);
        try {
            await fetch("/api/admin/memories", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
                body: JSON.stringify({ id, imageUrl }),
            });
            await fetchMemories();
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <div>
                        <h1 className="text-2xl font-serif text-neutral-900">Admin Dashboard</h1>
                        <p className="text-sm text-neutral-500 mt-1">Manage your wedding guests and memories.</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </header>

                {/* Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-neutral-100 md:w-max">
                    <button
                        onClick={() => setActiveTab("guests")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === "guests"
                                ? "bg-stone-900 text-white shadow"
                                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        Wedding Guests
                    </button>
                    <button
                        onClick={() => setActiveTab("memories")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === "memories"
                                ? "bg-stone-900 text-white shadow"
                                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                        }`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        Memories
                    </button>
                </div>

                {/* Content Area */}
                <main className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                    
                    {/* GUESTS TAB */}
                    {activeTab === "guests" && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-neutral-900">Guest List</h2>
                                <button
                                    onClick={exportExcel}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Export to Excel
                                </button>
                            </div>

                            {loadingGuests ? (
                                <div className="py-20 flex justify-center items-center text-neutral-400">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-neutral-200">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-neutral-500 uppercase bg-neutral-50">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Name</th>
                                                <th className="px-6 py-4 font-medium">Phone</th>
                                                <th className="px-6 py-4 font-medium">Relationship</th>
                                                <th className="px-6 py-4 font-medium">Attendance</th>
                                                <th className="px-6 py-4 font-medium max-w-xs">Message</th>
                                                <th className="px-6 py-4 font-medium text-right">Submitted At</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-200">
                                            {guests.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                                                        No submissions yet. Check back later!
                                                    </td>
                                                </tr>
                                            ) : (
                                                guests.map((row) => (
                                                    <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-neutral-900">{row.name}</td>
                                                        <td className="px-6 py-4 text-neutral-600">{row.phone}</td>
                                                        <td className="px-6 py-4 text-neutral-600">{row.relationship}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                                row.attendance === 'Yes' ? 'bg-emerald-100 text-emerald-800' : 
                                                                row.attendance === 'No' ? 'bg-red-100 text-red-800' : 
                                                                'bg-amber-100 text-amber-800'
                                                            }`}>
                                                                {row.attendance}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-neutral-600 max-w-xs truncate" title={row.message}>{row.message || '-'}</td>
                                                        <td className="px-6 py-4 text-neutral-500 text-right whitespace-nowrap">
                                                            {new Date(row.submitted_at).toLocaleDateString("vi-VN", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MEMORIES TAB */}
                    {activeTab === "memories" && (
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="text-lg font-medium text-neutral-900">Photo Gallery</h2>
                                    <p className="text-sm text-neutral-500">Upload and manage memories to show on the main page.</p>
                                </div>
                                
                                {/* Custom Upload Button */}
                                <div>
                                    <label className="relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer transition-colors shadow-sm">
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud className="w-4 h-4" />
                                                Upload Photo
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            {loadingMemories ? (
                                <div className="py-20 flex justify-center items-center text-neutral-400">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            ) : memories.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50">
                                    <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                    <h3 className="text-sm font-medium text-neutral-900">No memories yet</h3>
                                    <p className="text-sm text-neutral-500 mt-1">Upload an image to start filling out the gallery.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {memories.map((img) => (
                                        <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 shadow-sm border border-neutral-200">
                                            <Image
                                                src={img.image_url}
                                                alt={img.image_name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            />
                                            {/* Delete Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                                                <button
                                                    onClick={() => handleDeleteMemory(img.id, img.image_url)}
                                                    disabled={deletingId === img.id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    {deletingId === img.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
