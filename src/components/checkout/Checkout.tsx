import { useState } from 'react';
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

  // Helper to generate the integrity signature
  const generateSignature = async (reference: string, amountInCents: number, currency: string, integritySecret: string) => {
    const concatenatedString = `${reference}${amountInCents}${currency}${integritySecret}`;
    const encondedText = new TextEncoder().encode(concatenatedString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  };

  const handleWompiWidget = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    // Determine location from the first item (assuming all items are from the same location due to cartStore logic)
    const location = cart[0].location;

    let PUBLIC_KEY = '';
    let INTEGRITY_SECRET = '';

    if (location === 'Social Club') {
      PUBLIC_KEY = import.meta.env.PUBLIC_WOMPI_PUBLIC_KEY_SOCIAL_CLUB;
      INTEGRITY_SECRET = import.meta.env.PUBLIC_WOMPI_INTEGRITY_SECRET_SOCIAL_CLUB;
    } else if (location === 'Ritmo Vivo') {
      PUBLIC_KEY = import.meta.env.PUBLIC_WOMPI_PUBLIC_KEY_RITMO_VIVO;
      INTEGRITY_SECRET = import.meta.env.PUBLIC_WOMPI_INTEGRITY_SECRET_RITMO_VIVO;
    } else {
      console.error("Unknown location:", location);
      alert("Error: No se pudo determinar la sede para el pago. Por favor contacta soporte.");
      return;
    }

    if (!PUBLIC_KEY || !INTEGRITY_SECRET) {
      console.error(`Missing Wompi keys for location: ${location}. Check your .env file.`);
      alert(`Error de configuración de pagos para la sede ${location}. Por favor contacta al administrador.`);
      return;
    }

    const amountInCents = Math.round(total * 100);
    const reference = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const currency = 'COP';

    try {
      const signature = await generateSignature(reference, amountInCents, currency, INTEGRITY_SECRET);

      // Check if the Wompi script is loaded
      // @ts-ignore
      if (typeof window.WidgetCheckout === 'undefined') {
        alert("Error: El sistema de pagos no se cargó correctamente. Por favor recarga la página.");
        return;
      }

      // Configure the checkout
      // @ts-ignore
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: amountInCents,
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
          alert(`La transacción fue rechazada o falló. Estado: ${transaction.status}`);
        }
      });

    } catch (error) {
      console.error("Error initializing Wompi widget:", error);
      alert("Hubo un error iniciando el pago. Por favor intenta nuevamente.");
    }
  };

  const handleCheckoutClick = () => {
    const individualCourses = cart.filter(item => item.mode === 'individual' && !item.promotion);
    // Show upsell if they haven't reached the max bundle discount (3 courses)
    if (individualCourses.length < 3) {
      setIsUpsellModalOpen(true);
    } else {
      handleWompiWidget();
    }
  };

  const handleContinueToPayment = () => {
    handleWompiWidget();
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