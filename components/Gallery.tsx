"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";

const images = [
    "/images/couple-1.jpg",
    "/images/couple-2.jpg",
    "/images/couple-3.jpg",
    "/images/couple-4.jpg",
    "/images/couple-5.jpg",
    "/images/couple-6.jpg",
    "/images/couple-7.jpg",
    "/images/couple-8.jpg",
    "/images/couple-9.jpg",
    "/images/couple-10.jpg",
    "/images/couple-11.jpg",
    "/images/couple-12.jpg",
    "/images/couple-13.jpg",
    "/images/couple-14.jpg",
    "/images/couple-15.jpg",
];

export default function Gallery() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 3500 })]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    return (
        <section className="py-20 px-6 bg-stone-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-serif text-center mb-12 text-stone-800">
                    Memories
                </h2>
                
                <div className="relative group/carousel">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-6">
                            {images.map((src, i) => (
                                <div key={i} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6">
                                    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg group">
                                        <Image
                                            src={src}
                                            alt={`Memory ${i + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-white/95 rounded-full shadow-xl flex items-center justify-center text-stone-700 hover:text-stone-900 hover:scale-110 transition-all z-10 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
                        aria-label="Previous slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    <button 
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-white/95 rounded-full shadow-xl flex items-center justify-center text-stone-700 hover:text-stone-900 hover:scale-110 transition-all z-10 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
                        aria-label="Next slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
