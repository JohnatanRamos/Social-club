import { useState, useEffect } from 'react';
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
    total,
    isElectronicInvoice,
    toggleElectronicInvoice,
    isValid,
    userErrors,
    partnerErrors
  } = useCheckout();

  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const sendBookingData = async () => {
    // --- Discount calculations ---
    // Bundle: 15% for 3+ individual courses, 5% for 2 individual courses
    const individualItems = cart.filter(item => item.mode === 'individual');
    const bundleRate = individualItems.length >= 3 ? 0.15
      : individualItems.length === 2 ? 0.05
        : 0;

    const payload = {
      bookingInfo: {
        fullName: mainUser.fullName,
        identificationNumber: mainUser.cedula,
        email: mainUser.email,
        phone: `${mainUser.indicative}${mainUser.whatsapp}`,
        birthDate: mainUser.dob
      },
      items: cart.map(item => {
        const itemDiscounts = [];
        // Apply bundle discount only to individual-mode courses
        if (item.mode === 'individual' && bundleRate > 0) {
          itemDiscounts.push({
            description: 'Bono por compra de cursos',
            percentage: Math.round(bundleRate * 100),
            value: Math.round(item.price * bundleRate),
          });
        }
        return {
          classId: item.id,
          persons: item.mode === 'pareja' ? 2 : 1,
          companions: item.mode === 'pareja' ? [{
            fullName: item.partner.fullName,
            identificationNumber: item.partner.cedula,
            phone: item.partner.whatsapp,
            email: item.partner.email
          }] : [],
          discounts: itemDiscounts,
          fullValue: Math.round(item.price),
          value: Math.round(item.price - (itemDiscounts[0]?.value || 0)),
        };
      }),
      isCashPayment: false,
      hasElectronicInvoice: isElectronicInvoice,
      subtotal: Math.round(subtotal),
      location: cart[0].location,
      amount: Math.round(total),
      // Invoice-level discounts (prompt-payment applied after bundle)
      discounts: [],
    };

    try {
      const API_URL = import.meta.env.PUBLIC_API + 'reservations';
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

  const handleBoldWidget = async (reference?: string, PUBLIC_KEY?: string, signature?: string) => {
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
        email: mainUser.email,
        fullName: mainUser.fullName,
        phone: mainUser.whatsapp,
        dialCode: mainUser.indicative,
        documentNumber: mainUser.cedula,
        documentType: 'CC'
      };

      // @ts-ignore
      const checkout = new window.BoldCheckout({
        currency: 'COP',
        amount: Math.round(total),
        orderId: reference,
        apiKey: PUBLIC_KEY,
        integritySignature: signature,
        description: 'Curso(s)',
        customerData: JSON.stringify(customerData),
        redirectionUrl: import.meta.env.PUBLIC_DOMAIN + '/success'
      });

      checkout.open();

    } catch (error) {
      console.error("Error initializing Bold widget:", error);
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
      const { payment: bookingData } = await sendBookingData();

      await handleBoldWidget(bookingData.reference, bookingData.identityKey, bookingData.signature);

    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(error.message, {
        position: 'top-right',
      });
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
          {!hasMounted ? (
            <div className="w-full py-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sc-orange"></div>
            </div>
          ) : (
            <>
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
                isElectronicInvoice={isElectronicInvoice}
                onToggleElectronicInvoice={toggleElectronicInvoice}
                onRemoveCourse={removeCourse}
                onCheckout={handleCheckoutClick}
                isValid={isValid}
                isLoading={isSubmitting}
              />
            </>
          )}
        </div>
      </section>

      <DiscountUpsellModal
        isOpen={isUpsellModalOpen}
        onClose={() => setIsUpsellModalOpen(false)}
        onContinue={handleContinueToPayment}
        cart={cart}
        isLoading={isSubmitting}
      />
    </div>
  );
}