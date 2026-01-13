import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

export const ReservationForm: React.FC<{ variant?: 'white' | 'gradient' }> = ({ variant = 'white' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        sede: '',
        fecha: '',
        hora: '',
        numPersonas: '',
        celular: '',
        tipoCelebracion: 'Ninguna',
        nombreFestejado: '',
    });

    const buttonClass = variant === 'white'
        ? "inline-block bg-white text-sc-orange px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl cursor-pointer"
        : "inline-block gradient-bg text-white px-12 py-4 rounded-full font-bold text-xl hover:shadow-lg transition pulse-glow cursor-pointer";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Format message for WhatsApp
        const message = `*Nueva Reserva*%0A` +
            `*Nombre:* ${formData.nombreCompleto}%0A` +
            `*Sede:* ${formData.sede}%0A` +
            `*Fecha:* ${formData.fecha}%0A` +
            `*Hora:* ${formData.hora}%0A` +
            `*Personas:* ${formData.numPersonas}%0A` +
            `*Celular:* ${formData.celular}%0A` +
            `*Celebración:* ${formData.tipoCelebracion}%0A` +
            (formData.nombreFestejado ? `*Festejado:* ${formData.nombreFestejado}` : '');

        window.open(`https://wa.me/573009853900?text=${message}`, '_blank');
        setIsOpen(false);
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
        if (isOpen && dateInputRef.current) {
            const fp = flatpickr(dateInputRef.current, {
                locale: Spanish,
                dateFormat: 'Y-m-d',
                minDate: 'today',
                disable: [
                    (date) => {
                        // Disable Sundays (0) if location is Ritmo Vivo
                        return formData.sede === 'Ritmo Vivo' && date.getDay() === 0;
                    }
                ],
                onChange: (selectedDates, dateStr) => {
                    setFormData(prev => ({ ...prev, fecha: dateStr }));
                },
            });

            // If the current selected date is a Sunday and the sede is Ritmo Vivo, clear it
            if (formData.fecha && formData.sede === 'Ritmo Vivo') {
                const [year, month, day] = formData.fecha.split('-').map(Number);
                const selectedDate = new Date(year, month - 1, day);
                if (selectedDate.getDay() === 0) {
                    setFormData(prev => ({ ...prev, fecha: '' }));
                    dateInputRef.current.value = '';
                }
            }

            return () => {
                fp.destroy();
            };
        }
    }, [isOpen, formData.sede]);

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

                        {/* Form */}
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
                                    <option value="Social Club">Social Club (Envigado)</option>
                                    <option value="Ritmo Vivo">Ritmo Vivo (Medellín)</option>
                                </select>
                            </div>

                            <input
                                name="nombreCompleto"
                                required
                                value={formData.nombreCompleto}
                                onChange={handleChange}
                                placeholder="Ej. Juan Pérez"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    ref={dateInputRef}
                                    name="fecha"
                                    type="text"
                                    required
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    placeholder="Selecciona una fecha"
                                />
                                <input
                                    name="hora"
                                    type="time"
                                    required
                                    value={formData.hora}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="numPersonas"
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.numPersonas}
                                    onChange={handleChange}
                                    placeholder="Ej. 4"
                                />
                                <input
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
                                >
                                    <option value="Ninguna">Ninguna</option>
                                    <option value="Cumpleaños">Cumpleaños</option>
                                    <option value="Cena">Cena</option>
                                    <option value="Reunión">Reunión</option>
                                    <option value="Grado">Grado</option>
                                    <option value="Despedida">Despedida</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            {formData.tipoCelebracion !== 'Ninguna' && (
                                <input
                                    name="nombreFestejado"
                                    value={formData.nombreFestejado}
                                    onChange={handleChange}
                                    placeholder="¿A quién celebramos?"
                                    className="animate-in slide-in-from-top-2 duration-200"
                                />
                            )}

                            <div className="pt-4 text-center">
                                <button
                                    type="submit"
                                    className="w-full bg-sc-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <span>Pagar</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        </form>
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
