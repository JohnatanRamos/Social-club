import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { InputField } from '../UI/InputField';
import { parse, sameDay, addHour, addMonth } from '@formkit/tempo';
import { toast } from 'sonner';

export const ReservationForm: React.FC<{ variant?: 'white' | 'gradient' }> = ({ variant = 'white' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        sede: '',
        fecha: '',
        hora: '',
        numPersonas: 0,
        celular: '',
        tipoCelebracion: 'Ninguna',
        nombreFestejado: '',
        documento: '',
        email: '',
    });
    const [celebrationTypes, setCelebrationTypes] = useState<string[]>([]);
    const [sedes, setSedes] = useState<Array<{ id: string; name: string; price: number }>>([]);
    const [maxMonths, setMaxMonths] = useState<number>(3);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const buttonClass = variant === 'white'
        ? "inline-block bg-white text-sc-orange px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl cursor-pointer"
        : "inline-block gradient-bg text-white px-12 py-4 rounded-full font-bold text-xl hover:shadow-lg transition pulse-glow cursor-pointer";

    const calculateTotalAmount = () => {
        const selectedSede = sedes.find(s => s.id === formData.sede);
        const pricePerPerson = selectedSede?.price || 25000;
        return Math.round(formData.numPersonas * pricePerPerson);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'sede') {
            setFormData(prev => ({ ...prev, [name]: value, fecha: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleFinalizeReservation = async () => {
        setIsLoading(true);
        try {
            const bookingData = await sendData();

            await handleWompiWidget(bookingData.reservationId, bookingData.payment.publicKey, bookingData.payment.signature);

        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message, {
                position: 'top-right',
            });
        }
    };

    const handleWompiWidget = async (reference: string, PUBLIC_KEY: string, signature: string) => {
        try {
            // Check if the Wompi script is loaded
            // @ts-ignore
            if (typeof window.WidgetCheckout === 'undefined') {
                toast.error("Error: El sistema de pagos no se cargó correctamente. Por favor recarga la página.", {
                    position: 'top-right',
                });
                return;
            }

            // Configure the checkout
            // @ts-ignore
            const checkout = new window.WidgetCheckout({
                currency: 'COP',
                amountInCents: calculateTotalAmount(),
                reference: reference,
                publicKey: PUBLIC_KEY,
                signature: { integrity: signature },
                redirectUrl: 'https://socialclubritmovivo.com/success', // Opcional
                customerData: { // Opcional
                    email: formData.email,
                    fullName: formData.nombreCompleto,
                    phoneNumber: formData.celular,
                    phoneNumberPrefix: '+57',
                    legalId: formData.documento,
                    legalIdType: 'CC'
                },
            });

            // Open the widget
            checkout.open(function (result: any) {
                const transaction = result.transaction;

                // You can handle the result here without redirecting if you prefer,
                // but typically for a successful payment you might want to show the success page.
                if (transaction.status === 'APPROVED' || transaction.status === 'PENDING') {
                    window.location.href = '/success-reservation';
                } else if (transaction.status === 'DECLINED' || transaction.status === 'ERROR' || transaction.status === 'VOIDED') {
                    toast.error(`La transacción fue rechazada o falló. Estado: ${transaction.status}`, {
                        position: 'top-right',
                    });
                }
            });

        } catch (error) {
            console.error("Error initializing Wompi widget:", error);
            toast.error("Hubo un error iniciando el pago. Por favor intenta nuevamente.", {
                position: 'top-right',
            });
        }
    };

    const sendData = async () => {
        const payload = {
            bookingInfo: {
                fullName: formData.nombreCompleto,
                identificationNumber: formData.documento,
                email: formData.email,
                phone: formData.celular,
            },
            location: formData.sede,
            amount: calculateTotalAmount()
        };

        try {
            const API_URL = "https://api.ritmovivosocialclub.com/reservations";
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            if (!response.ok) {
                throw new Error('Error creating booking');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    const validateReservationTime = () => {
        if (!formData.fecha || !formData.hora) return true;

        const now = new Date();
        const selectedDate = parse(`${formData.fecha} ${formData.hora}`, "YYYY-MM-DD HH:mm");

        if (sameDay(selectedDate, now)) {
            const oneHourLater = addHour(now, 1);
            if (selectedDate < oneHourLater) {
                toast.error("Para reservas el día de hoy, la hora debe ser al menos 1 hora después de la hora actual.");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateReservationTime()) {
            return;
        }
        handleFinalizeReservation();
        // setIsOpen(false);
    };

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    useEffect(() => {
        const fetchBasics = async () => {
            setIsFetchingData(true);
            try {
                const response = await fetch("https://social-club-api-dev.onrender.com/basics");
                const data = await response.json();

                // Process Prices (Code 1)
                const pricesData = data[0].items || [];

                // Process Celebration Types (Code 2)
                const celebrationData = data[1].items || [];
                if (celebrationData.length > 0) {
                    setCelebrationTypes(celebrationData.map((i: any) => i.name));
                }

                // Process Max Months (Code 3)
                const monthsData = data[2].items || [];
                if (monthsData.length > 0) {
                    const months = parseInt(monthsData[0].value);
                    if (!isNaN(months)) setMaxMonths(months);
                }

                // Process Sedes (Code 4) and merge with prices
                const sedesData = data[3].items || [];
                const mergedSedes = sedesData.map((sede: any) => {
                    const normalizedSedeName = sede.name.toLowerCase().trim();
                    const priceItem = pricesData.find((p: any) => {
                        const normalizedPriceName = p.name.toLowerCase().replace('precio', '').trim();
                        return normalizedPriceName === normalizedSedeName;
                    });
                    return {
                        id: sede.value,
                        name: sede.name,
                        price: priceItem ? parseInt(priceItem.value) : 25000
                    };
                });
                setSedes(mergedSedes);

            } catch (error) {
                console.error("Error fetching basics:", error);
                toast.error("Error cargando la información del formulario");
            } finally {
                setIsFetchingData(false);
            }
        };

        if (isOpen) {
            fetchBasics();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && !isFetchingData && dateInputRef.current) {
            const fp = flatpickr(dateInputRef.current, {
                locale: Spanish,
                dateFormat: 'Y-m-d',
                minDate: 'today',
                maxDate: addMonth(new Date(), maxMonths),
                disable: [
                    (date) => {
                        // Disable Sundays (0) if location is Ritmo Vivo
                        const selectedSedeName = sedes.find(s => s.id === formData.sede)?.name;
                        return selectedSedeName === 'Ritmo Vivo' && date.getDay() === 0;
                    }
                ],
                onChange: (selectedDates, dateStr) => {
                    setFormData(prev => ({ ...prev, fecha: dateStr }));
                },
            });

            return () => {
                fp.destroy();
            };
        }
    }, [isOpen, isFetchingData, formData.sede, maxMonths, sedes]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={buttonClass}
            >
                🎉 Reservar Mesa Ahora
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 md:self-start lg:self-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-linear-to-r from-sc-orange to-red-500 p-6 text-white relative">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h3 className="text-2xl font-bold">Reserva tu mesa</h3>
                        </div>

                        {/* Loading State or Form */}
                        {isFetchingData ? (
                            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-sc-orange border-t-transparent"></div>
                                <p className="text-slate-500 font-medium animate-pulse">Cargando disponibilidad...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-8 space-y-4 min-h-[80vh] max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Sede
                                    </label>
                                    <select
                                        name="sede"
                                        required
                                        value={formData.sede}
                                        onChange={handleChange}
                                        className="border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                    >
                                        <option value="">Selecciona una sede</option>
                                        {sedes.map(sede => (
                                            <option key={sede.id} value={sede.id}>
                                                {sede.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <InputField
                                    label="Nombre completo"
                                    name="nombreCompleto"
                                    required
                                    value={formData.nombreCompleto}
                                    onChange={handleChange}
                                    placeholder="Ej. Juan Pérez"
                                />
                                <InputField
                                    label="N° Documento"
                                    name="documento"
                                    required
                                    value={formData.documento}
                                    onChange={handleChange}
                                    placeholder="Ej. 1234567890"
                                />
                                <InputField
                                    label="Correo electrónico"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Ej. juan@example.com"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Fecha
                                        </label>
                                        <input
                                            ref={dateInputRef}
                                            name="fecha"
                                            type="text"
                                            required
                                            value={formData.fecha}
                                            onChange={handleChange}
                                            placeholder="Selecciona una fecha"
                                            className="border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm w-full"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Hora
                                        </label>
                                        <input
                                            name="hora"
                                            type="time"
                                            required
                                            value={formData.hora}
                                            onChange={handleChange}
                                            onClick={(e) => {
                                                try {
                                                    e.currentTarget.showPicker();
                                                } catch (err) {
                                                    console.log("Picker not supported", err);
                                                }
                                            }}
                                            className="border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm w-full cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="N° Personas"
                                        name="numPersonas"
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.numPersonas}
                                        onChange={handleChange}
                                        placeholder="Ej. 4"
                                    />
                                    <InputField
                                        label="Celular"
                                        name="celular"
                                        type="tel"
                                        required
                                        value={formData.celular}
                                        onChange={handleChange}
                                        placeholder="Ej. 300 123 4567"
                                    />
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Tipo de celebración
                                    </label>
                                    <select
                                        name="tipoCelebracion"
                                        value={formData.tipoCelebracion}
                                        onChange={handleChange}
                                        className="border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                        disabled={isLoading}
                                    >
                                        <option value="Ninguna">Ninguna</option>
                                        {celebrationTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.tipoCelebracion !== 'Ninguna' && (
                                    <InputField
                                        label="Nombre del festejado"
                                        name="nombreFestejado"
                                        value={formData.nombreFestejado}
                                        onChange={handleChange}
                                        placeholder="¿A quién celebramos?"
                                        className="animate-in slide-in-from-top-2 duration-200"
                                    />
                                )}

                                <div className="pt-4 text-center">
                                    <button
                                        disabled={isLoading ? true : false}
                                        type="submit"
                                        className="cursor-pointer w-full bg-sc-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Procesando...</span>
                                            </>
                                        ) : (

                                            <>
                                                <span>Continuar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff6b00;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e65a00;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation-fill-mode: forwards;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in-95 {
          animation-name: zoom-in;
        }
        .duration-200 {
          animation-duration: 200ms;
        }
        
        /* Flatpickr Custom Theme */
        .flatpickr-calendar {
          background: #fff;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
          border-radius: 1rem;
        }
        .flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange, 
        .flatpickr-day.selected.prevMonthDay, .flatpickr-day.startRange.prevMonthDay, 
        .flatpickr-day.endRange.prevMonthDay, .flatpickr-day.selected.nextMonthDay, 
        .flatpickr-day.startRange.nextMonthDay, .flatpickr-day.endRange.nextMonthDay {
          background: #ff6b00;
          border-color: #ff6b00;
          color: white;
        }
        .flatpickr-day.selected:hover, .flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover, 
        .flatpickr-day.selected.prevMonthDay:hover, .flatpickr-day.startRange.prevMonthDay:hover, 
        .flatpickr-day.endRange.prevMonthDay:hover, .flatpickr-day.selected.nextMonthDay:hover, 
        .flatpickr-day.startRange.nextMonthDay:hover, .flatpickr-day.endRange.nextMonthDay:hover {
          background: #e65a00;
          border-color: #e65a00;
        }
        .flatpickr-day:hover {
          background: #fff7ed;
          border-color: #ffedd5;
        }
        .flatpickr-months .flatpickr-month {
          color: #1e293b;
          fill: #1e293b;
        }
        .flatpickr-current-month .flatpickr-monthDropdown-months:hover {
          background: #f8fafc;
        }
        .flatpickr-weekday {
          color: #94a3b8;
          font-weight: 600;
        }
      `}</style>
        </>
    );
};
