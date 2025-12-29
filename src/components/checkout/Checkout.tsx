import { useState } from 'react';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { useCheckout } from '../../hooks/useCheckout';
import { PersonalDataForm } from './PersonalDataForm';
import { CourseItem } from './CourseItem';
import { OrderSummary } from './OrderSummary';
import { RelatedCoursesCarousel } from './RelatedCoursesCarousel';
import { DiscountUpsellModal } from './DiscountUpsellModal';

export default function Checkout() {
  const {
    mainUser,
    cart,
    handleMainUserChange,
    toggleCourseMode,
    handlePartnerChange,
    autofillPartner,
    removeCourse,
    subtotal,
    bundleDiscount,
    promptPaymentDiscount,
    total,
    isPromptPayment,
    togglePromptPayment,
    isValid,
    userErrors,
    partnerErrors
  } = useCheckout();

  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendBookingData = async () => {
    const payload = {
      bookingInfo: {
        fullName: mainUser.fullName,
        identificationNumber: mainUser.cedula,
        email: mainUser.email,
        phone: mainUser.whatsapp,
        birthDate: mainUser.dob
      },
      items: cart.map(item => ({
        classId: item.id,
        persons: item.mode === 'pareja' ? 2 : 1,
        companions: item.mode === 'pareja' ? [{
          fullName: item.partner.fullName,
          identificationNumber: item.partner.cedula,
          phone: item.partner.whatsapp,
          email: item.partner.email
        }] : []
      })),
      isCashPayment: !isPromptPayment,
      location: cart[0].location,
      amount: Math.round(total * 100)
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
        amountInCents: Math.round(total * 100),
        reference: reference,
        publicKey: PUBLIC_KEY,
        signature: { integrity: signature },
        redirectUrl: 'https://socialclubritmovivo.com/success', // Opcional
        customerData: { // Opcional
          email: mainUser.email,
          fullName: mainUser.fullName,
          phoneNumber: mainUser.whatsapp,
          phoneNumberPrefix: '+57',
          legalId: mainUser.cedula,
          legalIdType: 'CC'
        },
      });

      // Open the widget
      checkout.open(function (result: any) {
        const transaction = result.transaction;

        // You can handle the result here without redirecting if you prefer,
        // but typically for a successful payment you might want to show the success page.
        if (transaction.status === 'APPROVED' || transaction.status === 'PENDING') {
          window.location.href = '/success';
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

  const handleFinalizeEnrollment = async () => {
    setIsSubmitting(true);
    if (cart.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }
    try {
      const bookingData = await sendBookingData();

      if (isPromptPayment) {
        await handleWompiWidget(bookingData.reservationId, bookingData.payment.publicKey, bookingData.payment.signature);
      } else {
        // If not paying immediately (not prompt payment), redirect to success page
        window.location.href = '/success';
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: 'top-right',
      });
    } finally {
      // If we are redirecting or opening Wompi, we might want to keep loading state
      // But if Wompi opens, it's a modal, so we can stop loading or keep it.
      // If prompt payment, Wompi opens. If user cancels Wompi, we should probably stop loading.
      // Since handleWompiWidget is async and returns after opening, we can stop loading here.
      setIsSubmitting(false);
    }
  };

  const handleCheckoutClick = () => {
    const individualCourses = cart.filter(item => item.mode === 'individual');
    // Show upsell if they haven't reached the max bundle discount (3 courses)
    if (individualCourses.length < 3) {
      setIsUpsellModalOpen(true);
    } else {
      handleFinalizeEnrollment();
    }
  };

  const handleContinueToPayment = () => {
    handleFinalizeEnrollment();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* --- COLUMNA DERECHA: FORMULARIOS --- */}
          <div className="w-full lg:w-2/3 order-1 lg:order-1 space-y-8">

            {/* 1. Datos del Responsable */}
            <PersonalDataForm
              user={mainUser}
              onChange={handleMainUserChange}
              errors={userErrors}
            />

            {/* 2. Detalles de los Cursos */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Configuración de Cursos</h2>
                  <p className="text-sm text-slate-500">Define si asistirás solo o acompañado a cada clase.</p>
                </div>
              </div>

              {cart.map((item, index) => (
                <CourseItem
                  key={item.uniqueId}
                  item={item}
                  index={index}
                  mainUserName={mainUser.fullName}
                  onToggleMode={toggleCourseMode}
                  onPartnerChange={handlePartnerChange}
                  onAutofillPartner={autofillPartner}
                  showAutofill={cart.filter(c => c.mode === 'pareja').length > 1}
                  errors={partnerErrors[index]}
                />
              ))}

              {cart.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">Tu carrito está vacío</h3>
                  <p className="text-slate-500">Selecciona cursos del horario para comenzar.</p>
                </div>
              )}
            </section>

            <RelatedCoursesCarousel cart={cart} />
          </div>

          {/* --- COLUMNA IZQUIERDA: RESUMEN DE COMPRA (Sticky) --- */}
          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            total={total}
            bundleDiscount={bundleDiscount}
            promptPaymentDiscount={promptPaymentDiscount}
            isPromptPayment={isPromptPayment}
            onTogglePromptPayment={togglePromptPayment}
            onRemoveCourse={removeCourse}
            onCheckout={handleCheckoutClick}
            isValid={isValid}
            isLoading={isSubmitting}
          />

        </div>
      </section>

      <DiscountUpsellModal
        isOpen={isUpsellModalOpen}
        onClose={() => setIsUpsellModalOpen(false)}
        onContinue={handleContinueToPayment}
        cart={cart}
      />
    </div>
  );
}