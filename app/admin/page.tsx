"use client";

import { useEffect, useState, useRef } from "react";
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
    Layers,
    CheckCircle2,
    Star,
    X,
    UserCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { upload } from "@vercel/blob/client";

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

type Background = {
    id: string;
    label: string;
    image_url: string;
    file_path: string;
    is_active: boolean;
    created_at: string;
};

type Avatar = {
    id: number;
    person: "bride" | "groom";
    image_url: string;
    file_path: string;
    is_active: boolean;
    created_at: string;
};

type Tab = "guests" | "memories" | "backgrounds" | "avatars";

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

    // Backgrounds State
    const [backgrounds, setBackgrounds] = useState<Background[]>([]);
    const [loadingBgs, setLoadingBgs] = useState(true);
    const [uploadingBg, setUploadingBg] = useState(false);
    const [deletingBgId, setDeletingBgId] = useState<string | null>(null);
    const [settingActiveId, setSettingActiveId] = useState<string | null>(null);
    const [bgLabelInput, setBgLabelInput] = useState("");
    const bgFileRef = useRef<HTMLInputElement>(null);

    // Avatars State
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [loadingAvatars, setLoadingAvatars] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState<"bride" | "groom" | null>(null);
    const [deletingAvatarId, setDeletingAvatarId] = useState<number | null>(null);
    const [settingAvatarActiveId, setSettingAvatarActiveId] = useState<number | null>(null);
    const brideFileRef = useRef<HTMLInputElement>(null);
    const groomFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchGuests();
        fetchMemories();
        fetchBackgrounds();
        fetchAvatars();
    }, []);

    /* ─── Guests ──────────────────────────────────────────────────────────── */
    const fetchGuests = async () => {
        try {
            setLoadingGuests(true);
            const res = await fetch("/api/admin/forms");
            if (!res.ok) { console.error("Failed to fetch guests:", res.status); return; }
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

    /* ─── Memories ────────────────────────────────────────────────────────── */
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

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            // 1. Upload trực tiếp từ browser → Vercel Blob (bypass 4.5MB serverless limit)
            const newBlob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/admin/memories",
            });

            // 2. Lưu URL vào DB qua PUT (đáng tin cậy hơn onUploadCompleted webhook)
            const saveRes = await fetch("/api/admin/memories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: newBlob.url, name: file.name }),
            });

            if (!saveRes.ok) {
                console.warn("PUT save failed, webhook may have handled it");
            }

            toast.success("Photo uploaded successfully!");
            await fetchMemories();
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Upload failed. Please try again.");
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

    /* ─── Backgrounds ─────────────────────────────────────────────────────── */

    const fetchBackgrounds = async () => {
        try {
            setLoadingBgs(true);

            const res = await fetch("/api/backgrounds", {
                cache: "no-store",
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || "Không thể tải danh sách hình nền.");
            }

            if (!Array.isArray(data)) {
                throw new Error("API hình nền trả về dữ liệu không hợp lệ.");
            }

            setBackgrounds(data);
        } catch (error) {
            console.error("Failed to fetch backgrounds:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Không thể tải danh sách hình nền."
            );
        } finally {
            setLoadingBgs(false);
        }
    };


    const handleBgUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = e.currentTarget;
        const file = input.files?.[0];

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.");
            input.value = "";
            return;
        }

        const label = bgLabelInput.trim() || file.name;


        setUploadingBg(true);
        const tid = toast.loading("Đang tải lên hình nền...");

        try {
            // 1. Upload trực tiếp browser → Vercel Blob (không giới hạn size)
            const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
            const blobPathname = `backgrounds/${crypto.randomUUID()}.${ext}`;

            const newBlob = await upload(blobPathname, file, {
                access: "public",
                handleUploadUrl: "/api/admin/backgrounds",
            });

            // 2. Lưu URL + label vào Postgres qua PUT (reliable path)
            const saveRes = await fetch("/api/admin/backgrounds", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: newBlob.url,
                    pathname: newBlob.pathname,
                    label,
                }),
            });

            if (!saveRes.ok) {
                const errData = await saveRes.json().catch(() => null);
                throw new Error(errData?.error || "Lưu vào database thất bại.");
            }

            toast.update(tid, {
                render: "Hình nền đã được tải lên!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

            setBgLabelInput("");
            await fetchBackgrounds();
        } catch (error) {
            console.error("Background upload failed:", error);

            toast.update(tid, {
                render: error instanceof Error ? error.message : "Upload thất bại.",
                type: "error",
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            setUploadingBg(false);
            input.value = "";
        }
    };

    const handleDeleteBg = async (id: string, filePath: string, label: string) => {
        if (!confirm(`Xóa hình nền "${label}" không?`)) return;
        setDeletingBgId(id);
        const tid = toast.loading("Đang xóa...");
        try {
            const res = await fetch("/api/admin/backgrounds", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
});
            if (res.ok) {
                toast.update(tid, { render: "Đã xóa hình nền.", type: "success", isLoading: false, autoClose: 3000 });
                await fetchBackgrounds();
            } else {
                toast.update(tid, { render: "Xóa thất bại.", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch {
            toast.update(tid, { render: "Lỗi mạng.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setDeletingBgId(null);
        }
    };

    const handleSetActive = async (id: string) => {
        setSettingActiveId(id);

        try {
            const res = await fetch("/api/admin/backgrounds", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || "Không thể đặt hình nền.");
            }

            setBackgrounds((prev) =>
                prev.map((bg) => ({
                    ...bg,
                    is_active: bg.id === id,
                }))
            );

            toast.success("Đã đặt làm hình nền chính!");
        } catch (error) {
            console.error("Set active background failed:", error);
            toast.error(
                error instanceof Error ? error.message : "Lỗi mạng."
            );
        } finally {
            setSettingActiveId(null);
        }
    };

    /* ─── Avatars ──────────────────────────────────────────────────────────── */

    const fetchAvatars = async () => {
        try {
            setLoadingAvatars(true);
            const res = await fetch("/api/admin/avatars", { cache: "no-store" });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Không thể tải danh sách avatar.");
            if (Array.isArray(data)) setAvatars(data);
        } catch (error) {
            console.error("Failed to fetch avatars:", error);
        } finally {
            setLoadingAvatars(false);
        }
    };

    const handleAvatarUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        person: "bride" | "groom"
    ) => {
        const input = e.currentTarget;
        const file = input.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.");
            input.value = "";
            return;
        }

        setUploadingAvatar(person);
        const tid = toast.loading(`Đang tải lên avatar ${person === "bride" ? "cô dâu" : "chú rể"}...`);

        try {
            // 1. Upload trực tiếp browser → Vercel Blob (không giới hạn size)
            const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
            const blobPathname = `avatars/${person}/${crypto.randomUUID()}.${ext}`;

            const newBlob = await upload(blobPathname, file, {
                access: "public",
                handleUploadUrl: "/api/admin/avatars",
            });

            // 2. Lưu URL vào Postgres qua PUT (reliable path)
            const saveRes = await fetch("/api/admin/avatars", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: newBlob.url,
                    pathname: newBlob.pathname,
                    person,
                }),
            });

            if (!saveRes.ok) {
                const errData = await saveRes.json().catch(() => null);
                throw new Error(errData?.error || "Lưu vào database thất bại.");
            }

            toast.update(tid, {
                render: "Avatar đã được tải lên!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            await fetchAvatars();
        } catch (error) {
            console.error("Avatar upload failed:", error);
            toast.update(tid, {
                render: error instanceof Error ? error.message : "Upload thất bại.",
                type: "error",
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            setUploadingAvatar(null);
            input.value = "";
        }
    };

    const handleSetAvatarActive = async (id: number) => {
        setSettingAvatarActiveId(id);
        try {
            const res = await fetch("/api/admin/avatars", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Không thể đặt avatar.");
            setAvatars(prev =>
                prev.map(av => ({
                    ...av,
                    is_active: av.id === id ? true : av.person === prev.find(a => a.id === id)?.person ? false : av.is_active,
                }))
            );
            toast.success("Đã đặt làm avatar chính!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Lỗi mạng.");
        } finally {
            setSettingAvatarActiveId(null);
        }
    };

    const handleDeleteAvatar = async (id: number) => {
        if (!confirm("Xóa avatar này không?")) return;
        setDeletingAvatarId(id);
        const tid = toast.loading("Đang xóa...");
        try {
            const res = await fetch("/api/admin/avatars", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                toast.update(tid, { render: "Đã xóa avatar.", type: "success", isLoading: false, autoClose: 3000 });
                await fetchAvatars();
            } else {
                toast.update(tid, { render: "Xóa thất bại.", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch {
            toast.update(tid, { render: "Lỗi mạng.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setDeletingAvatarId(null);
        }
    };

    const logout = async () => {
        try { await fetch("/api/admin/login", { method: "DELETE" }); } catch { }
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

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "guests",      label: "Khách mời",  icon: <Users className="w-4 h-4" /> },
        { id: "memories",    label: "Ký ức",       icon: <ImageIcon className="w-4 h-4" /> },
        { id: "backgrounds", label: "Hình nền",    icon: <Layers className="w-4 h-4" /> },
        { id: "avatars",     label: "Avatar",      icon: <UserCircle2 className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <div>
                        <h1 className="text-2xl font-serif text-neutral-900">Admin Dashboard</h1>
                        <p className="text-sm text-neutral-500 mt-1">Janes &amp; Henry · Quản lý đám cưới.</p>
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

                    {/* ── BACKGROUNDS TAB ── */}
                    {activeTab === "backgrounds" && (
                        <div>
                            {/* Header + Upload */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                                <div>
                                    <h2 className="text-lg font-medium text-neutral-900">Quản lý hình nền</h2>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        Tải lên ảnh và chọn hình nền chính cho trang chủ. Hình có dấu&nbsp;
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                            <Star className="w-3 h-3" /> Đang dùng
                                        </span>
                                        &nbsp;sẽ hiển thị ở phần Hero trên trang chào.
                                    </p>
                                </div>

                                {/* Upload panel */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full md:w-auto">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-neutral-500 font-medium">Nhãn hình (tùy chọn)</label>
                                        <input
                                            type="text"
                                            value={bgLabelInput}
                                            onChange={(e) => setBgLabelInput(e.target.value)}
                                            placeholder="Vd: Ảnh cưới chính"
                                            className="px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-neutral-50"
                                        />
                                    </div>
                                    <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer transition-colors shadow-sm whitespace-nowrap">
                                        {uploadingBg ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Đang tải lên...</>
                                        ) : (
                                            <><UploadCloud className="w-4 h-4" /> Tải hình nền</>
                                        )}
                                        <input
                                            ref={bgFileRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleBgUpload}
                                            disabled={uploadingBg}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Grid */}
                            {loadingBgs ? (
                                <div className="py-20 flex justify-center items-center text-neutral-400">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            ) : backgrounds.length === 0 ? (
                                <div className="text-center py-24 border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50">
                                    <Layers className="w-14 h-14 text-neutral-300 mx-auto mb-4" />
                                    <h3 className="text-base font-medium text-neutral-800">Chưa có hình nền nào</h3>
                                    <p className="text-sm text-neutral-500 mt-1.5">Tải lên ảnh đầu tiên để làm hình nền cho trang chào.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {backgrounds.map((bg) => (
                                        <div
                                            key={bg.id}
                                            className={`group relative rounded-2xl overflow-hidden border-2 shadow-sm transition-all duration-300 ${
                                                bg.is_active
                                                    ? "border-amber-400 shadow-amber-100 shadow-md"
                                                    : "border-neutral-200 hover:border-neutral-300"
                                            }`}
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-[16/9] w-full">
                                                <Image
                                                    src={bg.image_url}
                                                    alt={bg.label}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />

                                                {/* Active badge */}
                                                {bg.is_active && (
                                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-semibold rounded-full shadow">
                                                        <Star className="w-3 h-3 fill-amber-900" />
                                                        Đang dùng
                                                    </div>
                                                )}

                                                {/* Hover overlay with actions */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2">
                                                    {!bg.is_active && (
                                                        <button
                                                            onClick={() => handleSetActive(bg.id)}
                                                            disabled={settingActiveId === bg.id}
                                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-900 text-sm font-semibold rounded-xl transition-colors shadow"
                                                        >
                                                            {settingActiveId === bg.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <><CheckCircle2 className="w-4 h-4" /> Đặt làm hình nền chính</>
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteBg(bg.id, bg.file_path, bg.label)}
                                                        disabled={deletingBgId === bg.id}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors shadow disabled:opacity-50"
                                                    >
                                                        {deletingBgId === bg.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <><X className="w-4 h-4" /> Xóa</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Footer info */}
                                            <div className={`px-4 py-3 ${bg.is_active ? "bg-amber-50" : "bg-white"}`}>
                                                <p className="text-sm font-medium text-neutral-800 truncate">{bg.label}</p>
                                                <p className="text-xs text-neutral-400 mt-0.5">
                                                    {new Date(bg.created_at).toLocaleDateString("vi-VN", {
                                                        year: "numeric", month: "short", day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Info note */}
                            {backgrounds.length > 0 && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start text-sm text-blue-700">
                                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span>
                                       File ảnh được lưu trên <strong>Vercel Blob</strong>, thông tin
hình nền được lưu trong <strong>Neon PostgreSQL</strong>.
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── AVATARS TAB ── */}
                    {activeTab === "avatars" && (
                        <div>
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-neutral-900">Quản lý Avatar</h2>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Upload và chọn ảnh avatar cho cô dâu &amp; chú rể. Ảnh được lưu trên <strong>Vercel Blob</strong>,
                                    thông tin lưu trong <strong>Neon PostgreSQL</strong>.
                                </p>
                            </div>

                            {loadingAvatars ? (
                                <div className="py-20 flex justify-center items-center text-neutral-400">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* ── Bride Panel ── */}
                                    {(["bride", "groom"] as const).map((person) => {
                                        const personAvatars = avatars.filter(av => av.person === person);
                                        const activeAvatar = personAvatars.find(av => av.is_active);
                                        const isUploading = uploadingAvatar === person;
                                        const fileRef = person === "bride" ? brideFileRef : groomFileRef;
                                        const label = person === "bride" ? "Cô dâu" : "Chú rể";
                                        const accentColor = person === "bride" ? "rose" : "blue";

                                        return (
                                            <div
                                                key={person}
                                                className="border border-neutral-200 rounded-2xl overflow-hidden shadow-sm"
                                            >
                                                {/* Panel header */}
                                                <div className={`px-5 py-4 flex items-center justify-between border-b border-neutral-100 bg-${accentColor === "rose" ? "rose" : "blue"}-50`}>
                                                    <div className="flex items-center gap-2">
                                                        <UserCircle2 className={`w-5 h-5 text-${accentColor}-400`} />
                                                        <span className="font-medium text-neutral-800">{label}</span>
                                                        {activeAvatar && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                                <Star className="w-3 h-3" /> Đã có avatar
                                                            </span>
                                                        )}
                                                    </div>
                                                    <label className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer transition-colors ${isUploading ? "opacity-60 pointer-events-none" : ""}`}>
                                                        {isUploading ? (
                                                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải...</>
                                                        ) : (
                                                            <><UploadCloud className="w-3.5 h-3.5" /> Upload ảnh</>                                                        )}
                                                        <input
                                                            ref={fileRef}
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/webp"
                                                            className="hidden"
                                                            onChange={(e) => handleAvatarUpload(e, person)}
                                                            disabled={isUploading}
                                                        />
                                                    </label>
                                                </div>

                                                {/* Active avatar preview */}
                                                <div className="p-5">
                                                    {activeAvatar ? (
                                                        <div className="mb-5 flex flex-col items-center gap-3">
                                                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider self-start">Avatar đang dùng</p>
                                                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-300 shadow-lg shadow-amber-100">
                                                                <Image
                                                                    src={activeAvatar.image_url}
                                                                    alt={`${label} avatar`}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="128px"
                                                                />
                                                            </div>
                                                            <p className="text-xs text-neutral-400">
                                                                {new Date(activeAvatar.created_at).toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric" })}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="mb-5 flex flex-col items-center gap-3 py-6 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50">
                                                            <UserCircle2 className="w-14 h-14 text-neutral-300" />
                                                            <p className="text-sm text-neutral-500">Chưa có avatar. Upload ảnh để bắt đầu.</p>
                                                        </div>
                                                    )}

                                                    {/* All uploaded avatars */}
                                                    {personAvatars.length > 0 && (
                                                        <div>
                                                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Tất cả ảnh đã upload ({personAvatars.length})</p>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                {personAvatars.map((av) => (
                                                                    <div
                                                                        key={av.id}
                                                                        className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                                                                            av.is_active
                                                                                ? "border-amber-400 shadow-md shadow-amber-100"
                                                                                : "border-neutral-200 hover:border-neutral-300"
                                                                        }`}
                                                                    >
                                                                        <div className="relative aspect-square">
                                                                            <Image
                                                                                src={av.image_url}
                                                                                alt={`${label} avatar ${av.id}`}
                                                                                fill
                                                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                                sizes="120px"
                                                                            />
                                                                            {av.is_active && (
                                                                                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-semibold rounded-full">
                                                                                    <Star className="w-2.5 h-2.5 fill-amber-900" />
                                                                                    Dùng
                                                                                </div>
                                                                            )}
                                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end gap-1 p-1.5">
                                                                                {!av.is_active && (
                                                                                    <button
                                                                                        onClick={() => handleSetAvatarActive(av.id)}
                                                                                        disabled={settingAvatarActiveId === av.id}
                                                                                        className="w-full flex items-center justify-center gap-1 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-900 text-[11px] font-semibold rounded-lg transition-colors"
                                                                                    >
                                                                                        {settingAvatarActiveId === av.id ? (
                                                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                                                        ) : (
                                                                                            <><CheckCircle2 className="w-3 h-3" /> Dùng</>                                                                                        )}
                                                                                    </button>
                                                                                )}
                                                                                <button
                                                                                    onClick={() => handleDeleteAvatar(av.id)}
                                                                                    disabled={deletingAvatarId === av.id}
                                                                                    className="w-full flex items-center justify-center gap-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium rounded-lg transition-colors disabled:opacity-50"
                                                                                >
                                                                                    {deletingAvatarId === av.id ? (
                                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                                    ) : (
                                                                                        <><X className="w-3 h-3" /> Xóa</>                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Info note */}
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start text-sm text-blue-700">
                                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>
                                    File ảnh được lưu trên <strong>Vercel Blob</strong> (thư mục <code>avatars/bride/</code> và <code>avatars/groom/</code>).
                                    Tên file &amp; URL được lưu trong bảng <code>avatars</code> của <strong>Neon PostgreSQL</strong>.
                                    Trang chủ tự động load avatar đang active.
                                </span>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
