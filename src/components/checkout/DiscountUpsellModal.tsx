import React from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';
import type { CartCourseItem } from '../../types/Checkout';

interface DiscountUpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
    cart: CartCourseItem[];
}

export const DiscountUpsellModal: React.FC<DiscountUpsellModalProps> = ({
    isOpen,
    onClose,
    onContinue,
    cart,
}) => {
    if (!isOpen) return null;

    const individualCourses = cart.filter(item => item.mode === 'individual' && !item.promotion);
    const count = individualCourses.length;

    let title = '';
    let description = '';
    let highlight = '';

    if (count === 0) {
        title = '¡Obtén un 5% de descuento!';
        description = 'Agrega dos cursos de manera individual y obtén un';
        highlight = '5% OFF';
    } else if (count === 1) {
        title = '¡Estás muy cerca!';
        description = 'Agrega un curso más de manera individual y obtén un';
        highlight = '5% OFF';
    } else if (count === 2) {
        title = '¡Mejora tu descuento!';
        description = 'Agrega un curso más de manera individual y obtén un';
        highlight = '15% OFF';
    } else {
        // Fallback if shown when not needed, though logic in parent should prevent this
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">

                {/* Header with pattern */}
                <div className="relative bg-indigo-600 p-6 text-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                    <div className="relative z-10 flex justify-center mb-4">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-md">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h3 className="relative z-10 text-xl font-bold text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-slate-600 text-lg">
                            {description} <span className="font-bold text-indigo-600 text-xl">{highlight}</span>
                        </p>
                        <p className="text-sm text-slate-400">
                            ¡Aprovecha esta oportunidad para aprender más!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
                        >
                            <span>Ver más cursos</span>
                            <ArrowRight size={18} />
                        </button>

                        <button
                            onClick={onContinue}
                            className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-colors"
                        >
                            No gracias, continuar al pago
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
