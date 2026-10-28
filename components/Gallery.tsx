"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    X,
    Maximize2,
    Sparkles,
} from "lucide-react";

interface GalleryImage {
    id: string;
    image_name: string;
    image_url: string;
}

// Danh sách ảnh mặc định của cặp đôi (fallback nếu DB trống hoặc chưa kết nối)
const DEFAULT_MEMORIES: GalleryImage[] = [
    { id: "couple-1", image_name: "Ánh Mắt Đầu Tiên", image_url: "/images/couple-1.jpg" },
    { id: "couple-2", image_name: "Chung Đôi", image_url: "/images/couple-2.jpg" },
    { id: "couple-3", image_name: "Hẹn Ước Mùa Thu", image_url: "/images/couple-3.jpg" },
    { id: "couple-4", image_name: "Nụ Cười Rạng Rỡ", image_url: "/images/couple-4.jpg" },
    { id: "couple-5", image_name: "Bình Yên Bên Nhau", image_url: "/images/couple-5.jpg" },
    { id: "couple-6", image_name: "Tay Trong Tay", image_url: "/images/couple-6.jpg" },
    { id: "couple-7", image_name: "Hạnh Phúc Giản Đơn", image_url: "/images/couple-7.jpg" },
    { id: "couple-8", image_name: "Giai Điệu Tình Yêu", image_url: "/images/couple-8.jpg" },
    { id: "couple-9", image_name: "Ngọt Ngào Từng Phút Giây", image_url: "/images/couple-9.jpg" },
    { id: "couple-10", image_name: "Khoảnh Khắc Vĩnh Cửu", image_url: "/images/couple-10.jpg" },
    { id: "couple-11", image_name: "Trọn Vẹn Yêu Thương", image_url: "/images/couple-11.jpg" },
    { id: "couple-12", image_name: "Lời Nguyện Thề", image_url: "/images/couple-12.jpg" },
    { id: "couple-13", image_name: "Bình Minh Mới", image_url: "/images/couple-13.jpg" },
    { id: "couple-14", image_name: "Bến Đỗ Hạnh Phúc", image_url: "/images/couple-14.jpg" },
    { id: "couple-15", image_name: "Mãi Mãi Bên Nhau", image_url: "/images/couple-15.jpg" },
];

interface HeartSlot {
    row: number;
    col: number;
    isCenter?: boolean;
    isTip?: boolean;
}

// Ma trận tọa độ Đội Hình Trái Tim (Heart Formation) trên lưới 7 cột x 4-5 hàng
function getHeartSlots(count: number): HeartSlot[] {
    if (count <= 12) {
        return [
            { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 5 }, { row: 1, col: 6 },
            { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4, isCenter: true }, { row: 2, col: 5 }, { row: 2, col: 6 },
            { row: 3, col: 3 }, { row: 3, col: 5 },
            { row: 4, col: 4, isTip: true },
        ].slice(0, count);
    }
    if (count <= 14) {
        return [
            { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 5 }, { row: 1, col: 6 },
            { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4, isCenter: true }, { row: 2, col: 5 }, { row: 2, col: 6 },
            { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 },
            { row: 4, col: 4, isTip: true },
        ].slice(0, count);
    }
    // Chuẩn 15 ảnh (đối xứng hoàn hảo)
    if (count === 15) {
        return [
            // Hàng 1: 2 đỉnh tim (2 trái, 2 phải, khe giữa)
            { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 5 }, { row: 1, col: 6 },
            // Hàng 2: Thân tim mở rộng đủ 7 cột
            { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4, isCenter: true }, { row: 2, col: 5 }, { row: 2, col: 6 }, { row: 2, col: 7 },
            // Hàng 3: Thắt eo 3 ảnh trung tâm
            { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 },
            // Hàng 4: Chóp nhọn của trái tim
            { row: 4, col: 4, isTip: true },
        ];
    }
    // 16 ảnh
    if (count === 16) {
        return [
            { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 5 }, { row: 1, col: 6 },
            { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4, isCenter: true }, { row: 2, col: 5 }, { row: 2, col: 6 }, { row: 2, col: 7 },
            { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 5 }, { row: 3, col: 6 },
            { row: 4, col: 4, isTip: true },
        ];
    }
    // Từ 17 đến 20 ảnh
    const slots20: HeartSlot[] = [
        { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 5 }, { row: 1, col: 6 },
        { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4, isCenter: true }, { row: 2, col: 5 }, { row: 2, col: 6 }, { row: 2, col: 7 },
        { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 }, { row: 3, col: 6 },
        { row: 4, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 5 },
        { row: 5, col: 4, isTip: true },
    ];
    return slots20.slice(0, count);
}

