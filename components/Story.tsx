export default function Story() {
    const milestones = [
        {
            year: "2024",
            title: "First Meet",
            desc: "We met for the first time at a small BBQ restaurant in Thuan An, Binh Duong",
        },
        {
            year: "2024",
            title: "First Date",
            desc: "Our first date in Thuan An",
        },
        {
            year: "2024",
            title: "The day of the proposal",
            desc: "Our first date in Thuan An",
        },
        {
            year: "2025",
            title: "Our first trip abroad",
            desc: "Celebrating the New Year together and exploring Kuala Lumpur",
        }, {
            year: "2026",
            title: "Hue - Da Nang - Hoi An trip",
            desc: "Let's me think....",
        },
        {
            year: "2026",
            title: "Wedding Day",
            desc: "Our big day - December 6, 2026",
        },
    ];

    return (
        <section className="py-24 px-6 max-w-3xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-accent uppercase tracking-widest text-sm mb-4">Our Journey</h2>
                <h3 className="text-4xl md:text-5xl font-serif text-foreground font-normal">Our Love Journey</h3>
            </div>

            <div className="relative border-l border-accent/30 ml-4 md:ml-8 space-y-12 pb-8">
                {milestones.map((item, index) => (
                    <div key={index} className="relative pl-8 md:pl-12 group">
                        {/* Timeline Node */}
                        <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-accent ring-4 ring-white shadow-sm transition-transform duration-300 group-hover:scale-125"></div>

                        <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[32px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-accent/5 transition-transform duration-300 hover:-translate-y-1">
                            <span className="text-accent font-serif text-xl md:text-2xl mb-2 block font-medium">
                                {item.year}
                            </span>
                            <h4 className="text-foreground text-xl md:text-2xl font-serif mb-3">
                                {item.title}
                            </h4>
                            <p className="text-muted leading-relaxed font-light text-base md:text-lg">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
