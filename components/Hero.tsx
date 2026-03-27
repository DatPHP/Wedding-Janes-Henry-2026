import Image from "next/image";

export default function Hero() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#FFF5F5] to-background pt-20">
            <h2 className="text-accent uppercase tracking-[0.3em] text-sm md:text-md mb-6 font-medium">
                We are getting married
            </h2>
            
            <h1 className="text-6xl md:text-8xl font-serif text-foreground mb-4 font-light">
                Janes & Henry
            </h1>

            <div className="w-16 h-[1px] bg-accent/50 my-8 mx-auto"></div>

            <p className="text-xl md:text-2xl font-serif text-foreground/80 italic">
                December 06, 2026
            </p>

            <div className="mt-16 w-full max-w-lg mb-12">
                <Image
                    src="/images/couple-1.jpg"
                    alt="Janes & Henry"
                    width={800}
                    height={1000}
                    className="rounded-[32px] shadow-2xl shadow-accent/20 object-cover"
                    priority
                />
            </div>
            
            {/* Scroll Indicator */}
            <div className="animate-bounce text-accent mt-8 mb-4">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>
        </section>
    );
}
