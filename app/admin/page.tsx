"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Users,
    Image as ImageIcon,
    LogOut,
    Download,
    Trash2,
    UploadCloud,
    Loader2,
    MessageSquareHeart,
} from "lucide-react";
import { toast } from "react-toastify";
import { AdminWishesClient } from "@/components/wishes/AdminWishesClient";

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

type Tab = "guests" | "memories" | "wishes";

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("guests");

    // Guests State
    const [guests, setGuests] = useState<WeddingForm[]>([]);
    const [loadingGuests, setLoadingGuests] = useState(true);

    // Memories State
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loadingMemories, setLoadingMemories] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Initial Data Fetch — auth is handled by middleware (cookie), no localStorage needed
    useEffect(() => {
        fetchGuests();
        fetchMemories();
    }, []);

    const fetchGuests = async () => {
        try {
            setLoadingGuests(true);
            const res = await fetch("/api/admin/forms");
            if (!res.ok) {
                console.error("Failed to fetch guests:", res.status);
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

    const deleteGuest = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn xóa "${name}" không?`)) return;
        try {
            const res = await fetch("/api/admin/forms", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error("Delete failed");
            setGuests(prev => prev.filter(g => g.id !== id));
            toast.success("Đã xóa.");
        } catch {
            toast.error("Không thể xóa.");
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

    const logout = async () => {
        try {
            // Clear the HttpOnly session cookie via the API
            await fetch("/api/admin/login", { method: "DELETE" });
        } catch {
            // Proceed with redirect regardless
        }
        router.push("/admin/login");
    };

    const exportExcel = async () => {
        const res = await fetch("/api/admin/export");
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
            const res = await fetch("/api/admin/memories", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("Photo uploaded successfully!");
                await fetchMemories();
            } else {
                toast.error("Failed to upload photo.");
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Network error. Upload failed.");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const handleDeleteMemory = async (id: string, imageUrl: string) => {
        if (!confirm("Are you sure you want to permanently delete this photo?")) return;

        setDeletingId(id);
        const loadingId = toast.loading("Deleting photo...");

        try {
            const res = await fetch("/api/admin/memories", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, imageUrl }),
            });

            if (res.ok) {
                toast.update(loadingId, { render: "Photo deleted!", type: "success", isLoading: false, autoClose: 3000 });
                await fetchMemories();
            } else {
                toast.update(loadingId, { render: "Failed to delete photo.", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (error) {
            console.error("Delete failed", error);
            toast.update(loadingId, { render: "Network error.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setDeletingId(null);
        }
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "guests", label: "Khách mời", icon: <Users className="w-4 h-4" /> },
        { id: "memories", label: "Ký ức", icon: <ImageIcon className="w-4 h-4" /> },
        { id: "wishes", label: "Lời chúc", icon: <MessageSquareHeart className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <div>
                        <h1 className="text-2xl font-serif text-neutral-900">Admin Dashboard</h1>
                        <p className="text-sm text-neutral-500 mt-1">Janes & Henry · Quản lý đám cưới.</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                    </button>
                </header>

                {/* Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-neutral-100 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? "bg-stone-900 text-white shadow"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <main className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-6">

                    {/* ── GUESTS TAB ── */}
                    {activeTab === "guests" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-neutral-900">Danh sách khách mời</h2>
                                <button
                                    onClick={exportExcel}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Export Excel
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
                                                <th className="px-6 py-4 font-medium">Tên</th>
                                                <th className="px-6 py-4 font-medium">Điện thoại</th>
                                                <th className="px-6 py-4 font-medium">Quan hệ</th>
                                                <th className="px-6 py-4 font-medium">Tham dự</th>
                                                <th className="px-6 py-4 font-medium max-w-xs">Lời nhắn</th>
                                                <th className="px-6 py-4 font-medium text-right">Thời gian</th>
                                                <th className="px-6 py-4 font-medium text-center">Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-200">
                                            {guests.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-8 text-center text-neutral-400">
                                                        Chưa có ai đăng ký. Hãy chờ một chút!
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
                                                                row.attendance === "attend" ? "bg-emerald-100 text-emerald-800" :
                                                                row.attendance === "online"  ? "bg-neutral-100 text-neutral-600" :
                                                                "bg-amber-100 text-amber-800"
                                                            }`}>
                                                                {row.attendance === "attend" ? "✓ Tham dự" : "Vắng"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-neutral-600 max-w-xs truncate" title={row.message}>
                                                            {row.message || "-"}
                                                        </td>
                                                        <td className="px-6 py-4 text-neutral-500 text-right whitespace-nowrap">
                                                            {new Date(row.submitted_at).toLocaleDateString("vi-VN", {
                                                                year: "numeric", month: "short", day: "numeric",
                                                                hour: "2-digit", minute: "2-digit",
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={() => deleteGuest(row.id, row.name)}
                                                                className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                                                                title="Xóa khách này"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
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

                    {/* ── MEMORIES TAB ── */}
                    {activeTab === "memories" && (
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="text-lg font-medium text-neutral-900">Thư viện ảnh</h2>
                                    <p className="text-sm text-neutral-500">Tải lên và quản lý ảnh hiển thị trên trang chính.</p>
                                </div>
                                <label className="relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer transition-colors shadow-sm">
                                    {isUploading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Đang tải lên...</>
                                    ) : (
                                        <><UploadCloud className="w-4 h-4" /> Tải ảnh lên</>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
                                </label>
                            </div>

                            {loadingMemories ? (
                                <div className="py-20 flex justify-center items-center text-neutral-400">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            ) : memories.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50">
                                    <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                    <h3 className="text-sm font-medium text-neutral-900">Chưa có ảnh nào</h3>
                                    <p className="text-sm text-neutral-500 mt-1">Tải lên ảnh đầu tiên để bắt đầu.</p>
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
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                                                <button
                                                    onClick={() => handleDeleteMemory(img.id, img.image_url)}
                                                    disabled={deletingId === img.id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    {deletingId === img.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <><Trash2 className="w-4 h-4" /> Xóa</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── WISHES TAB ── */}
                    {activeTab === "wishes" && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-lg font-medium text-neutral-900">Quản lý lời chúc</h2>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Duyệt, ghim hoặc xóa lời chúc từ khách mời. Chỉ lời chúc đã duyệt mới hiển thị công khai.
                                </p>
                            </div>
                            <AdminWishesClient />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
