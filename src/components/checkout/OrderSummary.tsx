
import React from 'react';
import { Ticket, CreditCard } from 'lucide-react';
import type { CartCourseItem } from '../../types/Checkout';

interface OrderSummaryProps {
    cart: CartCourseItem[];
    subtotal: number;
    total: number;
    onRemoveCourse: (index: number) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    cart,
    subtotal,
    total,
    onRemoveCourse,
}) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

    return (
        <aside className="w-full lg:w-1/3 order-2 lg:order-2 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white font-medium flex items-center">
                        <Ticket className="w-5 h-5 mr-2 text-orange-500" />
                        Resumen de Compra
                    </h3>
                    <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-full">{cart.length} cursos</span>
                </div>

                <div className="p-6 space-y-6">
                    {/* Lista Miniatura */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {cart.length === 0 ? (
                            <p className="text-center text-slate-400 py-4 text-sm">No has seleccionado cursos aún.</p>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={item.uniqueId} className="flex justify-between items-start text-sm group">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-700">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.duration}</p>
                                        <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                            {item.mode === 'pareja' ? 'Pareja (x2)' : 'Individual'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-slate-900">
                                            {formatCurrency(item.mode === 'pareja' ? item.price * 2 : item.price)}
                                        </p>
                                        <button onClick={() => onRemoveCourse(idx)} className="text-red-400 hover:text-red-600 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                        {/* Totales */}
                        <div className="space-y-2 pt-2 text-sm">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                                <span>Total a Pagar</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
                        disabled={cart.length === 0}
                    >
                        <CreditCard className="w-5 h-5" />
                        <span>Finalizar Inscripción</span>
                    </button>
                    <p className="text-xs text-center text-slate-400">
                        Al completar, aceptas nuestros términos y condiciones.
                    </p>
                </div>
            </div>
        </aside>
    );
};
