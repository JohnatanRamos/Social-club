import React from 'react';
import { useStore } from '@nanostores/react';
import { filtersStore, setFilter } from '../../stores/scheduleFiltersStore';
import { classesStore } from '../../stores/classesStore';

export const ScheduleFilters: React.FC = () => {
    const filters = useStore(filtersStore);
    const classes = useStore(classesStore);

    const handleChange = (key: keyof typeof filters, value: string) => {
        setFilter(key, value);
    };

    // Helper to get classes that match all filters except the one being calculated
    const getFilteredOptions = React.useCallback((excludeKey: keyof typeof filters) => {
        return classes.filter(c => {
            const matchesLocation = excludeKey === 'location' || !filters.location || c.location === filters.location;
            const matchesGenre = excludeKey === 'genre' || filters.genre === "Todos los géneros" || c.genre === filters.genre;
            const matchesLevel = excludeKey === 'level' || filters.level === "Todos los niveles" || c.level === filters.level;
            const matchesDay = excludeKey === 'day' || filters.day === "Todos los días" || c.day === filters.day;
            const matchesInstructor = excludeKey === 'instructor' || filters.instructor === "Todos los profesores" || c.instructor === filters.instructor;

            return matchesLocation && matchesGenre && matchesLevel && matchesDay && matchesInstructor;
        });
    }, [classes, filters]);

    // Derived filter options based on current selection of OTHER filters
    const genres = React.useMemo(() => ["Todos los géneros", ...new Set(getFilteredOptions('genre').map(c => c.genre).filter(Boolean) as string[])], [getFilteredOptions]);
    const levels = React.useMemo(() => ["Todos los niveles", ...new Set(getFilteredOptions('level').map(c => c.level).filter(Boolean) as string[])], [getFilteredOptions]);
    const locations = React.useMemo(() => [...new Set(getFilteredOptions('location').map(c => c.location).filter(Boolean) as string[])], [getFilteredOptions]);
    const instructors = React.useMemo(() => ["Todos los profesores", ...new Set(getFilteredOptions('instructor').map(c => c.instructor).filter(Boolean) as string[])], [getFilteredOptions]);

    const days = React.useMemo(() => {
        const dayOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        const availableDays = new Set(getFilteredOptions('day').map(c => c.day));
        return ["Todos los días", ...dayOrder.filter(d => availableDays.has(d as any))];
    }, [getFilteredOptions]);

    // Reset filters if current selection is no longer valid due to other filters
    React.useEffect(() => {
        if (locations.length > 0 && !locations.includes(filters.location)) {
            setFilter('location', locations[0]);
        }
        if (filters.genre !== "Todos los géneros" && !genres.includes(filters.genre)) {
            setFilter('genre', "Todos los géneros");
        }
        if (filters.level !== "Todos los niveles" && !levels.includes(filters.level)) {
            setFilter('level', "Todos los niveles");
        }
        if (filters.day !== "Todos los días" && !days.includes(filters.day)) {
            setFilter('day', "Todos los días");
        }
        if (filters.instructor !== "Todos los profesores" && !instructors.includes(filters.instructor)) {
            setFilter('instructor', "Todos los profesores");
        }
    }, [locations, genres, levels, days, instructors, filters]);

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
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
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
                            {genres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
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
                            {levels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
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
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
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
                            {instructors.map(ins => (
                                <option key={ins} value={ins}>{ins}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
};
