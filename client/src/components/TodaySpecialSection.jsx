import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { todaySpecialApi } from "../api/todaySpecial.api.js";
import { formatPrice } from "../utils/format.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function TodaySpecialSection({ hideViewMore = false }) {
    const [specials, setSpecials] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        todaySpecialApi
            .getToday()
            .then((res) => {
                const cleanData = Array.isArray(res) ? res : (res?.data || []);
                setSpecials(cleanData);
            })
            .catch((err) => {
                console.error("❌ Failed to load today's specials:", err);
                setSpecials([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // 1. LOADING STATE
    if (loading) {
        return (
            <section className="mx-auto max-w-6xl px-4 py-10">
                <LoadingSpinner />
            </section>
        );
    }

    // 2. EMPTY STATE
    if (!specials || specials.length === 0) {
        return null; 
    }

    // 3. SUCCESS STATE
    return (
        <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 bg-white">
            <div className="flex items-end justify-between gap-4 border-b border-stone-100 pb-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Fresh Today</p>
                    <h2 className="font-display text-2xl font-bold text-forest-900 mt-0.5">
                        🔥 Today&apos;s Specials
                    </h2>
                </div>
                {!hideViewMore && (
                    <Link to="/menu" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition">
                        View More →
                    </Link>
                )}
            </div>

            {/* 🟢 Responsive Grid: 1 col on mobile, 2 on tablet, 3 on laptop, 4 on large screens */}
            <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {specials.map((s) => (
                    <div
                        key={s.id}
                        className="flex flex-col overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm transition hover:shadow-md aspect-square"
                    >
                        {/* Upper Half: Image Section */}
                        <div className="relative flex-1 bg-stone-50 overflow-hidden w-full min-h-0">
                            {s.item_image || s.image_url ? (
                                <img
                                    src={s.item_image || s.image_url}
                                    alt={s.item_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 text-4xl select-none">
                                    🍽️
                                </div>
                            )}

                            {/* Floating Badge on top of image */}
                            <span className="absolute top-3 left-3 inline-block rounded-full bg-brand-600/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                🔥 Special
                            </span>
                        </div>

                        {/* Lower Half: Metadata Details Section */}
                        <div className="p-4 flex flex-col justify-between shrink-0 bg-white border-t border-stone-50 h-[110px]">
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-display font-bold text-stone-900 leading-tight text-sm truncate capitalize flex-1">
                                        {s.item_name}
                                    </h3>
                                    
                                    <div className="flex flex-col items-end shrink-0">
                                        <span className="text-sm font-bold text-brand-600">
                                            {formatPrice(s.special_price || s.regular_price)}
                                        </span>
                                        {s.special_price && s.regular_price && (
                                            <span className="text-[10px] text-stone-400 line-through">
                                                {formatPrice(s.regular_price)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {s.note ? (
                                    <p className="mt-1 text-xs text-stone-500 line-clamp-2 pr-1">
                                        {s.note}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-stone-400 italic">Chef's daily selection</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );  
}
