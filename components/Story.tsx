export default function Story() {
    const milestones = [
        {
            year: "2024",
            title: "Lần Đầu Gặp Gỡ",
            desc: "Chúng tôi gặp nhau lần đầu tại một quán nướng nhỏ ở Thuận An, Bình Dương.",
        },
        {
            year: "2024",
            title: "Buổi Hẹn Hò Đầu Tiên",
            desc: "Buổi hẹn hò đầu tiên ở Thuận An.",
        },
        {
            year: "2024",
            title: "Ngày Cầu Hôn",
            desc: "Chính thức ngỏ lời yêu thương.",
        },
        {
            year: "2025",
            title: "Chuyến Xuất Ngoại Đầu Tiên",
            desc: "Đón Giáng sinh và đi dạo quanh Kuala Lumpur.",
        }, {
            year: "2026",
            title: "Chuyến Đi Huế - Đà Nẵng - Hội An",
            desc: "Hành trình thanh xuân tuyệt vời của chúng tôi.",
        },
        {
            year: "2026",
            title: "Ngày Chung Đôi",
            desc: "Ngày trọng đại - 06 tháng 12 năm 2026.",
        },
    ];

    return (
        <section className="py-24 px-6 max-w-3xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-accent uppercase tracking-widest text-sm mb-4">Hành Trình Của Chúng Tôi</h2>
                <h3 className="text-4xl md:text-5xl font-serif text-black font-semibold">Hành Trình Tình Yêu</h3>
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
                            <h4 className="text-black text-xl md:text-2xl font-serif font-semibold mb-3">
                                {item.title}
                            </h4>
                            <p className="text-muted leading-relaxed font-normal text-base md:text-lg">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
