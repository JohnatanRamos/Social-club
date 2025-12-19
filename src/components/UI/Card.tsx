import React from "react";
import type { Event } from "../../types/Event";
import { formatDate, formatGoogleCalendarDate } from "../../utils/dateUtils";

interface CardProps extends Event { }

const Card: React.FC<CardProps> = ({
    image,
    title,
    date,
    description,
    location,
    price,
    color = "orange",
    day,
    time,
}) => {
    const colorMap = {
        orange: { text: "text-sc-orange", btn: "gradient-bg" },
        blue: { text: "text-rv-aqua", btn: "bg-rv-aqua" },
        pink: { text: "text-pink-600", btn: "bg-pink-600" },
        green: { text: "text-green-600", btn: "bg-green-600" },
    };

    const styles = colorMap[color as keyof typeof colorMap] || colorMap.orange;

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover-lift border border-gray-100 h-full flex flex-col">
            <div className="relative">
                <img src={image} alt={title} className="w-full h-48 object-cover" />
            </div>
            <div className="p-6 flex flex-col grow">
                <div className="text-sm text-gray-600 mb-2">
                    {day} {formatDate(date)} - {time}
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-800">{title}</h4>
                <p className="text-gray-600 text-sm mb-4 grow">{description}</p>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700">
                        📍 {location}
                    </span>
                    <span className={`font-bold ${styles.text}`}>
                        {price === 0 ? "Gratis" : `$${price.toLocaleString()}`}
                    </span>
                </div>
                <div className="flex gap-2 mb-2">
                    <a
                        href={`https://wa.me/573218903991?text=${encodeURIComponent(`Quiero reservar para el evento: ${title}`)}`}
                        className={`flex-1 text-white text-center py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition ${styles.btn}`}
                    >
                        Reservar
                    </a>
                </div>

                <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${encodeURIComponent(formatGoogleCalendarDate(date))}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`}
                    target="_blank"
                    className="block w-full text-center py-2 border border-blue-500 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 transition"
                >
                    📅 Agregar
                </a>
            </div>
        </div>
    );
};

export default Card;
