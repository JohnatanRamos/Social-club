import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const InputField: React.FC<InputFieldProps & { error?: string }> = ({
    label,
    className = "",
    error,
    ...props
}) => (
    <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {label}
        </label>
        <input
            className={`border rounded-lg px-4 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm ${error ? 'border-red-300 bg-red-50' : 'border-slate-200'
                } ${className}`}
            {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
);
