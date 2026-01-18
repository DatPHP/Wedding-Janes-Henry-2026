import Image from "next/image";

const images = [
    "/images/couple-1.jpg",
    "/images/couple-2.jpg",
    "/images/couple-3.jpg",
];

export default function Gallery() {
    return (
        <section className="py-20 px-6">
            <h2 className="text-3xl font-serif text-center mb-10">
                Memories
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {images.map((src, i) => (
                    <Image
                        key={i}
                        src={src}
                        alt="Memory"
                        width={500}
                        height={500}
                        className="rounded-xl shadow-md object-cover"
                    />
                ))}
            </div>
        </section>
    );
}
