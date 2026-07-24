/**
 * Subcomponente: Resumen del pedido con barra de progreso, sugerencia inteligente y CTAs
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, MessageCircle, Lightbulb, Trash2 } from 'lucide-react';
import { OrderItemsList } from '@/components/calculator/OrderItemsList';
import type { CalculatorDensity } from '@/components/calculator/types';
import { isCompactDensity } from '@/components/calculator/types';
import type { OrderItemWithId } from '@/contexts/OrderContext';
import type { ValidationResult, Product } from '@/types/order';

type DeliveryZone = 'puebla' | 'cdmx';
type DeliveryMethod = 'delivery' | 'pickup';

interface OrderSummaryProps {
  items: OrderItemWithId[];
  validation: ValidationResult;
  subtotal: number;
  shippingCost: number;
  totalWithShipping: number;
  freeShippingThreshold: number;
  deliveryZone: DeliveryZone;
  deliveryMethod: DeliveryMethod;
  pickupPoint: string;
  deliveryLocation: string;
  customerName: string;
  customerPhone: string;
  products: Product[];
  density?: CalculatorDensity;
  onCalculate: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearOrder: () => void;
  isLocked?: boolean;
}

/**
 * Calcula la mejor sugerencia para alcanzar un monto objetivo
 */
function getPriceSuggestion(
  remainingAmount: number,
  products: Product[]
): { product: Product; quantity: number; addedAmount: number } | null {
  if (remainingAmount <= 0) return null;

  const sorted = [...products].sort((a, b) => a.price - b.price);
  let bestOption: { product: Product; quantity: number; addedAmount: number } | null = null;
  let bestExcess = Infinity;

  for (const product of sorted) {
    const qty = Math.ceil(remainingAmount / product.price);
    const addedAmount = product.price * qty;
    const excess = addedAmount - remainingAmount;

    if (excess < bestExcess) {
      bestExcess = excess;
      bestOption = { product, quantity: qty, addedAmount };
    }
  }

  return bestOption;
}

