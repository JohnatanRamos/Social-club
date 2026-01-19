import React from 'react';
import { CheckCircle, Home, Calendar } from 'lucide-react';

export const ReservationSuccess: React.FC = () => {

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center space-y-6 border border-slate-100">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900">
                    ¡Reserva Confirmada!
                </h1>

                <p className="text-slate-600 text-lg">
                    Hemos recibido tu solicitud de reserva correctamente. Te esperamos para disfrutar de una gran experiencia.
                </p>

                <div className="bg-slate-50 rounded-xl p-6 text-left space-y-3">
                    <h3 className="font-semibold text-slate-900 mb-2">Información importante:</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                            <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                            Recibirás un mensaje de confirmación a tu WhatsApp/Correo.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                            Te recomendamos llegar 15 minutos antes de tu reserva.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                            ¡Prepárate para vivir el mejor ambiente!
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
                        href="/reservas"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 shadow-lg shadow-orange-500/20 transition-all"
                    >
                        <Calendar className="w-5 h-5" />
                        Nueva Reserva
                    </a>
                </div>
            </div>
        </div>
    );
};
