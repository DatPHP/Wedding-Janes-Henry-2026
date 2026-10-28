import { MapPin, CalendarHeart, Clock, Utensils } from "lucide-react";

export default function EventInfo() {
    // Google Maps links — chính xác theo địa chỉ trên thiệp
    const mapTuGiaNhaGai = "https://www.google.com/maps/search/?api=1&query=18A+Quang+Trung,+Xa+Phu+Cat,+Tinh+Gia+Lai,+Vietnam";
    const mapCatViet = "https://www.google.com/maps/search/?api=1&query=38+Tran+Quoc+Toan,+Xa+Phu+Cat,+Tinh+Gia+Lai,+Vietnam";
    const mapTuGiaNhaTrai = "https://www.google.com/maps/search/?api=1&query=5C+Nguyen+Van+Tiet,+Phuong+Lai+Thieu,+Thanh+pho+Ho+Chi+Minh,+Vietnam";
    const mapMimiPalace = "https://www.google.com/maps/search/?api=1&query=58A+Nguyen+Van+Tiet,+Phuong+Lai+Thieu,+Thanh+pho+Ho+Chi+Minh,+Vietnam";
    
    // Google Calendar links — chính xác theo thiệp cưới
    // Nhà Gái: 28/11/2026, Lễ 09:00 + Tiệc 11:00-14:00 (UTC+7 → UTC)
    const calendarLinkGai = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=L%E1%BB%85+Vu+Quy+Ki%E1%BB%81u+Ng%C3%A2n+%26+V%C4%83n+%C4%90%E1%BA%A1t+(Nh%C3%A0+G%C3%A1i)&dates=20261128T020000Z/20261128T070000Z&details=L%E1%BB%85+Vu+Quy%3A+09%3A00+t%E1%BA%A1i+T%C6%B0+Gia%0ATi%E1%BB%87c+c%C6%B0%E1%BB%9Bi%3A+NH+C%C3%A1t+Vi%E1%BB%87t%2C+38+Tr%E1%BA%A7n+Qu%E1%BB%91c+To%E1%BA%A3n%0A%C4%90%C3%B3n+kh%C3%A1ch%3A+11%3A00+-+Khai+ti%E1%BB%87c%3A+11%3A30&location=18A+Quang+Trung%2C+X%C3%A3+Ph%C3%B9+C%C3%A1t%2C+T%E1%BB%89nh+Gia+Lai";
    // Nhà Trai: 06/12/2026, Lễ 09:00 + Tiệc 11:00-14:00 (UTC+7 → UTC)
    const calendarLinkTrai = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=L%E1%BB%85+Th%C3%A0nh+H%C3%B4n+Ki%E1%BB%81u+Ng%C3%A2n+%26+V%C4%83n+%C4%90%E1%BA%A1t+(Nh%C3%A0+Trai)&dates=20261206T020000Z/20261206T070000Z&details=L%E1%BB%85+Th%C3%A0nh+H%C3%B4n%3A+09%3A00+t%E1%BA%A1i+T%C6%B0+Gia%0ATi%E1%BB%87c+c%C6%B0%E1%BB%9Bi%3A+MIMI+PALACE%2C+58A+Nguy%E1%BB%85n+V%C4%83n+Ti%E1%BA%BFt%0A%C4%90%C3%B3n+kh%C3%A1ch%3A+11%3A00+-+Khai+ti%E1%BB%87c%3A+12%3A00&location=58A+Nguy%E1%BB%85n+V%C4%83n+Ti%E1%BA%BFt%2C+P.+Lai+Thi%C3%AAu%2C+TP.+H%E1%BB%93+Ch%C3%AD+Minh";

    return (
        <section className="relative py-24 bg-gradient-to-b from-white via-accent-light/30 to-white text-center px-6 overflow-hidden">
            {/* Subtle background aesthetic */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent-light/80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-light/80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/4 translate-y-1/4"></div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Chương Trình Lễ Cưới
                    </h2>
                    <p className="text-accent font-serif italic text-xl tracking-wide">
                        Sự hiện diện của bạn là niềm vinh hạnh cho chúng tôi
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* ═══════════════════════════════════════════════════════
                        NHÀ GÁI — Lễ Vu Quy — 28/11/2026
                    ═══════════════════════════════════════════════════════ */}
                    <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(255,133,161,0.06)] border border-accent/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(255,133,161,0.15)] flex flex-col h-full group relative overflow-hidden">
                        {/* Decorative background corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/40 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
                        
                        <div className="w-16 h-16 bg-accent-light/50 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 group-hover:rotate-12 group-hover:bg-accent group-hover:text-white transition-all duration-500 text-accent">
                            <CalendarHeart size={28} strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-3xl font-serif text-foreground mb-2 group-hover:text-accent transition-colors duration-300">Lễ Vu Quy</h3>
                        <p className="text-accent/80 text-xs font-semibold tracking-widest uppercase mb-6">Nhà Gái · Thứ Bảy, 28/11/2026</p>
                        
                        <div className="space-y-5 text-muted flex-grow text-left">
                            {/* Phần Lễ */}
                            <div className="bg-accent-light/20 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock size={16} className="text-accent" />
                                    <span className="text-sm font-semibold text-accent uppercase tracking-wider">Nghi Lễ</span>
                                </div>
                                <p className="text-lg font-medium text-foreground">09:00 — Thứ Bảy, 28/11/2026</p>
                                <p className="text-sm mt-1">(Nhằm ngày 20 tháng 10 năm Bính Ngọ)</p>
                                <div className="flex items-start gap-2 mt-3">
                                    <MapPin size={15} className="text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">Tại Tư Gia Nhà Gái</p>
                                        <p className="text-sm">18A Quang Trung, Xã Phù Cát, Tỉnh Gia Lai</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phần Tiệc */}
                            <div className="bg-accent-light/20 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Utensils size={16} className="text-accent" />
                                    <span className="text-sm font-semibold text-accent uppercase tracking-wider">Tiệc Cưới</span>
                                </div>
                                <p className="text-lg font-medium text-foreground">Đón khách: 11:00 · Khai tiệc: 11:30</p>
                                <div className="flex items-start gap-2 mt-3">
                                    <MapPin size={15} className="text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">Nhà Hàng Tiệc Cưới Cát Việt</p>
                                        <p className="text-sm">38 Trần Quốc Toản, Xã Phù Cát, Tỉnh Gia Lai</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 space-y-3">
                            <a href={mapCatViet} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-white transition-all duration-300 w-full px-6 py-4 bg-white border border-accent/20 rounded-full hover:bg-accent hover:border-accent hover:shadow-lg hover:shadow-accent/30 group-hover:bg-accent/5">
                                <MapPin size={18} /> Xem Bản Đồ Nhà Hàng
                            </a>
                            <a href={calendarLinkGai} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-all duration-300 w-full px-6 py-3">
                                <CalendarHeart size={16} /> Lưu Lịch 28/11
                            </a>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        NHÀ TRAI — Lễ Thành Hôn — 06/12/2026
                    ═══════════════════════════════════════════════════════ */}
                    <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(255,133,161,0.06)] border border-accent/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(255,133,161,0.15)] flex flex-col h-full group relative overflow-hidden">
                        {/* Decorative background corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/40 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
                        
                        <div className="w-16 h-16 bg-accent-light/50 rounded-2xl flex items-center justify-center mx-auto mb-8 -rotate-3 group-hover:-rotate-12 group-hover:bg-accent group-hover:text-white transition-all duration-500 text-accent">
                            <CalendarHeart size={28} strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-3xl font-serif text-foreground mb-2 group-hover:text-accent transition-colors duration-300">Lễ Thành Hôn</h3>
                        <p className="text-accent/80 text-xs font-semibold tracking-widest uppercase mb-6">Nhà Trai · Chủ Nhật, 06/12/2026</p>
                        
                        <div className="space-y-5 text-muted flex-grow text-left">
                            {/* Phần Lễ */}
                            <div className="bg-accent-light/20 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock size={16} className="text-accent" />
                                    <span className="text-sm font-semibold text-accent uppercase tracking-wider">Nghi Lễ</span>
                                </div>
                                <p className="text-lg font-medium text-foreground">09:00 — Chủ Nhật, 06/12/2026</p>
                                <p className="text-sm mt-1">(Nhằm ngày 28 tháng 10 năm Bính Ngọ)</p>
                                <div className="flex items-start gap-2 mt-3">
                                    <MapPin size={15} className="text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">Tại Tư Gia Nhà Trai</p>
                                        <p className="text-sm">5/C Nguyễn Văn Tiết, P. Lai Thiêu, TP. Hồ Chí Minh</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phần Tiệc */}
                            <div className="bg-accent-light/20 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Utensils size={16} className="text-accent" />
                                    <span className="text-sm font-semibold text-accent uppercase tracking-wider">Tiệc Cưới</span>
                                </div>
                                <p className="text-lg font-medium text-foreground">Đón khách: 11:00 · Khai tiệc: 12:00</p>
                                <div className="flex items-start gap-2 mt-3">
                                    <MapPin size={15} className="text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">Trung Tâm Hội Nghị · Tiệc Cưới MIMI PALACE</p>
                                        <p className="text-sm">58A Nguyễn Văn Tiết, P. Lai Thiêu, TP. Hồ Chí Minh</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 space-y-3">
                            <a href={mapMimiPalace} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-white transition-all duration-300 w-full px-6 py-4 bg-white border border-accent/20 rounded-full hover:bg-accent hover:border-accent hover:shadow-lg hover:shadow-accent/30 group-hover:bg-accent/5">
                                <MapPin size={18} /> Xem Bản Đồ MIMI PALACE
                            </a>
                            <a href={calendarLinkTrai} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-all duration-300 w-full px-6 py-3">
                                <CalendarHeart size={16} /> Lưu Lịch 06/12
                            </a>
                        </div>
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
                        <span>Lưu Lịch 28/11 — Nhà Gái</span>
                    </a>
                    <a 
                        href={calendarLinkTrai} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white border border-accent/30 text-accent px-8 py-4 rounded-full font-medium hover:bg-accent hover:text-white hover:shadow-[0_10px_25px_rgb(255,133,161,0.35)] hover:-translate-y-1 transition-all duration-300"
                    >
                        <CalendarHeart size={20} />
                        <span>Lưu Lịch 06/12 — Nhà Trai</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
