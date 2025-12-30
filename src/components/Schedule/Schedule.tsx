import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { classesStore, isLoading, errorStore, fetchClasses } from '../../stores/classesStore';
import { filtersStore } from '../../stores/scheduleFiltersStore';
import { CourseCard } from '../UI/CourseCard';
import { addToCart } from '../../stores/cartStore';
import { FloatingCartButton } from '../UI/FloatingCartButton';

const ALL_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const Schedule: React.FC = () => {
    const classes = useStore(classesStore);
    const loading = useStore(isLoading);
    const error = useStore(errorStore);
    const filters = useStore(filtersStore);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        fetchClasses();
        setHasMounted(true);
    }, []);

    if (loading && classes.length === 0) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sc-orange"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-600">
                <p>Error cargando los horarios: {error}</p>
                <button
                    onClick={() => fetchClasses()}
                    className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const filteredClasses = classes.filter(c => {
        if (filters.location && c.location !== filters.location) return false;
        if (filters.genre !== "Todos los géneros" && c.genre !== filters.genre) return false;
        if (filters.level !== "Todos los niveles" && c.level !== filters.level && c.level !== "Todos") return false;
        if (filters.day !== "Todos los días" && c.day !== filters.day) return false;
        if (filters.instructor !== "Todos los profesores" && !c.instructor.includes(filters.instructor)) return false;
        return true;
    });

    const ACTIVE_DAYS = ALL_DAYS.filter(day =>
        filteredClasses.some(c => c.day === day)
    );

    return (
        <div>
            {/* Desktop Schedule - Day Columns */}
            <div className="hidden md:grid grid-flow-col auto-cols-fr gap-4 overflow-x-auto pb-6 custom-scrollbar">
                {ACTIVE_DAYS.map((day) => (
                    <div key={day} className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                        <div className="bg-linear-to-br from-[#f05123] to-[#ff6b3d] p-4 text-center">
                            <h4 className="text-white font-bold uppercase tracking-wider">{day}</h4>
                        </div>
                        <div className="p-4 space-y-4 bg-gray-50/50 flex-1">
                            {filteredClasses
                                .filter(c => c.day === day)
                                .sort((a, b) => {
                                    const parseTime = (t: string) => {
                                        const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                                        if (!match) return 0;
                                        let [_, hours, minutes, period] = match;
                                        let h = parseInt(hours);
                                        const m = parseInt(minutes);
                                        if (period?.toUpperCase() === 'PM' && h < 12) h += 12;
                                        if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
                                        return h * 60 + m;
                                    };
                                    return parseTime(a.time || "") - parseTime(b.time || "");
                                })
                                .map((classSession) => (
                                    <div key={classSession.id} className="relative group">
                                        <div className="absolute -left-2 top-4 w-1 h-12 bg-sc-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="mb-1 flex items-center gap-2">
                                            <span className="text-xs font-bold text-sc-orange bg-orange-50 px-2 py-0.5 rounded-full">
                                                {classSession.time?.toUpperCase()}
                                            </span>
                                        </div>
                                        <CourseCard
                                            location={classSession.location}
                                            capacity={classSession.capacity}
                                            promotion={classSession.promotion}
                                            name={classSession.name}
                                            instructor={classSession.instructor}
                                            duration={classSession.duration}
                                            price={classSession.price}
                                            color={classSession.color}
                                            buttonText={classSession.buttonText}
                                            id={classSession.id}
                                            availableSlots={classSession.availableSlots}
                                            startDate={classSession.startDate}
                                            onAdd={() => addToCart(classSession)}
                                        />
                                    </div>
                                ))}

                            {/* Private Class CTA */}
                            <div className="mt-auto pt-4 border-t border-dashed border-gray-200">
                                <div className="bg-white/60 border border-dashed border-gray-300 rounded-xl p-4 text-center group hover:border-sc-orange transition-colors">
                                    <p className="text-sm font-medium text-gray-500 group-hover:text-sc-orange transition-colors">
                                        ✨ Clase privada disponible
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">Agenda tu horario personalizado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Schedule Cards */}
            <div className="md:hidden space-y-4">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map((classSession) => (
                        <div key={classSession.id} className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-lg">{classSession.name}</h4>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>📅</span>
                                    <span>{classSession.day} {classSession.time?.toUpperCase()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>👨‍🏫</span>
                                    <span>{classSession.instructor}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>⏱️</span>
                                    <span>{classSession.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>📍</span>
                                    <span>{classSession.location}</span>
                                </div>
                                {classSession.startDate && (
                                    <div className="flex items-center gap-2 text-sm font-semibold text-sc-orange">
                                        <span>📅 Inicio:</span>
                                        <span>{classSession.startDate}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                disabled={classSession.availableSlots === 0}
                                onClick={() => {
                                    if (classSession.availableSlots !== 0) {
                                        addToCart(classSession);
                                    }
                                }}
                                className={`w-full py-3 rounded-xl font-semibold transition ${classSession.availableSlots === 0
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "gradient-bg text-white hover:shadow-lg"
                                    }`}
                            >
                                {classSession.availableSlots === 0 ? "Cupo lleno" : (classSession.buttonText || "Reservar Clase")}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No se encontraron clases con los filtros seleccionados.
                    </div>
                )}
            </div>
            {hasMounted && <FloatingCartButton />}
        </div>
    );
};