export default function Gallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"heart" | "grid">("heart");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    // Carousel hook for <= 10 images
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start" },
        [Autoplay({ delay: 3800, stopOnInteraction: false })]
    );

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setActiveSlide(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    // Tải dữ liệu ảnh từ API, fallback về ảnh nội bộ nếu rỗng
    useEffect(() => {
        fetch("/api/memories")
            .then((res) => {
                if (!res.ok) throw new Error("API error");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setImages(data);
                } else {
                    setImages(DEFAULT_MEMORIES);
                }
            })
            .catch(() => {
                setImages(DEFAULT_MEMORIES);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Điều khiển bàn phím cho Lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowLeft") {
                setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
            }
            if (e.key === "ArrowRight") {
                setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [lightboxIndex, images.length]);

    if (loading && images.length === 0) {
        return null;
    }

    const totalImages = images.length;
    const isSliderMode = totalImages <= 10;
    const heartSlots = getHeartSlots(totalImages);

    return (
        <section className="relative py-24 md:py-32 px-4 md:px-8 bg-gradient-to-b from-white via-[#FFF9FA] to-[#FFF0F3] overflow-hidden">
            {/* Vệt sáng nghệ thuật nền (Ambient Glow Spheres) */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-light/40 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#FFEBF0]/60 rounded-full blur-[140px] pointer-events-none translate-x-1/2" />

            <div className="relative z-10 max-w-7xl mx-auto text-center">
                {/* ── Tiêu Đề Session Tinh Tế & Quý Tộc ── */}
                <div className="mb-12 md:mb-16">
                    <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#C9A96E] font-medium mb-3 flex items-center justify-center gap-2">
                        <Sparkles size={14} className="text-[#C9A96E]" />
                        <span>Khoảnh Khắc Tình Yêu</span>
                        <Sparkles size={14} className="text-[#C9A96E]" />
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#3B1C2C] tracking-wide mb-4">
                        Khoảnh Khắc Đáng Nhớ
                    </h2>
                    <p className="text-neutral-500 font-serif italic text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        &ldquo;Từng nụ cười, từng ánh mắt trao nhau đều là những mảnh ghép ngọt ngào trên hành trình hạnh phúc của chúng mình.&rdquo;
                    </p>
                </div>

                {/* ── Bộ Chuyển Đổi Chế Độ Xem (Chỉ hiện khi > 10 ảnh) ── */}
                {!isSliderMode && (
                    <div className="flex justify-center items-center mb-12">
                        <div className="inline-flex p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-accent/20 shadow-[0_4px_20px_rgba(255,133,161,0.12)]">
                            <button
                                onClick={() => setViewMode("heart")}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                                    viewMode === "heart"
                                        ? "bg-accent text-white shadow-md shadow-accent/30 scale-105"
                                        : "text-neutral-600 hover:text-accent hover:bg-accent/5"
                                }`}
                                aria-label="Xem theo đội hình Trái Tim"
                            >
                                <Heart size={16} className={viewMode === "heart" ? "fill-white" : ""} />
                                <span>Đội Hình Trái Tim</span>
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                                    viewMode === "grid"
                                        ? "bg-accent text-white shadow-md shadow-accent/30 scale-105"
                                        : "text-neutral-600 hover:text-accent hover:bg-accent/5"
                                }`}
                                aria-label="Xem theo dạng lưới 4 cột"
                            >
                                <LayoutGrid size={16} />
                                <span>Dạng Lưới (4 Cột)</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    TRƯỜNG HỢP 1: TỪ 10 ẢNH TRỞ XUỐNG (SLIDER TRƯỢT VÔ CỰC)
                ══════════════════════════════════════════════════════════════ */}
                {isSliderMode ? (
                    <div className="relative group/carousel max-w-6xl mx-auto px-2">
                        <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
                            <div className="flex -ml-4 md:-ml-6">
                                {images.map((img, index) => (
                                    <div
                                        key={img.id || index}
                                        className="flex-[0_0_88%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] pl-4 md:pl-6 min-w-0"
                                    >
                                        <div
                                            onClick={() => setLightboxIndex(index)}
                                            className="group relative aspect-[4/5] w-full rounded-2xl md:rounded-[28px] overflow-hidden shadow-[0_8px_25px_rgba(255,133,161,0.12)] border border-white cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,133,161,0.22)] bg-neutral-100"
                                        >
                                            <Image
                                                src={img.image_url}
                                                alt={img.image_name || `Ảnh cưới ${index + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                            {/* Gradient phủ mờ tinh tế */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left text-white">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-serif text-sm font-medium tracking-wide">
                                                        {img.image_name}
                                                    </p>
                                                    <Maximize2 size={16} className="text-white/90" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nút điều hướng Carousel */}
                        <button
                            onClick={scrollPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 w-12 h-12 glass rounded-full shadow-lg flex items-center justify-center text-neutral-800 hover:text-accent hover:scale-110 active:scale-95 transition-all z-20 opacity-0 group-hover/carousel:opacity-100 border border-accent/20"
                            aria-label="Ảnh trước"
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 w-12 h-12 glass rounded-full shadow-lg flex items-center justify-center text-neutral-800 hover:text-accent hover:scale-110 active:scale-95 transition-all z-20 opacity-0 group-hover/carousel:opacity-100 border border-accent/20"
                            aria-label="Ảnh sau"
                        >
                            <ChevronRight size={22} />
                        </button>

                        {/* Chỉ số trang (Dots indicator) */}
                        <div className="flex justify-center items-center gap-2 mt-8">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => emblaApi?.scrollTo(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        activeSlide === i ? "w-8 bg-accent" : "w-2 bg-accent/20 hover:bg-accent/40"
                                    }`}
                                    aria-label={`Đi tới ảnh ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ══════════════════════════════════════════════════════════════
                        TRƯỜNG HỢP 2: TỪ 10 ẢNH TRỞ LÊN (> 10 ẢNH)
                    ══════════════════════════════════════════════════════════════ */
                    <div>
                        {viewMode === "heart" ? (
                            /* ── 2A. ĐỘI HÌNH TRÁI TIM NGHỆ THUẬT (THE HEART MOSAIC) ── */
                            <div className="w-full overflow-x-auto py-4 px-2 scrollbar-none">
                                <div className="min-w-[640px] md:min-w-0 max-w-4xl mx-auto">
                                    <div className="grid grid-cols-7 gap-2.5 md:gap-4 p-4 md:p-8 bg-white/70 backdrop-blur-md rounded-[36px] shadow-[0_12px_45px_rgba(255,133,161,0.1)] border border-accent/15">
                                        {heartSlots.map((slot, index) => {
                                            const img = images[index];
                                            if (!img) return null;

                                            return (
                                                <div
                                                    key={img.id || index}
                                                    style={{
                                                        gridColumnStart: slot.col,
                                                        gridRowStart: slot.row,
                                                    }}
                                                    onClick={() => setLightboxIndex(index)}
                                                    className={`group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-500 hover:scale-110 hover:z-20 hover:shadow-[0_15px_30px_rgba(255,133,161,0.35)] ${
                                                        slot.isCenter
                                                            ? "ring-2 md:ring-4 ring-accent shadow-accent/30 scale-105"
                                                            : slot.isTip
                                                            ? "ring-2 ring-[#C9A96E] shadow-amber-200"
                                                            : "border border-white/80"
                                                    }`}
                                                >
                                                    <Image
                                                        src={img.image_url}
                                                        alt={img.image_name || `Kỷ niệm ${index + 1}`}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-115"
                                                        sizes="(max-width: 768px) 15vw, 120px"
                                                    />

                                                    {/* Nhãn tâm điểm của trái tim */}
                                                    {slot.isCenter && (
                                                        <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent text-white flex items-center justify-center shadow-md">
                                                            <Heart size={12} className="fill-white" />
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <Maximize2 size={18} className="text-white drop-shadow" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Lời tựa trái tim */}
                                    <p className="text-xs md:text-sm text-accent/80 font-serif italic mt-6 flex items-center justify-center gap-2">
                                        <Heart size={14} className="text-accent fill-accent animate-pulse" />
                                        <span>Mỗi khoảnh khắc là một mảnh ghép tạo nên trái tim yêu thương viên mãn</span>
                                        <Heart size={14} className="text-accent fill-accent animate-pulse" />
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* ── 2B. DẠNG LƯỚI QUÝ TỘC (TỐI THIỂU 4 TẤM/HÀNG TRÊN DESKTOP) ── */
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
                                {images.map((img, index) => (
                                    <div
                                        key={img.id || index}
                                        onClick={() => setLightboxIndex(index)}
                                        className="group relative aspect-[4/5] rounded-2xl md:rounded-[26px] overflow-hidden bg-white shadow-[0_6px_25px_rgba(255,133,161,0.08)] border border-accent/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,133,161,0.2)]"
                                    >
                                        <Image
                                            src={img.image_url}
                                            alt={img.image_name || `Kỷ niệm ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />

                                        {/* Hover caption */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left text-white">
                                            <p className="text-xs uppercase tracking-wider text-rose-200 mb-1 font-semibold">
                                                Khoảnh Khắc #{index + 1}
                                            </p>
                                            <p className="font-serif text-base font-medium">{img.image_name}</p>
                                        </div>

                                        {/* Corner icon */}
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center text-neutral-700 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105">
                                            <Maximize2 size={14} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════════════════════════
                MODAL LIGHTBOX XEM ẢNH TOÀN MÀN HÌNH CHẤT LƯỢNG CAO
            ══════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {lightboxIndex !== null && images[lightboxIndex] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8"
                        onClick={() => setLightboxIndex(null)}
                    >
                        {/* Thanh điều khiển trên cùng */}
                        <div
                            className="flex items-center justify-between w-full max-w-6xl mx-auto z-30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-white/80 font-serif text-sm md:text-base">
                                <span className="text-accent font-semibold">{lightboxIndex + 1}</span>
                                <span className="mx-2 text-white/40">/</span>
                                <span>{images.length}</span>
                                <span className="hidden sm:inline-block ml-4 text-white/60 italic font-sans text-xs">
                                    • {images[lightboxIndex].image_name}
                                </span>
                            </div>

                            <button
                                onClick={() => setLightboxIndex(null)}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:rotate-90"
                                aria-label="Đóng"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Vùng hiển thị ảnh chính */}
                        <div
                            className="relative flex-1 w-full max-w-5xl mx-auto my-4 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                key={lightboxIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full h-[70vh] md:h-[75vh]"
                            >
                                <Image
                                    src={images[lightboxIndex].image_url}
                                    alt={images[lightboxIndex].image_name || "Ảnh phóng to"}
                                    fill
                                    className="object-contain"
                                    sizes="95vw"
                                    priority
                                />
                            </motion.div>

                            {/* Nút Prev / Next trong Lightbox */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) =>
                                        prev !== null && prev > 0 ? prev - 1 : images.length - 1
                                    );
                                }}
                                className="absolute left-2 md:-left-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-95"
                                aria-label="Ảnh trước"
                            >
                                <ChevronLeft size={26} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) =>
                                        prev !== null && prev < images.length - 1 ? prev + 1 : 0
                                    );
                                }}
                                className="absolute right-2 md:-right-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-95"
                                aria-label="Ảnh sau"
                            >
                                <ChevronRight size={26} />
                            </button>
                        </div>

                        {/* Chú thích ở chân modal */}
                        <div
                            className="text-center text-white/90 pb-2 z-30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="font-serif text-lg md:text-xl text-white">
                                {images[lightboxIndex].image_name}
                            </p>
                            <p className="text-xs text-white/50 tracking-widest uppercase mt-1">
                                Kiều Ngân &amp; Văn Đạt · 2026
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
