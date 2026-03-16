import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { InputField } from '../UI/InputField';
import { parse, sameDay, addHour, addMonth } from '@formkit/tempo';
import { toast } from 'sonner';

const DEFAULT_PRICE = 30000;

const COUNTRY_CODES = [
    { label: '🇨🇴 +57', value: '+57' },
    { label: '🇺🇸 +1', value: '+1' },
    { label: '🇲🇽 +52', value: '+52' },
    { label: '🇦🇷 +54', value: '+54' },
    { label: '🇨🇱 +56', value: '+56' },
    { label: '🇪🇨 +593', value: '+593' },
    { label: '🇵🇪 +51', value: '+51' },
    { label: '🇻🇪 +58', value: '+58' },
    { label: '🇧🇷 +55', value: '+55' },
    { label: '🇪🇸 +34', value: '+34' },
];

export const ReservationForm: React.FC<{ variant?: 'white' | 'gradient'; onSuccess?: () => void }> = ({ variant = 'white', onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        sede: '',
        fecha: '',
        hora: '',
        numPersonas: 0,
        indicative: '+57',
        celular: '',
        tipoCelebracion: 'Ninguna',
        nombreFestejado: '',
        documento: '',
        email: '',
    });
    const [celebrationTypes, setCelebrationTypes] = useState<Array<{ name: string; value: string }>>([]);
    const [sedes, setSedes] = useState<Array<{ id: string; name: string; price: number }>>([]);
    const [holidays, setHolidays] = useState<string[]>([]);
    const [maxMonths, setMaxMonths] = useState<number>(3);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedPolicies, setAcceptedPolicies] = useState(false);

    const buttonClass = variant === 'white'
        ? "inline-block bg-white text-sc-orange px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl cursor-pointer"
        : "inline-block gradient-bg text-white px-12 py-4 rounded-full font-bold text-xl hover:shadow-lg transition pulse-glow cursor-pointer";

    const calculateTotalAmount = () => {
        const selectedSede = sedes.find(s => s.id === formData.sede);
        const pricePerPerson = selectedSede?.price || DEFAULT_PRICE;
        return Math.round(Number(formData.numPersonas) * pricePerPerson);
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
            const { boldData: bookingData } = await sendData();

            await handleBoldWidget(bookingData.reference, bookingData.identityKey, bookingData.signature);

        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message, {
                position: 'top-right',
            });
        }
    };

    const handleBoldWidget = async (reference: string, PUBLIC_KEY: string, signature: string) => {
        try {
            // Check if the Bold script is loaded
            // @ts-ignore
            if (typeof window.BoldCheckout === 'undefined') {
                toast.error("Error: El sistema de pagos no se cargó correctamente. Por favor recarga la página.", {
                    position: 'top-right',
                });
                return;
            }

            const customerData = { // Opcional
                email: formData.email,
                fullName: formData.nombreCompleto,
                phone: formData.celular,
                dialCode: formData.indicative,
                documentNumber: formData.documento,
                documentType: 'CC'
            };

            // Configure the checkout
            // @ts-ignore
            const checkout = new window.BoldCheckout({
                currency: 'COP',
                amount: calculateTotalAmount(),
                orderId: reference,
                apiKey: PUBLIC_KEY,
                integritySignature: signature,
                description: 'Reserva',
                customerData: JSON.stringify(customerData),
                redirectionUrl: import.meta.env.PUBLIC_DOMAIN + '/success-reservation'
            });

            // Open the widget
            checkout.open()

        } catch (error) {
            console.error("Error initializing Wompi widget:", error);
            toast.error("Hubo un error iniciando el pago. Por favor intenta nuevamente.", {
                position: 'top-right',
            });
        }
    };

    const sendData = async () => {
        const selectedSede = sedes.find(s => s.id === formData.sede);

        // Find celebration type object
        const selectedCelebration = celebrationTypes.find(c => c.value === formData.tipoCelebracion);

        const payload = {
            personName: formData.nombreCompleto,
            personIdentification: formData.documento,
            personEmail: formData.email,
            personPhone: `${formData.indicative}${formData.celular}`,
            additionalPerson: formData.nombreFestejado ? {
                name: formData.nombreFestejado,
            } : null,
            amount: calculateTotalAmount(),
            eventDate: formData.fecha,
            eventTime: formData.hora,
            branchName: selectedSede?.name || "",
            venueId: formData.sede,
            celebrationType: selectedCelebration ? {
                value: selectedCelebration.value,
                name: selectedCelebration.name
            } : null,
            numberOfPersons: Number(formData.numPersonas)
        };

        try {
            const API_URL = import.meta.env.PUBLIC_API + "event-reservations";
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 400 || response.status === 409) {
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
        const [selectedHour, selectedMinute] = formData.hora.split(':').map(Number);
        const selectedTotalMinutes = selectedHour * 60 + selectedMinute;
        const selectedSedeName = sedes.find(s => s.id === formData.sede)?.name;

        // Validate time range based on sede
        if (selectedSedeName === 'Social Club') {
            if (selectedTotalMinutes < 17 * 60 || selectedTotalMinutes > 21 * 60) {
                toast.error("Para Social Club, el horario de reservas es entre las 5:00pm y las 9:00pm.", { position: 'top-right' });
                return false;
            }
        } else if (selectedSedeName === 'Ritmo Vivo') {
            if (selectedTotalMinutes < 8 * 60 || selectedTotalMinutes > 21 * 60) {
                toast.error("Para Ritmo Vivo, el horario de reservas es entre las 8:00am y las 9:00pm.", { position: 'top-right' });
                return false;
            }
        }

        if (sameDay(selectedDate, now)) {
            // Block same-day reservations if the current time is already at or past 2pm (14:00)
            if (now.getHours() >= 16) {
                toast.error("Solo puedes hacer reservas hasta las 4pm, para el día de hoy.", { position: 'top-right' });
                return false;
            }

            const oneHourLater = addHour(now, 2);
            if (selectedDate < oneHourLater) {
                toast.error("Ten presente que solo se puede reservar con 2 horas de anticipación.", { position: 'top-right' });
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
                const [basicsResponse, holidaysResponse] = await Promise.all([
                    fetch(import.meta.env.PUBLIC_API + "basics"),
                    fetch(import.meta.env.PUBLIC_API + "holidays/upcoming")
                ]);

                const data = await basicsResponse.json();
                const holidaysData = await holidaysResponse.json();

                // Process Holidays
                if (Array.isArray(holidaysData)) {
                    setHolidays(holidaysData.map((h: any) => h.date.split('T')[0]));
                }

                // Process Prices (Code 1)
                const pricesData = data[0].items || [];

                // Process Celebration Types (Code 2)
                const celebrationData = data[1].items || [];
                if (celebrationData.length > 0) {
                    setCelebrationTypes(celebrationData.map((i: any) => ({ name: i.name, value: i.value })));
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
                        price: priceItem ? parseInt(priceItem.value) : DEFAULT_PRICE
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
                    ...holidays,
                    (date) => {
                        // Disable Sundays (0) if location is Social Club
                        const selectedSedeName = sedes.find(s => s.id === formData.sede)?.name;

                        if (selectedSedeName === 'Social Club') {
                            return date.getDay() === 0 || date.getDay() === 1 || date.getDay() === 2 || date.getDay() === 3;
                        }

                        return date.getDay() === 0;
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
    }, [isOpen, isFetchingData, formData.sede, maxMonths, sedes, holidays]);

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
                                            disabled={!formData.sede}
                                            value={formData.fecha}
                                            onChange={handleChange}
                                            placeholder={!formData.sede ? "Primero selecciona una sede" : "Selecciona una fecha"}
                                            className="border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm w-full disabled:opacity-60 disabled:cursor-not-allowed"
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
                                            max="21:00"
                                            min="08:00"
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
                                        label="N° Documento"
                                        name="documento"
                                        required
                                        value={formData.documento}
                                        onChange={handleChange}
                                        placeholder="Ej. 1234567890"
                                    />

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
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* Celular with indicative */}
                                    <div className="flex flex-col space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Celular
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                name="indicative"
                                                value={formData.indicative}
                                                onChange={handleChange}
                                                className="border border-slate-200 rounded-lg px-2 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm shrink-0"
                                            >
                                                {COUNTRY_CODES.map(c => (
                                                    <option key={c.value} value={c.value}>{c.label}</option>
                                                ))}
                                            </select>
                                            <input
                                                name="celular"
                                                type="tel"
                                                required
                                                value={formData.celular}
                                                onChange={handleChange}
                                                placeholder="300 123 4567"
                                                className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                            />
                                        </div>
                                    </div>
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
                                            <option key={type.value} value={type.value}>{type.name}</option>
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

                                {/* Accept policies checkbox */}
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        id="acceptedPolicies"
                                        type="checkbox"
                                        checked={acceptedPolicies}
                                        onChange={(e) => setAcceptedPolicies(e.target.checked)}
                                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-orange-500 cursor-pointer shrink-0"
                                    />
                                    <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">
                                        He leído y acepto los{' '}
                                        <a
                                            href="/terminos-y-condiciones"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sc-orange underline font-semibold hover:text-orange-600"
                                        >
                                            Términos y Condiciones
                                        </a>
                                        {' '}de Social Club y Ritmo Vivo.
                                    </span>
                                </label>

                                <div className="pt-2 text-center">
                                    <button
                                        disabled={isLoading || !acceptedPolicies}
                                        type="submit"
                                        className="cursor-pointer w-full bg-sc-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sc-orange"
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
