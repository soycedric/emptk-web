/**
 * FloatingCart: Barra sticky en la parte inferior de la pantalla
 * Muestra el progreso del pedido y un CTA rápido.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useOrderContext } from '@/contexts/OrderContext';

const FloatingCart = () => {
    const { items, setCartOpen, isCartOpen } = useOrderContext();

    // Si el carrito está abierto o no hay items, lo ocultamos
    if (items.length === 0 || isCartOpen) return null;

    return (
        <AnimatePresence>
            <motion.button
                onClick={() => setCartOpen(true)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-foreground text-background rounded-full shadow-brutal flex items-center justify-center transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg border-2 border-background"
                aria-label="Abrir carrito"
            >
                <div className="relative">
                    <ShoppingCart className="w-7 h-7" />
                    <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                        {items.length}
                    </span>
                </div>
            </motion.button>
        </AnimatePresence>
    );
};

export default FloatingCart;
