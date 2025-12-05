import React from 'react';
import { useStore } from '@nanostores/react';
import { filtersStore, setFilter } from '../../stores/scheduleFiltersStore';

export const ScheduleFilters: React.FC = () => {
    const filters = useStore(filtersStore);

    const handleChange = (key: keyof typeof filters, value: string) => {
        setFilter(key, value);
    };

    return (
        <section
            className="py-8 pt-2 bg-white shadow-sm z-40 w-[97%]"
            style={{ margin: "0 auto" }}
        >
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-5 gap-4">
                    {/* Sede Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📍 Sede
                        </label>
                        <select
                            value={filters.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            <option>Todas las sedes</option>
                            <option>Social Club</option>
                            <option>Ritmo Vivo</option>
                        </select>
                    </div>

                    {/* Genre Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🎵 Género
                        </label>
                        <select
                            value={filters.genre}
                            onChange={(e) => handleChange('genre', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            <option>Todos los géneros</option>
                            <option>Salsa</option>
                            <option>Bachata</option>
                            <option>Merengue</option>
                            <option>Kizomba</option>
                            <option>Tango</option>
                        </select>
                    </div>

                    {/* Level Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📊 Nivel
                        </label>
                        <select
                            value={filters.level}
                            onChange={(e) => handleChange('level', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            <option>Todos los niveles</option>
                            <option>Principiante</option>
                            <option>Básico</option>
                            <option>Intermedio</option>
                            <option>Avanzado</option>
                        </select>
                    </div>

                    {/* Day Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📆 Día
                        </label>
                        <select
                            value={filters.day}
                            onChange={(e) => handleChange('day', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            <option>Todos los días</option>
                            <option>Lunes</option>
                            <option>Martes</option>
                            <option>Miércoles</option>
                            <option>Jueves</option>
                            <option>Viernes</option>
                            <option>Sábado</option>
                        </select>
                    </div>

                    {/* Professor Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            👨‍🏫 Profesor
                        </label>
                        <select
                            value={filters.instructor}
                            onChange={(e) => handleChange('instructor', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            <option>Todos los profesores</option>
                            <option>Juan Pérez</option>
                            <option>María González</option>
                            <option>Carlos Rodríguez</option>
                            <option>Ana Martínez</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
};
