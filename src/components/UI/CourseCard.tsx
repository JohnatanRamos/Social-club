import React from 'react';
import type { CourseCardProps } from '../../types/Course';

const colorMap = {
    red: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        btn: "bg-red-500",
        btnHover: "hover:bg-red-600",
    },
    purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        btn: "bg-purple-500",
        btnHover: "hover:bg-purple-600",
    },
    orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        btn: "bg-orange-500",
        btnHover: "hover:bg-orange-600",
    },
    green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        btn: "bg-green-500",
        btnHover: "hover:bg-green-600",
    },
    blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        btn: "bg-blue-500",
        btnHover: "hover:bg-blue-600",
    },
    special: {
        bg: "bg-gradient-to-br from-red-100 to-purple-100",
        border: "border-red-300",
        text: "text-red-700",
        btn: "bg-gradient-to-r from-red-500 to-purple-500",
        btnHover: "hover:shadow-lg",
    },
};

export const CourseCard: React.FC<CourseCardProps> = ({
    name,
    instructor,
    duration,
    location,
    color = "red",
    buttonText = "Inscribirme",
    availableSlots,
    onAdd
}) => {
    const styles = colorMap[color];
    const isFull = availableSlots === 0;

    return (
        <div
            className={`class-cell border-2 rounded-xl p-4 ${styles.bg} ${styles.border} transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 hover:shadow-xl`}
        >
            <div className={`font-bold ${styles.text}`}>{name}</div>
            <div className="text-sm text-gray-600 mt-1">{instructor}</div>
            <div className="text-xs text-gray-500 mt-1">{duration}</div>
            <div className="text-xs text-gray-500 mt-1">📍 {location}</div>
            <button
                disabled={isFull}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isFull) onAdd?.();
                }}
                className={`mt-2 w-full text-white py-1 px-3 rounded-lg text-sm font-semibold transition ${isFull
                    ? "bg-gray-400 cursor-not-allowed"
                    : `${styles.btn} ${styles.btnHover}`
                    }`}
            >
                {isFull ? "Cupo lleno" : buttonText}
            </button>
        </div>
    );
};
