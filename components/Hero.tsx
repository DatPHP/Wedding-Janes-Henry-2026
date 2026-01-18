import Image from "next/image";

export default function Hero() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-serif mb-4">
                Janes & Henry
            </h1>

            <p className="text-lg md:text-xl mb-6">
                We are getting married
            </p>

            <p className="text-2xl font-semibold text-rose-600">
                06 · 12 · 2026
            </p>

            <div className="mt-10 w-full max-w-md">
                <Image
                    src="/images/couple-1.jpg"
                    alt="Janes & Henry"
                    width={600}
                    height={800}
                    className="rounded-2xl shadow-lg object-cover"
                />
            </div>
        </section>
    );
}
