import React, { useEffect } from 'react';
import { CheckCircle, Home, Calendar } from 'lucide-react';
import { clearCart } from '../../stores/cartStore';

export const EnrollmentSuccess: React.FC = () => {

    useEffect(() => {
        // Clear cart on mount
        clearCart();
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center space-y-6 border border-slate-100">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900">
                    ¡Inscripción Exitosa!
                </h1>

                <p className="text-slate-600 text-lg">
                    Hemos recibido tu solicitud correctamente. Te hemos enviado un correo con los detalles de tu inscripción.
                </p>

                <div className="bg-slate-50 rounded-xl p-6 text-left space-y-3">
                    <h3 className="font-semibold text-slate-900 mb-2">Próximos pasos:</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                            <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                            Revisa tu correo electrónico para ver tu comprobante.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                            Preséntate en la sede 15 minutos antes de tu primera clase.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                            ¡Disfruta aprendiendo a bailar!
                        </li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <a
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Inicio
                    </a>
                    <a
                        href="/horarios"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 shadow-lg shadow-orange-500/20 transition-all"
                    >
                        <Calendar className="w-5 h-5" />
                        Ver Horarios
                    </a>
                </div>
            </div>
        </div>
    );
};
