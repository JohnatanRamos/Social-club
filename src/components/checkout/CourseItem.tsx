import React from 'react';
import { User, Users, Copy } from 'lucide-react';
import { InputField } from '../UI/InputField';
import type { CartCourseItem, CourseMode, Partner } from '../../types/Checkout';

interface CourseItemProps {
    item: CartCourseItem;
    index: number;
    mainUserName: string;
    onToggleMode: (index: number, mode: CourseMode) => void;
    onPartnerChange: (index: number, field: keyof Partner, value: string) => void;
    onAutofillPartner: (index: number) => void;
    showAutofill: boolean;
    errors?: Partial<Record<keyof Partner, string>>;
}

export const CourseItem: React.FC<CourseItemProps> = ({
    item,
    index,
    mainUserName,
    onToggleMode,
    onPartnerChange,
    onAutofillPartner,
    showAutofill,
    errors
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
            {/* Header del Curso */}
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                    <div className="flex items-center text-sm text-slate-500 space-x-3 mt-1">
                        <span>{item.duration}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{item.instructor}</span>
                    </div>
                </div>

                {/* Switch Individual / Pareja */}
                <div className="flex bg-slate-200 p-1 rounded-lg">
                    <button
                        onClick={() => onToggleMode(index, 'individual')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${item.mode === 'individual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Individual
                    </button>
                    <button
                        onClick={() => onToggleMode(index, 'pareja')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${item.mode === 'pareja' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        En Pareja
                    </button>
                </div>
            </div>

            {/* Body del Curso */}
            <div className="p-6">
                {item.mode === 'individual' ? (
                    <div className="flex items-center text-slate-500 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
                        <User className="w-5 h-5 mr-3 text-slate-400" />
                        <span className="text-sm">Inscripción individual para <strong>{mainUserName || 'ti'}</strong>.</span>
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wide flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Datos de la Pareja
                            </h4>

                            {/* Botón Mágico de Autofill */}
                            {showAutofill && (
                                <button
                                    onClick={() => onAutofillPartner(index)}
                                    type="button"
                                    className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Copy size={14} className="mr-1.5" />
                                    Copiar de pareja anterior
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                            <InputField
                                label="Nombre Pareja"
                                name="fullName"
                                value={item.partner.fullName}
                                onChange={(e) => onPartnerChange(index, 'fullName', e.target.value)}
                                placeholder="Nombre completo"
                                error={errors?.fullName}
                            />
                            <InputField
                                label="Cédula Pareja"
                                name="cedula"
                                value={item.partner.cedula}
                                onChange={(e) => onPartnerChange(index, 'cedula', e.target.value)}
                                error={errors?.cedula}
                            />
                            <InputField
                                label="WhatsApp Pareja"
                                name="whatsapp"
                                value={item.partner.whatsapp}
                                onChange={(e) => onPartnerChange(index, 'whatsapp', e.target.value)}
                                error={errors?.whatsapp}
                            />
                            <InputField
                                label="Email Pareja"
                                name="email"
                                value={item.partner.email}
                                onChange={(e) => onPartnerChange(index, 'email', e.target.value)}
                                type="email"
                                error={errors?.email}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
