import React from 'react';
import { useStore } from '@nanostores/react';
import { ShoppingCart } from 'lucide-react';
import { cartStore } from '../../stores/cartStore';

export const FloatingCartButton: React.FC = () => {
    const cart = useStore(cartStore);
    const [hasMounted, setHasMounted] = React.useState(false);

    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted || cart.length === 0) return null;

    return (
        <a
            href="/checkout"
            className="fixed bottom-8 right-8 z-50 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-bounce-in"
            aria-label="Ver carrito"
        >
            <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-orange-600">
                    {cart.length}
                </span>
            </div>
        </a>
    );
};
