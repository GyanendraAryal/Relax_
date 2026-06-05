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
                console.error("Failed to load today's specials:", err);
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

    // 2. EMPTY STATE (Intentionally hidden if no specials are running today)
    if (!specials || specials.length === 0) {
        return null; 
    }

    // 3. SUCCESS STATE
    return (
        <section className="relative z-10 mx-auto max-w-6xl px-4 py-10 bg-white">
            <div className="flex items-end justify-between gap-4 border-b border-stone-100 pb-3">
                <h2 className="font-display text-2xl font-bold text-forest-900">
                    🔥 Today&apos;s Specials
                </h2>
                {!hideViewMore && (
                    <Link to="/menu" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition">
                        View More →
                    </Link>
                )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {specials.map((s) => (
                    <div
                        key={s.id}
                        className="card flex gap-4 border border-brand-200 bg-brand-50 hover:shadow-md transition p-4 rounded-lg items-center"
                    >
                        {s.item_image && (
                            <img
                                src={s.item_image}
                                alt={s.item_name}
                                className="h-16 w-16 rounded object-cover shrink-0 border border-brand-100"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-stone-900 truncate">{s.item_name}</h3>
                            {s.note && <p className="text-sm text-stone-600 mt-1 line-clamp-2">{s.note}</p>}

                            <p className="mt-2 font-bold text-brand-700">
                                {formatPrice(s.special_price || s.regular_price)}

                                {s.special_price && (
                                    <span className="ml-2 text-sm font-normal text-stone-400 line-through">
                                        {formatPrice(s.regular_price)}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
