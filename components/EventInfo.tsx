export default function EventInfo() {
    return (
        <section className="py-24 bg-background text-center px-6">
            <h2 className="text-3xl md:text-5xl font-serif mb-16 text-foreground">
                Wedding Event
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Ceremony Card */}
                <div className="bg-white p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-accent/10 transition-transform duration-300 hover:-translate-y-2">
                    <h3 className="text-2xl font-serif text-accent mb-4">Ceremony</h3>
                    <div className="space-y-4 text-muted">
                        <p className="font-medium text-foreground">06 December 2026</p>
                        <p>10:00 AM - 11:30 AM</p>
                        <div className="w-12 h-[1px] bg-accent/30 mx-auto"></div>
                        <p className="font-medium text-foreground">Phu Cat, Binh Dinh</p>
                        <p className="text-sm">Janes's hometown</p>
                    </div>
                </div>

                {/* Reception Card */}
                <div className="bg-white p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-accent/10 transition-transform duration-300 hover:-translate-y-2">
                    <h3 className="text-2xl font-serif text-accent mb-4">Reception</h3>
                    <div className="space-y-4 text-muted">
                        <p className="font-medium text-foreground">06 December 2026</p>
                        <p>6:00 PM - Late</p>
                        <div className="w-12 h-[1px] bg-accent/30 mx-auto"></div>
                        <p className="font-medium text-foreground">Thuan An, Binh Duong</p>
                        <p className="text-sm">Henry's hometown</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
