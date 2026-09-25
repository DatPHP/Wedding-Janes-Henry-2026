import { MapPin, CalendarHeart } from "lucide-react";

export default function EventInfo() {
    const binhDinhMap = "https://www.google.com/maps/search/?api=1&query=Xa+Phu+Cat,+Gia+Lai,+Vietnam";
    const binhDuongMap = "https://www.google.com/maps/search/?api=1&query=Phuong+Lai+Thieu,+Thuan+An,+Ho+Chi+Minh+City,+Vietnam";
    
    // Google Calendar links
    const calendarLinkGai = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=L%E1%BB%85+C%C6%B0%E1%BB%9Bi+Janes+%26+Henry+(Nh%C3%A0+G%C3%A1i)&dates=20261128T030000Z/20261128T150000Z&details=L%E1%BB%85+c%C6%B0%E1%BB%9Bi+nh%C3%A0+g%C3%A1i+c%E1%BB%A7a+Janes+%26+Henry&location=X%C3%A3+Ph%C3%B9+C%C3%A1t%2C+Gia+Lai%2C+Vi%E1%BB%87t+Nam";
    const calendarLinkTrai = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=L%E1%BB%85+C%C6%B0%E1%BB%9Bi+Janes+%26+Henry+(Nh%C3%A0+Trai)&dates=20261206T030000Z/20261206T150000Z&details=L%E1%BB%85+c%C6%B0%E1%BB%9Bi+nh%C3%A0+trai+%26+ti%E1%BB%87c+c%C6%B0%E1%BB%9Bi+Janes+%26+Henry&location=Ph%C6%B0%E1%BB%9Dng+L%C3%A1i+Thi%C3%AAu%2C+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh";

    return (
        <section className="relative py-24 bg-gradient-to-b from-white via-accent-light/30 to-white text-center px-6 overflow-hidden">
            {/* Subtle background aesthetic */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent-light/80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-light/80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/4 translate-y-1/4"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Chương Trình Lễ Cưới
                    </h2>
                    <p className="text-accent font-serif italic text-xl tracking-wide">
                        Sự hiện diện của bạn là niềm vinh hạnh cho chúng tôi
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
                        
                        <h3 className="text-3xl font-serif text-foreground mb-2 group-hover:text-accent transition-colors duration-300">Đám Hỏi & Lễ Vu Quy</h3>
                        <p className="text-accent/80 text-xs font-semibold tracking-widest uppercase mb-6">Nhà Gái · 28 Tháng 11 2026</p>
                        
                        <div className="space-y-4 text-muted flex-grow">
                            <p className="text-lg font-medium text-foreground">28 Tháng 11 2026</p>
                            <p>Sáng – Chào đón khách quý</p>
                            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent mx-auto my-6"></div>
                            <p className="font-medium text-foreground text-lg">Xã Phù Cát, Tỉnh Gia Lai</p>
                            <p className="text-sm italic">Quê của Janes</p>
                        </div>
                        
                        <a href={binhDinhMap} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-white transition-all duration-300 w-full px-6 py-4 bg-white border border-accent/20 rounded-full hover:bg-accent hover:border-accent hover:shadow-lg hover:shadow-accent/30 group-hover:bg-accent/5">
                            <MapPin size={18} /> Xem Bản Đồ
                        </a>
                        <a href={calendarLinkGai} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-all duration-300 w-full px-6 py-3">
                            <CalendarHeart size={16} /> Lưu Lịch 28/11
                        </a>
                    </div>

                    {/* Reception Card */}
                    <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(255,133,161,0.06)] border border-accent/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(255,133,161,0.15)] flex flex-col h-full group relative overflow-hidden">
                        {/* Decorative background corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/40 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
                        
                        <div className="w-16 h-16 bg-accent-light/50 rounded-2xl flex items-center justify-center mx-auto mb-8 -rotate-3 group-hover:-rotate-12 group-hover:bg-accent group-hover:text-white transition-all duration-500 text-accent">
                            <CalendarHeart size={28} strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-3xl font-serif text-foreground mb-2 group-hover:text-accent transition-colors duration-300">Lễ Thành Hôn & Tiệc Cưới</h3>
                        <p className="text-accent/80 text-xs font-semibold tracking-widest uppercase mb-6">Nhà Trai · 06 Tháng 12 2026</p>
                        
                        <div className="space-y-4 text-muted flex-grow">
                            <p className="text-lg font-medium text-foreground">06 Tháng 12 2026</p>
                            <p>6:00 Tối - 9:00 Tối</p>
                            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent mx-auto my-6"></div>
                            <p className="font-medium text-foreground text-lg">Phường Lái Thiêu, TP. Hồ Chí Minh</p>
                            <p className="text-sm italic">Quê của Henry</p>
                        </div>
                        
                        <a href={binhDuongMap} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-white transition-all duration-300 w-full px-6 py-4 bg-white border border-accent/20 rounded-full hover:bg-accent hover:border-accent hover:shadow-lg hover:shadow-accent/30 group-hover:bg-accent/5">
                            <MapPin size={18} /> Xem Bản Đồ
                        </a>
                        <a href={calendarLinkTrai} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-all duration-300 w-full px-6 py-3">
                            <CalendarHeart size={16} /> Lưu Lịch 06/12
                        </a>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <a 
                        href={calendarLinkGai} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-full font-medium hover:bg-accent/90 hover:shadow-[0_10px_25px_rgb(255,133,161,0.35)] hover:-translate-y-1 transition-all duration-300"
                    >
                        <CalendarHeart size={20} />
                        <span>Lưu Lịch 28/11</span>
                    </a>
                    <a 
                        href={calendarLinkTrai} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white border border-accent/30 text-accent px-8 py-4 rounded-full font-medium hover:bg-accent hover:text-white hover:shadow-[0_10px_25px_rgb(255,133,161,0.35)] hover:-translate-y-1 transition-all duration-300"
                    >
                        <CalendarHeart size={20} />
                        <span>Lưu Lịch 06/12</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
