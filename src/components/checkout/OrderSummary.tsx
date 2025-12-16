
import React from 'react';
import { Ticket, CreditCard, Trash2 } from 'lucide-react';
import type { CartCourseItem } from '../../types/Checkout';

interface OrderSummaryProps {
    cart: CartCourseItem[];
    subtotal: number;
    total: number;
    bundleDiscount: number;
    promptPaymentDiscount: number;
    isPromptPayment: boolean;
    onTogglePromptPayment: () => void;
    onRemoveCourse: (index: number) => void;
    onCheckout?: () => void;
    isValid?: boolean;
    isLoading?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    cart,
    subtotal,
    total,
    bundleDiscount,
    promptPaymentDiscount,
    isPromptPayment,
    onTogglePromptPayment,
    onRemoveCourse,
    onCheckout,
    isValid = false,
    isLoading = false,
}) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val);

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
                                        <button
                                            onClick={() => onRemoveCourse(idx)}
                                            className="text-red-600 p-1 rounded-full hover:bg-red-50 transition-all cursor-pointer"
                                            title="Eliminar curso"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                        {/* Opciones de Pago */}
                        <div className="flex items-center justify-between py-2">
                            <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isPromptPayment}
                                    onChange={onTogglePromptPayment}
                                    className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                                />
                                <span>Pago de contado (-5%)</span>
                            </label>
                        </div>

                        {/* Totales */}
                        <div className="space-y-2 pt-2 text-sm">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>

                            {bundleDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Descuento por paquete</span>
                                    <span>-{formatCurrency(bundleDiscount)}</span>
                                </div>
                            )}

                            {promptPaymentDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Descuento pronto pago</span>
                                    <span>-{formatCurrency(promptPaymentDiscount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                                <span>Total a Pagar</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onCheckout}
                        className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${isValid && cart.length > 0 && !isLoading
                            ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                            }`}
                        disabled={!isValid || cart.length === 0 || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                <span>Finalizar Inscripción</span>
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-slate-400">
                        Al completar, aceptas nuestros términos y condiciones.
                    </p>
                </div>
            </div>
        </aside>
    );
};
