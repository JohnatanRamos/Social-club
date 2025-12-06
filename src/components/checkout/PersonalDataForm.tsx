import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { InputField } from '../UI/InputField';
import type { User } from '../../types/Checkout';

interface PersonalDataFormProps {
    user: User;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ user, onChange }) => {
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
                />
                <InputField
                    label="Cédula / ID"
                    name="cedula"
                    value={user.cedula}
                    onChange={onChange}
                    placeholder="Ej: 1032..."
                />
                <InputField
                    label="Correo Electrónico"
                    name="email"
                    value={user.email}
                    onChange={onChange}
                    type="email"
                    placeholder="correo@ejemplo.com"
                />
                <InputField
                    label="WhatsApp"
                    name="whatsapp"
                    value={user.whatsapp}
                    onChange={onChange}
                    placeholder="+57 300..."
                />
                <InputField
                    label="Fecha de Nacimiento"
                    name="dob"
                    value={user.dob}
                    onChange={onChange}
                    type="date"
                />
            </div>
        </section>
    );
};
