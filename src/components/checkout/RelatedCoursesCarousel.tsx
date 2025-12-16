import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { classesStore, fetchClasses } from '../../stores/classesStore';
import { addToCart } from '../../stores/cartStore';
import type { CartCourseItem } from '../../types/Checkout';
import { Plus } from 'lucide-react';

interface RelatedCoursesCarouselProps {
    cart: CartCourseItem[];
}

export const RelatedCoursesCarousel: React.FC<RelatedCoursesCarouselProps> = ({ cart }) => {
    const classes = useStore(classesStore);

    useEffect(() => {
        fetchClasses();
    }, []);

    if (cart.length === 0) return null;

    const cartLocation = cart[0].location;
    const cartIds = new Set(cart.map(item => item.id));

    const relatedCourses = classes.filter(course =>
        course.location === cartLocation && !cartIds.has(course.id) && course.capacity > course.availableSlots
    );

    if (relatedCourses.length === 0) return null;

    return (
        <div className="mt-8 border-t border-slate-200 pt-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
                Otros cursos en {cartLocation} que te podrían interesar
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                {relatedCourses.map(course => (
                    <div
                        key={course.id}
                        className="min-w-[260px] bg-white rounded-xl border border-slate-200 p-4 shadow-sm snap-start hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${course.color === 'red' ? 'bg-red-100 text-red-700' :
                                    course.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                                        course.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                            course.color === 'green' ? 'bg-green-100 text-green-700' :
                                                course.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'
                                    }`}>
                                    {course.genre}
                                </span>
                                <span className="text-sm font-bold text-slate-900">${course.price}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-1">{course.name}</h4>
                            <div className="text-xs text-slate-500 space-y-1 mb-4">
                                <p>📅 {course.day} - {course.time}</p>
                                <p>👨‍🏫 {course.instructor}</p>
                                <p>📍 {course.location}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => addToCart(course)}
                            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <Plus size={16} />
                            Agregar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
