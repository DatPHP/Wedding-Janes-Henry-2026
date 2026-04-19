"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { useEffect, useState } from "react";


interface GalleryImage {
    id: string;
    image_name: string;
    image_url: string;
}

export default function Gallery() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 3500 })]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const [images, setImages] = useState<GalleryImage[]>([]);

    useEffect(() => {
        fetch("/api/memories")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setImages(data);
                }
            })
            .catch(err => console.error("Failed to fetch memories:", err));
    }, []);

    if (images.length === 0) return null;

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-background to-accent-light">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-black">
                    Khoảnh Khắc Đáng Nhớ
                </h2>

                <div className="relative group/carousel">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-6">
                            {images.map((img: any) => (
                                <div key={img.id} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_25%] pl-6">
                                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-lg group">
                                        <Image
                                            src={img.image_url}
                                            alt={img.image_name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:opacity-0" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 glass rounded-full shadow-xl flex items-center justify-center text-foreground hover:text-accent hover:scale-110 active:scale-95 transition-all z-10 opacity-0 group-hover/carousel:opacity-100"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 glass rounded-full shadow-xl flex items-center justify-center text-foreground hover:text-accent hover:scale-110 active:scale-95 transition-all z-10 opacity-0 group-hover/carousel:opacity-100"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
