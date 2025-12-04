import React from "react";

interface CardProps {
    image: string;
    title: string;
    date: string;
    description: string;
    location: string;
    price: string;
    badge?: {
        text: string;
        colorClass: string;
    };
    reserveLink: string;
    calendarLink: string;
    priceClass?: string;
    buttonClass?: string;
}

const Card: React.FC<CardProps> = ({
    image,
    title,
    date,
    description,
    location,
    price,
    badge,
    reserveLink,
    calendarLink,
    priceClass = "text-sc-orange",
    buttonClass = "gradient-bg",
}) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover-lift border border-gray-100 h-full flex flex-col">
            <div className="relative">
                <img src={image} alt={title} className="w-full h-48 object-cover" />
                {badge && (
                    <div
                        className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full font-bold text-sm ${badge.colorClass}`}
                    >
                        {badge.text}
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col grow">
                <div className="text-sm text-gray-600 mb-2">{date}</div>
                <h4 className="text-xl font-bold mb-2 text-gray-800">{title}</h4>
                <p className="text-gray-600 text-sm mb-4 grow">{description}</p>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700">
                        📍 {location}
                    </span>
                    <span className={`font-bold ${priceClass}`}>{price}</span>
                </div>
                <div className="flex gap-2 mb-2">
                    <a
                        href={reserveLink}
                        className={`flex-1 text-white text-center py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition ${buttonClass}`}
                    >
                        Reservar
                    </a>
                </div>
                <a
                    href={calendarLink}
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
