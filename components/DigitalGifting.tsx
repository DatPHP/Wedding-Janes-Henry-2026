"use client";

import { useState } from "react";
import { Gift, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function DigitalGifting() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="py-24 bg-accent-light text-center px-6">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black">
                    Send Wishes & Gifts
                </h2>
                <p className="text-muted mb-10 text-lg">
                    Your presence at our wedding is the greatest gift of all. However, should you wish to help us celebrate with a physical gift, a digital contribution would be warmly appreciated.
                </p>

                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-full hover:brightness-110 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                    <Gift size={20} />
                    <span className="font-medium">Digital Gifting</span>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white p-8 md:p-12 rounded-[32px] shadow-2xl relative z-10 max-w-sm w-full border border-accent/10"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 text-muted hover:text-black transition-colors bg-background rounded-full p-2"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-2xl font-serif text-accent mb-2">Thank You</h3>
                            <p className="text-sm text-muted mb-8">Scan the QR code below using your banking app</p>

                            <div className="aspect-square bg-background rounded-2xl flex items-center justify-center p-8 border border-accent/20 mb-6">
                                {/* Placeholder for absolute an actual Bank VietQR image */}
                                <div className="text-center">
                                    <div className="w-48 h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-muted">
                                        <img src="/images/QR_banking_janes.jpg" alt="Janes's QR Code" />
                                    </div>
                                    <p className="font-semibold text-black">Janes & Henry</p>
                                    <p className="text-sm text-muted">Asia Commercial Bank (ACB)</p>
                                    <p className="text-sm text-muted">4562587</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted">With all our love and appreciation.</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
