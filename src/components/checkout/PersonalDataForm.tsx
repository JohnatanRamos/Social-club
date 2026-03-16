import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { InputField } from '../UI/InputField';
import type { User } from '../../types/Checkout';

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

interface PersonalDataFormProps {
    user: User;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    errors?: Partial<Record<keyof User, string>>;
}

export const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ user, onChange, errors }) => {
    return (
        <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200">
            <div className="flex items-start space-x-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                    <UserIcon size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Tus Datos Personales</h2>
                    <p className="text-sm text-slate-500">Información del responsable de la inscripción (se llena una única vez).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Nombre Completo"
                    name="fullName"
                    value={user.fullName}
                    onChange={onChange}
                    placeholder="Ej: Pepito Pérez"
                    error={errors?.fullName}
                />
                <InputField
                    label="Cédula / ID"
                    name="cedula"
                    value={user.cedula}
                    onChange={onChange}
                    placeholder="Ej: 1032..."
                    error={errors?.cedula}
                />
                <InputField
                    label="Correo Electrónico"
                    name="email"
                    value={user.email}
                    onChange={onChange}
                    type="email"
                    placeholder="correo@ejemplo.com"
                    error={errors?.email}
                />

                <InputField
                    label="Fecha de Nacimiento"
                    name="dob"
                    value={user.dob}
                    onChange={onChange}
                    type="date"
                    error={errors?.dob}
                />

                {/* WhatsApp with indicative */}
                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        WhatsApp
                    </label>
                    <div className="flex gap-2">
                        <select
                            name="indicative"
                            value={user.indicative}
                            onChange={onChange}
                            className="border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm shrink-0"
                        >
                            {COUNTRY_CODES.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                        <input
                            name="whatsapp"
                            value={user.whatsapp}
                            onChange={onChange}
                            placeholder="Ej: 3003212345"
                            className={`flex-1 border rounded-lg px-4 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm ${errors?.whatsapp ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        />
                    </div>
                    {errors?.whatsapp && <span className="text-xs text-red-500">{errors.whatsapp}</span>}
                </div>
            </div>
        </section>
    );
};
