import { MapPin, CalendarHeart } from "lucide-react";

export default function EventInfo() {
    const binhDinhMap = "https://www.google.com/maps/search/?api=1&query=2325%2BG77%2C+Ba+Thang+Hai%2C+Ngo+May+Town%2C+Phu+Cat%2C+Gia+Lai%2C+Vietnam";
    const binhDuongMap = "https://www.google.com/maps/search/?api=1&query=51+Nguyen+Van+Tiet%2C+Lai+Thieu%2C+Thuan+An%2C+Ho+Chi+Minh+City";
    
    // Google Calendar template link for Dec 6 2026
    const calendarLink = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Janes+%26+Henry&dates=20261206T030000Z/20261206T150000Z&details=Celebrating+the+wedding+of+Janes+%26+Henry!&location=Vietnam";

    return (
        <section className="py-24 bg-background text-center px-6">
            <h2 className="text-3xl md:text-5xl font-serif mb-16 text-foreground">
                Wedding Event
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                {/* Ceremony Card */}
                <div className="bg-white p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-accent/10 transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full">
                    <h3 className="text-2xl font-serif text-accent mb-4">Ceremony</h3>
                    <div className="space-y-4 text-foreground/70 flex-grow">
                        <p className="font-medium text-foreground">06 December 2026</p>
                        <p>10:00 AM - 11:30 AM</p>
                        <div className="w-12 h-[1px] bg-accent/30 mx-auto"></div>
                        <p className="font-medium text-foreground">Phu Cat, Binh Dinh</p>
                        <p className="text-sm">Janes's hometown</p>
                    </div>
                    <a href={binhDinhMap} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium text-accent hover:text-rose-600 transition-colors w-full px-4 py-3 bg-accent/5 rounded-2xl hover:bg-accent/10">
                        <MapPin size={16} /> Get Directions
                    </a>
                </div>

                {/* Reception Card */}
                <div className="bg-white p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-accent/10 transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full">
                    <h3 className="text-2xl font-serif text-accent mb-4">Reception</h3>
                    <div className="space-y-4 text-foreground/70 flex-grow">
                        <p className="font-medium text-foreground">06 December 2026</p>
                        <p>6:00 PM - Late</p>
                        <div className="w-12 h-[1px] bg-accent/30 mx-auto"></div>
                        <p className="font-medium text-foreground">Thuan An, Binh Duong</p>
                        <p className="text-sm">Henry's hometown</p>
                    </div>
                    <a href={binhDuongMap} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium text-accent hover:text-rose-600 transition-colors w-full px-4 py-3 bg-accent/5 rounded-2xl hover:bg-accent/10">
                        <MapPin size={16} /> Get Directions
                    </a>
                </div>
            </div>

            <a 
                href={calendarLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white border border-accent/20 px-8 py-4 rounded-full text-foreground hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all"
            >
                <CalendarHeart className="text-accent" size={20} />
                <span className="font-medium">Add to Calendar</span>
            </a>
        </section>
    );
}
