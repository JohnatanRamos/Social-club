import React, { useEffect } from 'react';
import { CheckCircle, Home, Calendar, XCircle, Clock, MessageCircle } from 'lucide-react';


interface ReservationSuccessProps {
    orderId?: string | null;
    txStatus?: string | null;
}

export const ReservationSuccess: React.FC<ReservationSuccessProps> = ({ orderId: initialOrderId, txStatus: initialTxStatus }) => {

    const [orderId, setOrderId] = React.useState<string | null>(initialOrderId || null);
    const [txStatus, setTxStatus] = React.useState<string | null>(initialTxStatus || null);

    useEffect(() => {
        // Listen for URL parameters from the client-side script
        const handleUrlParams = (event: CustomEvent) => {
            setOrderId(event.detail.orderId);
            setTxStatus(event.detail.txStatus);
        };

        window.addEventListener('urlParamsReady', handleUrlParams as EventListener);

        // Also try to get params directly from URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlOrderId = urlParams.get('bold-order-id');
        const urlTxStatus = urlParams.get('bold-tx-status');

        if (urlOrderId || urlTxStatus) {
            setOrderId(urlOrderId);
            setTxStatus(urlTxStatus);
        }

        return () => {
            window.removeEventListener('urlParamsReady', handleUrlParams as EventListener);
        };
    }, []);

    // Determine status - default to 'approved' if no txStatus is provided
    const status = txStatus?.toLowerCase() || 'approved';

    // Status configurations
    const statusConfig = {
        approved: {
            icon: CheckCircle,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            title: '¡Reserva Confirmada!',
            message: 'Hemos recibido tu solicitud de reserva correctamente. Te esperamos para disfrutar de una gran experiencia.',
            steps: [
                'Te recomendamos llegar 15 minutos antes de tu reserva.',
                '¡Prepárate para vivir el mejor ambiente!'
            ]
        },
        rejected: {
            icon: XCircle,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            title: 'Pago Rechazado',
            message: 'Lo sentimos, tu pago no pudo ser procesado. Por favor, verifica tus datos e intenta nuevamente.',
            steps: [
                'Verifica que los datos de tu tarjeta sean correctos.',
                'Asegúrate de tener fondos suficientes.',
                'Intenta con otro método de pago si el problema persiste.'
            ]
        },
        pending: {
            icon: Clock,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            title: 'Pago Pendiente',
            message: 'Tu pago está siendo procesado. Te notificaremos por correo cuando se confirme.',
            steps: [
                'Recibirás un correo de confirmación una vez procesado el pago.',
                'El proceso puede tomar algunos minutos.',
                'Si tienes dudas, contáctanos con tu número de orden.'
            ]
        }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.approved;
    const Icon = config.icon;

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center space-y-6 border border-slate-100">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className={`w-12 h-12 ${config.iconColor}`} />
                </div>

                <h1 className="text-3xl font-bold text-slate-900">
                    {config.title}
                </h1>

                <p className="text-slate-600 text-lg">
                    {config.message}
                </p>

                {status === 'approved' && (
                    <div className="bg-blue-50 border border-blue-500 p-3 rounded-xl text-left shadow-sm mb-4 mt-2">
                        <div className="flex items-center gap-3">
                            <div className="shrink-0 bg-blue-500 rounded-full p-2">
                                <MessageCircle className="h-5 w-5 text-white animate-pulse" />
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-blue-900">¡IMPORTANTE! Revisa tu WhatsApp: </span>
                                <span className="text-blue-800">
                                    Te debe llegar un mensaje de confirmación. Si no lo recibes en 10 min, comunícate al <span className="font-bold whitespace-nowrap">300 985 3900</span>.
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-slate-50 rounded-xl p-6 text-left space-y-3">
                    <h3 className="font-semibold text-slate-900 mb-2">
                        {status === 'rejected' ? 'Qué puedes hacer:' : 'Próximos pasos:'}
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        {config.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                                {step}
                            </li>
                        ))}
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
