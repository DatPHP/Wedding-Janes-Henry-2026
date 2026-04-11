import { MapPin, CalendarHeart } from "lucide-react";

export default function EventInfo() {
    const binhDinhMap = "https://www.google.com/maps/search/?api=1&query=2325%2BG77%2C+Ba+Thang+Hai%2C+Ngo+May+Town%2C+Phu+Cat%2C+Gia+Lai%2C+Vietnam";
    const binhDuongMap = "https://www.google.com/maps/search/?api=1&query=51+Nguyen+Van+Tiet%2C+Lai+Thieu%2C+Thuan+An%2C+Ho+Chi+Minh+City";
    
    // Google Calendar template link for Dec 6 2026
    const calendarLink = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Janes+%26+Henry&dates=20261206T030000Z/20261206T150000Z&details=Celebrating+the+wedding+of+Janes+%26+Henry!&location=Vietnam";

    return (
        <section className="relative py-24 bg-gradient-to-b from-white via-accent-light/30 to-white text-center px-6 overflow-hidden">
            {/* Subtle background aesthetic */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent-light/80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-light/80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/4 translate-y-1/4"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Wedding Event
                    </h2>
                    <p className="text-accent font-serif italic text-xl tracking-wide">
                        We can't wait to celebrate with you
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Ceremony Card */}
                    <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(255,133,161,0.06)] border border-accent/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(255,133,161,0.15)] flex flex-col h-full group relative overflow-hidden">
                        {/* Decorative background corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/40 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
                        
                        <div className="w-16 h-16 bg-accent-light/50 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 group-hover:rotate-12 group-hover:bg-accent group-hover:text-white transition-all duration-500 text-accent">
                            <CalendarHeart size={28} strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-3xl font-serif text-foreground mb-2 group-hover:text-accent transition-colors duration-300">Ceremony</h3>
                        <p className="text-accent/80 text-xs font-semibold tracking-widest uppercase mb-6">The Vows</p>
                        
                        <div className="space-y-4 text-muted flex-grow">
                            <p className="text-lg font-medium text-foreground">06 December 2026</p>
                            <p>10:00 AM - 11:30 AM</p>
                            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent mx-auto my-6"></div>
                            <p className="font-medium text-foreground text-lg">Phu Cat, Binh Dinh</p>
                            <p className="text-sm italic">Janes's hometown</p>
                        </div>
                        
                        <a href={binhDinhMap} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-white transition-all duration-300 w-full px-6 py-4 bg-white border border-accent/20 rounded-full hover:bg-accent hover:border-accent hover:shadow-lg hover:shadow-accent/30 group-hover:bg-accent/5">
                            <MapPin size={18} /> Location Map
                        </a>
                    </div>

                    {/* Reception Card */}
                    <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(255,133,161,0.06)] border border-accent/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(255,133,161,0.15)] flex flex-col h-full group relative overflow-hidden">
                        {/* Decorative background corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/40 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
                        
                        <div className="w-16 h-16 bg-accent-light/50 rounded-2xl flex items-center justify-center mx-auto mb-8 -rotate-3 group-hover:-rotate-12 group-hover:bg-accent group-hover:text-white transition-all duration-500 text-accent">
                            <CalendarHeart size={28} strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-3xl font-serif text-foreground mb-2 group-hover:text-accent transition-colors duration-300">Reception</h3>
                        <p className="text-accent/80 text-xs font-semibold tracking-widest uppercase mb-6">The Celebration</p>
                        
                        <div className="space-y-4 text-muted flex-grow">
                            <p className="text-lg font-medium text-foreground">06 December 2026</p>
                            <p>6:00 PM - Late</p>
                            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent mx-auto my-6"></div>
                            <p className="font-medium text-foreground text-lg">Thuan An, Binh Duong</p>
                            <p className="text-sm italic">Henry's hometown</p>
                        </div>
                        
                        <a href={binhDuongMap} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-white transition-all duration-300 w-full px-6 py-4 bg-white border border-accent/20 rounded-full hover:bg-accent hover:border-accent hover:shadow-lg hover:shadow-accent/30 group-hover:bg-accent/5">
                            <MapPin size={18} /> Location Map
                        </a>
                    </div>
                </div>

                <a 
                    href={calendarLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-accent text-white px-10 py-4 rounded-full font-medium hover:bg-accent/90 hover:shadow-[0_10px_25px_rgb(255,133,161,0.35)] hover:-translate-y-1 transition-all duration-300"
                >
                    <CalendarHeart size={20} />
                    <span>Save the Date</span>
                </a>
            </div>
        </section>
    );
}
