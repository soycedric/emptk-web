/**
 * Componente: Calculadora de Pedidos
 * Orquestador que compone ProductSelector, OrderItemsList y OrderSummary
 * Ahora usa OrderContext para estado compartido con ProductsSection y FloatingCart.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useOrderContext } from '@/contexts/OrderContext';
import { useOrderSubmit } from '@/hooks/use-order-submit';
import { getProductById } from '@/data/products';
import { ProductSelector } from '@/components/calculator/ProductSelector';
import { OrderSummary } from '@/components/calculator/OrderSummary';
import type { CalculatorDensity } from '@/components/calculator/types';
import { withBaseUrl } from '@/lib/base-url';

// Tofuchos para decorar la calculadora
const calculatorTofuchos = [
  { src: withBaseUrl("tofuchos/tofucho pensando.png"), position: "top-12 left-4 xl:left-12", size: "w-20 h-20 xl:w-24 xl:h-24", animation: { y: [0, -8, 0], rotate: [-3, 3, -3] } },
  { src: withBaseUrl("tofuchos/tofucho sorprendido.png"), position: "bottom-12 right-4 xl:right-12", size: "w-16 h-16 xl:w-20 xl:h-20", animation: { y: [0, -10, 0], scale: [1, 1.02, 1] } },
];

type OrderCalculatorVariant = 'standalone' | 'embedded';
type OrderCalculatorLayout = 'split' | 'stacked';

interface OrderCalculatorProps {
  variant?: OrderCalculatorVariant;
  showSummary?: boolean;
  layout?: OrderCalculatorLayout;
  containerClassName?: string;
  showDecorations?: boolean;
  density?: CalculatorDensity;
}

export const OrderCalculator = ({
  variant = 'standalone',
  showSummary = true,
  layout = 'split',
  containerClassName,
  showDecorations = true,
  density = 'default',
}: OrderCalculatorProps) => {
  const compact = density === 'compact';
  const {
    items,
    products,
    totalVolume,
    validation,
    subtotal,
    shippingCost,
    totalWithShipping,
    freeShippingThreshold,
    deliveryZone,
    setDeliveryZone,
    deliveryMethod,
    setDeliveryMethod,
    customerName,
    customerPhone,
    setCustomerName,
    setCustomerPhone,
    pickupPoint,
    setPickupPoint,
    deliveryLocationLink,
    setDeliveryLocationLink,
    addItem,
    updateItemQuantity,
    removeItem,
    clearOrder
  } = useOrderContext();
  const { handleCalculate } = useOrderSubmit();
  const [isLocked, setIsLocked] = useState(false);

  const handleAddProduct = (productId: string) => {
    const product = getProductById(productId);
    addItem(productId, 1);
    if (product) {
      toast.success('Producto agregado', {
        description: `${product.name} (${product.weight} kg) añadido al pedido`,
      });
    }
  };

  const content = (
    <div className={`max-w-5xl mx-auto ${containerClassName ?? ''}`.trim()}>
      {variant === 'standalone' && (
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6"
          >
            CALCULA TU <span className="inline-block bg-foreground text-background px-2">PEDIDO</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Envio $50 entre $0 y $399, y envio gratis desde $400. En CDMX solo pickup.
          </motion.p>
        </div>
      )}

      {layout === 'stacked' ? (
        <div className="space-y-6">
          <ProductSelector
            products={products}
            deliveryZone={deliveryZone}
            deliveryMethod={deliveryMethod}
            customerName={customerName}
            customerPhone={customerPhone}
            pickupPoint={pickupPoint}
            deliveryLocationLink={deliveryLocationLink}
            onZoneChange={setDeliveryZone}
            onMethodChange={setDeliveryMethod}
            onCustomerNameChange={setCustomerName}
            onCustomerPhoneChange={setCustomerPhone}
            onPickupPointChange={setPickupPoint}
            onDeliveryLocationChange={setDeliveryLocationLink}
            onAddProduct={handleAddProduct}
            density={density}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            canSubmit={validation.isValid}
          />
          {showSummary && (
            <OrderSummary
              items={items}
              validation={validation}
              subtotal={subtotal}
              shippingCost={shippingCost}
              totalWithShipping={totalWithShipping}
              freeShippingThreshold={freeShippingThreshold}
              deliveryZone={deliveryZone}
              deliveryMethod={deliveryMethod}
              pickupPoint={pickupPoint}
              deliveryLocation={deliveryLocationLink}
              customerName={customerName}
              customerPhone={customerPhone}
              products={products}
              onCalculate={handleCalculate}
              onUpdateQuantity={updateItemQuantity}
              onRemoveItem={removeItem}
              onClearOrder={clearOrder}
              density={density}
              isLocked={isLocked}
            />
          )}
        </div>
      ) : (
        <div className={showSummary ? "grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8" : "grid lg:grid-cols-1 gap-8"}>
          {/* Panel Izquierdo: Selector */}
          <div className="space-y-6">
            <ProductSelector
              products={products}
              deliveryZone={deliveryZone}
              deliveryMethod={deliveryMethod}
              customerName={customerName}
              customerPhone={customerPhone}
              pickupPoint={pickupPoint}
              deliveryLocationLink={deliveryLocationLink}
              onZoneChange={setDeliveryZone}
              onMethodChange={setDeliveryMethod}
              onCustomerNameChange={setCustomerName}
              onCustomerPhoneChange={setCustomerPhone}
              onPickupPointChange={setPickupPoint}
              onDeliveryLocationChange={setDeliveryLocationLink}
              onAddProduct={handleAddProduct}
              density={density}
              isLocked={isLocked}
              setIsLocked={setIsLocked}
              onSaveDraft={handleSaveDraft}
              canSubmit={validation.isValid}
            />
          </div>

          {/* Panel Derecho: Pedido + Resumen unificado */}
          {showSummary && (
            <OrderSummary
              items={items}
              validation={validation}
              subtotal={subtotal}
              shippingCost={shippingCost}
              totalWithShipping={totalWithShipping}
              freeShippingThreshold={freeShippingThreshold}
              deliveryZone={deliveryZone}
              deliveryMethod={deliveryMethod}
              pickupPoint={pickupPoint}
              deliveryLocation={deliveryLocationLink}
              customerName={customerName}
              customerPhone={customerPhone}
              products={products}
              onCalculate={handleCalculate}
              onUpdateQuantity={updateItemQuantity}
              onRemoveItem={removeItem}
              onClearOrder={clearOrder}
              density={density}
              isLocked={isLocked}
            />
          )}
        </div>
      )}
    </div>
  );

  if (variant === 'embedded') {
    return (
      <div className="relative overflow-hidden">
        {showDecorations && calculatorTofuchos.map((tofucho, index) => (
          <motion.div
            key={index}
            className={`absolute ${tofucho.position} z-10 hidden lg:block`}
            animate={tofucho.animation}
            transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={tofucho.src}
              alt=""
              aria-hidden="true"
              className={`${tofucho.size} object-contain opacity-70 drop-shadow-lg`}
            />
          </motion.div>
        ))}
        <div className={`container mx-auto ${compact ? 'px-0' : 'px-4'}`}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="calculadora" className="py-24 relative overflow-hidden bg-muted/30 bg-paper-texture">
      {/* Tofuchos decorativos flotantes */}
      {showDecorations && calculatorTofuchos.map((tofucho, index) => (
        <motion.div
          key={index}
          className={`absolute ${tofucho.position} z-10 hidden lg:block`}
          animate={tofucho.animation}
          transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={tofucho.src}
            alt=""
            aria-hidden="true"
            className={`${tofucho.size} object-contain opacity-70 drop-shadow-lg`}
          />
        </motion.div>
      ))}

      <div className="container mx-auto px-4">
        {content}
      </div>
    </section>
  );
};
