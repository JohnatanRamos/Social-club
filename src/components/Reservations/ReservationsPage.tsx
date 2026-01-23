import React, { useState } from 'react';
import { ReservationForm } from './ReservationForm';
import { ReservationSuccess } from './ReservationSuccess';

export const ReservationsPage: React.FC = () => {
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSuccess = () => {
        setShowSuccess(true);
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNewReservation = () => {
        setShowSuccess(false);
    };

    if (showSuccess) {
        return (
            <section className="py-20 bg-linear-to-br from-orange-100 to-red-100">
                <div className="container mx-auto px-4">
                    <ReservationSuccess onNewReservation={handleNewReservation} />
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Reservation Section */}
            <section
                id="reservar"
                className="py-20 bg-linear-to-br from-orange-100 to-red-100"
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold text-gray-800 mb-4">
                                ¿Dónde nos vemos hoy?
                            </h3>
                            <p className="text-gray-600 text-lg">
                                Dos espacios, miles de experiencias. Selecciona tu vibra y reserva
                                en el lugar que va con tu mood
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                {/* Benefits */}
                                <div>
                                    <h4 className="text-2xl font-bold mb-6 text-gray-800">
                                        ¿Por qué Reservar?
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-linear-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-white font-bold">✓</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">
                                                    Rumba Asegurada:
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    Ambientes que estallan de energía, DJs y música en vivo,
                                                    bailarines, shows y una comunidad que siempre llega con
                                                    toda.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-linear-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-white font-bold">✓</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">
                                                    Comida Deliciosa:
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    Opciones para todos los antojos.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-linear-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-white font-bold">✓</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">
                                                    Experiencias Personalizadas:
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    Cumpleaños, cenas, reuniones,grados, despedidas de
                                                    soltero… arma tu plan y nosotros lo hacemos brillar.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-linear-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-white font-bold">✓</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">
                                                    Ubicaciones que rompen:
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    Un pedazo de Cartagena en Envigado, una rumba icónica bajo
                                                    un puente en Medellín, dos ambientes que no vas a
                                                    encontrar en ningún otro lado.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div>
                                    <h4 className="text-2xl font-bold mb-6 text-gray-800">Precios</h4>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold text-gray-800">SOCIAL</span>
                                                <span className="text-2xl font-bold text-orange-600">$25.000</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Consumo mínimo 25.000 por persona
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold text-gray-800">RITMO</span>
                                                <span className="text-2xl font-bold text-orange-600">$40.000</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Consumo mínimo 40.000 por persona
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
                                            <div className="text-sm text-yellow-700">
                                                Deben realizar el abono por el 100% del consumo mínimo
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-8 text-center">
                                <p className="text-gray-600 mb-6">
                                    Aquí siempre pasa algo brutal. Aquí la rumba está asegurada.
                                </p>
                                <ReservationForm variant="gradient" onSuccess={handleSuccess} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dress Code & Rules */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">
                            Políticas Social Club
                        </h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Dress Code */}
                            <div className="bg-gray-50 rounded-2xl p-8">
                                <div className="text-4xl mb-4">ℹ️</div>
                                <h4 className="text-2xl font-bold mb-4 text-gray-800">
                                    Políticas Social Club
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Edad mínima: 18 años</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Documento: Cédula o pasaporte obligatorio</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Reservas: Se toman hasta las 4:00pm si es para el mismo día</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Parqueadero: al lado de Social Club</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Reserva sin abono no queda confirmada</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">La ubicación de la reserva es sujeta a disponibilidad</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rules */}
                            <div className="bg-gray-50 rounded-2xl p-8">
                                <div className="text-4xl mb-4">ℹ️</div>
                                <h4 className="text-2xl font-bold mb-4 text-gray-800">
                                    Políticas Ritmo Vivo
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Los menores de edad solo pueden estar hasta las 9:30pm</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Reservas: Se toman hasta las 4:00pm si es para el mismo día</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">No contamos con Parqueadero</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Reserva sin abono no queda confirmada</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">La ubicación de la reserva es sujeta a disponibilidad</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-linear-to-r from-orange-500 to-red-500 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-4xl md:text-5xl font-bold mb-10">
                        Aquí la rumba está asegurada.
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <ReservationForm variant="white" onSuccess={handleSuccess} />
                        <a
                            href="eventos"
                            className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition"
                        >
                            📅 Ver Próximos Eventos
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};
