import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    className = "",
    ...props
}) => (
    <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {label}
        </label>
        <input
            className={`border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm ${className}`}
            {...props}
        />
    </div>
);
