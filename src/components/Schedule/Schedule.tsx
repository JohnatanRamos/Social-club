import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { classesStore, isLoading, errorStore, fetchClasses } from '../../stores/classesStore';
import { filtersStore } from '../../stores/scheduleFiltersStore';
import { CourseCard } from '../UI/CourseCard';
import { addToCart } from '../../stores/cartStore';
import { FloatingCartButton } from '../UI/FloatingCartButton';

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export const Schedule: React.FC = () => {
    const classes = useStore(classesStore);
    const loading = useStore(isLoading);
    const error = useStore(errorStore);
    const filters = useStore(filtersStore);

    const TIME_SLOTS = [...new Set(classes.map(c => c.time?.toUpperCase()).filter(Boolean) as string[])].sort();

    useEffect(() => {
        fetchClasses();
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

    const getClassForSlot = (day: string, time: string) => {
        return filteredClasses.find(c => c.day === day && c.time?.toUpperCase() === time);
    };

    return (
        <div>
            {/* Desktop Schedule Table */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-lg">
                <table className="w-full">
                    <thead className="bg-linear-to-br from-[#f05123] to-[#ff6b3d] text-white">
                        <tr>
                            <th className="py-4 px-6 text-left">HORARIO</th>
                            {DAYS.map(day => (
                                <th key={day} className="py-4 px-6 text-center uppercase">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TIME_SLOTS.map((time) => (
                            <tr key={time} className="border-b border-gray-100 last:border-0">
                                <td className="py-4 px-6 font-bold text-gray-700">{time}</td>
                                {DAYS.map((day) => {
                                    const classSession = getClassForSlot(day, time);
                                    return (
                                        <td key={`${day}-${time}`} className="py-4 px-6 min-w-[200px]">
                                            {classSession ? (
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
                                                    onAdd={() => addToCart(classSession)}
                                                />
                                            ) : (
                                                <div className="h-full min-h-[140px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
                                                    Sin clase
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            <FloatingCartButton />
        </div>
    );
};