export const OrderSummary = ({
  items,
  validation,
  subtotal,
  shippingCost,
  totalWithShipping,
  freeShippingThreshold,
  deliveryZone,
  deliveryMethod,
  pickupPoint,
  deliveryLocation,
  customerName,
  customerPhone,
  products,
  density = 'default',
  onCalculate,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  isLocked = false,
}: OrderSummaryProps) => {
  const isPickup = deliveryZone === 'cdmx' || deliveryMethod === 'pickup';
  const compact = isCompactDensity(density);
  const hasPickupInfo = deliveryZone === 'puebla' || pickupPoint.trim().length > 0;
  const hasDeliveryLocation = deliveryLocation.trim().length > 0;
  const hasContact = customerName.trim().length > 0 && customerPhone.trim().length > 0;
  const canSubmit = hasContact && (isPickup ? hasPickupInfo : hasDeliveryLocation);
  const remainingToFree = Math.max(0, freeShippingThreshold - subtotal);
  const suggestionToFree = useMemo(() => {
    if (isPickup || items.length === 0 || remainingToFree <= 0) return null;
    return getPriceSuggestion(remainingToFree, products);
  }, [isPickup, items.length, remainingToFree, subtotal, products]);
  const fillPercent = freeShippingThreshold > 0 ? (subtotal / freeShippingThreshold) * 100 : 0;

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>

      {/* Card Unificada: Pedido + Resumen */}
      <div className={compact
        ? "space-y-4"
        : `bg-background border-4 border-foreground shadow-brutal p-6 ${validation.isValid
          ? 'bg-green-50 dark:bg-green-950/30'
          : items.length === 0
            ? ''
            : 'bg-orange-50 dark:bg-orange-950/30'
        }`}
      >
        <div className={compact ? "space-y-4" : "space-y-6"}>
          {/* Header: Tu Pedido */}
          <div className={compact ? "flex justify-between items-center pb-2 border-b border-foreground/15" : "flex justify-between items-center pb-3 border-b-2 border-foreground/20"}>
            <h3 className={compact ? "font-display text-lg flex items-center gap-2" : "font-display text-2xl flex items-center gap-2"}>
              <Package className={compact ? "w-5 h-5" : "w-6 h-6"} />
              TU PEDIDO
            </h3>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearOrder}
                className="text-destructive hover:text-destructive border-2 border-destructive hover:bg-destructive/10"
                aria-label="Vaciar pedido completo"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Lista de items */}
          <OrderItemsList
            items={items}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            density={compact ? 'compact' : 'default'}
          />

          {/* Estado e Icono */}
          <div className={compact ? "text-center" : "text-center"}>
            <div className={compact ? "flex justify-center mb-2" : "flex justify-center mb-3"}>
              {validation.isValid ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={compact
                    ? "w-12 h-12 rounded-full bg-green-500 border-2 border-foreground flex items-center justify-center"
                    : "w-16 h-16 rounded-full bg-green-500 border-4 border-foreground flex items-center justify-center shadow-brutal-sm"
                  }
                >
                  <Truck className={compact ? "w-6 h-6 text-white" : "w-8 h-8 text-white"} />
                </motion.div>
              ) : (
                <div className={compact
                  ? "w-12 h-12 rounded-full bg-muted border-2 border-foreground flex items-center justify-center"
                  : "w-16 h-16 rounded-full bg-muted border-4 border-foreground flex items-center justify-center"
                }>
                  <Package className={compact ? "w-6 h-6 text-muted-foreground" : "w-8 h-8 text-muted-foreground"} />
                </div>
              )}
            </div>
            <h4 className={compact ? "font-display text-lg mb-1" : "font-display text-2xl mb-2"}>
              {validation.isValid
                ? (isPickup
                  ? '¡LISTO PARA RECOGER!'
                  : subtotal >= freeShippingThreshold
                    ? '¡ENVIO GRATIS!'
                    : '¡LISTO PARA ENVIAR!')
                : items.length > 0 ? 'COMPLETA TU PEDIDO' : ''}
            </h4>
          </div>

          {/* Subtotal */}
          <div className={compact ? "text-center" : "text-center py-4"}>
            <p className={compact ? "text-[10px] text-muted-foreground font-display uppercase tracking-wider" : "text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider"}>
              Subtotal
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className={compact ? "text-4xl font-display font-bold text-foreground" : "text-7xl font-display font-bold text-foreground"}>
                ${subtotal.toFixed(0)}
              </span>
              <span className={compact ? "text-base font-display text-muted-foreground" : "text-2xl font-display text-muted-foreground"}>MXN</span>
            </div>

            <div className={compact ? "mt-2 space-y-1 text-sm" : "mt-4 space-y-1 text-sm"}>
              <p>Envio: ${shippingCost.toFixed(0)} MXN</p>
              <p className="font-bold">Total a pagar: ${totalWithShipping.toFixed(0)} MXN</p>
            </div>
          </div>

          {/* Barra de progreso */}
          {!isPickup && (
            <div className={compact ? "space-y-2" : "space-y-3"}>
              <div className="flex justify-between items-center text-sm">
                <span className={compact ? "text-muted-foreground text-[10px] uppercase font-display" : "text-muted-foreground text-xs uppercase font-display"}>Envio gratis:</span>
                <Badge variant="outline" className={compact ? "text-[10px] font-display border border-foreground" : "font-display border-2 border-foreground"}>
                  ${freeShippingThreshold}
                </Badge>
              </div>

              <div className={compact ? "h-3 bg-muted border border-foreground overflow-hidden relative" : "h-5 bg-muted border-2 border-foreground overflow-hidden relative"}>
                <motion.div
                  className={`h-full ${subtotal >= freeShippingThreshold
                    ? 'bg-green-500'
                    : fillPercent > 60
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                    }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, fillPercent)}%`
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {items.length > 0 && !compact && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-display font-bold text-foreground mix-blend-difference">
                    {Math.min(100, Math.round(fillPercent))}%
                  </span>
                )}
              </div>

              {/* Celebration when minimum reached */}
              {validation.isValid && !compact && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="text-center py-2"
                >
                  <span className="text-2xl">🎉</span>
                  <p className="font-display text-sm text-green-700 dark:text-green-300 mt-1">
                    {subtotal >= freeShippingThreshold
                      ? '¡ENVIO GRATIS DESBLOQUEADO!'
                      : '¡LISTO PARA ENVIAR!'}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* Mensaje de validación */}
          {items.length > 0 && !validation.isValid && (
            <div className={compact
              ? "text-center font-medium text-sm text-orange-700 dark:text-orange-300"
              : "p-4 border-2 border-foreground text-center font-medium text-sm bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200"
            }>
              {validation.message}
            </div>
          )}

          {/* Sugerencias inteligentes */}
          {suggestionToFree && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={compact
                ? "flex items-start gap-2 text-sm text-muted-foreground"
                : "p-4 bg-foreground/5 border-2 border-foreground/40 flex items-start gap-3"
              }
            >
              <Lightbulb className={compact ? "w-4 h-4 text-foreground shrink-0 mt-0.5" : "w-5 h-5 text-foreground shrink-0 mt-0.5"} />
              <p className="text-sm">
                <span className="font-bold">Tip:</span>{' '}
                Agrega{' '}
                <span className="font-bold text-foreground">
                  {suggestionToFree.quantity} {suggestionToFree.product.name}
                </span>{' '}
                para envio gratis desde ${freeShippingThreshold}.
              </p>
            </motion.div>
          )}

          {hasContact && (
            <div className={compact ? "text-sm text-muted-foreground" : "p-3 border-2 border-foreground/40 bg-foreground/5 text-sm"}>
              <span className="font-bold">Cliente:</span> {customerName} · {customerPhone}
            </div>
          )}

          {isPickup && hasPickupInfo && (
            <div className={compact ? "text-sm text-muted-foreground" : "p-3 border-2 border-foreground/40 bg-foreground/5 text-sm"}>
              <span className="font-bold">Pickup:</span> {pickupPoint}
            </div>
          )}

          {!isPickup && hasDeliveryLocation && (
            <div className={compact ? "text-sm text-muted-foreground" : "p-3 border-2 border-foreground/40 bg-foreground/5 text-sm"}>
              <span className="font-bold">Ubicacion:</span> {deliveryLocation}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={compact
            ? "pt-3 border-t border-foreground/10"
            : "bg-background border-4 border-foreground shadow-brutal p-6 bg-green-50 dark:bg-green-950/30"
          }>
            <div className={compact ? "text-center mb-3" : "text-center mb-4"}>
              <h3 className={compact ? "font-display text-sm font-bold text-green-700 dark:text-green-300" : "font-display text-lg font-bold text-green-700 dark:text-green-300 mb-2"}>
                {isPickup ? '¡LISTO PARA RECOGER!' : '¡LISTO PARA ENVIAR!'}
              </h3>
              <p className={compact ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"}>
                Envía tu pedido por WhatsApp y coordinamos el pago.
              </p>
            </div>

            <div className={`transition-opacity ${isLocked ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <Button
                className={compact
                  ? "w-full font-display text-sm py-4 bg-green-600 hover:bg-green-700 border-2 border-foreground"
                  : "w-full font-display text-base py-6 bg-green-600 hover:bg-green-700 border-4 border-foreground shadow-brutal hover:shadow-brutal-hover active:shadow-none transition-all"
                }
                size="lg"
                onClick={onCalculate}
                disabled={!canSubmit || !validation.isValid}
              >
                <MessageCircle className={compact ? "w-4 h-4 mr-2" : "w-5 h-5 mr-2"} />
                ENVIAR PEDIDO POR WHATSAPP
              </Button>
              {!compact && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  El ticket se envía por WhatsApp y coordinamos el pago al recibir.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
