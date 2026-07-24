import { toast } from 'sonner';
import { useOrderContext } from '@/contexts/OrderContext';

const DELIVERY_ZONES = {
  puebla: 'Puebla',
  cdmx: 'Ciudad de Mexico',
} as const;

export const useOrderSubmit = () => {
  const {
    items,
    validation,
    subtotal,
    shippingCost,
    totalWithShipping,
    freeShippingThreshold,
    deliveryZone,
    deliveryMethod,
    customerName,
    customerPhone,
    pickupPoint,
    deliveryLocationLink,
  } = useOrderContext();

  const validateForm = () => {
    const isPickup = deliveryZone === 'cdmx' || deliveryMethod === 'pickup';
    const hasContact = customerName.trim().length > 0 && customerPhone.trim().length > 0;
    const hasDeliveryLocation = deliveryLocationLink.trim().length > 0;
    const hasPickupInfo = deliveryZone === 'puebla' || pickupPoint.trim().length > 0;

    const scrollToField = (fieldId: string) => {
      const target = document.getElementById(fieldId);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        target.focus();
      }
    };

    if (!hasContact) {
      if (customerName.trim().length === 0) {
        scrollToField('customer-name');
      } else if (customerPhone.trim().length === 0) {
        scrollToField('customer-phone');
      } else {
        scrollToField('step-contact');
      }
      toast.error('Faltan datos de contacto', {
        description: 'Agrega tu nombre y telefono para continuar.'
      });
      return false;
    }

    if (!isPickup && !hasDeliveryLocation) {
      scrollToField('delivery-location');
      toast.error('Falta la ubicacion', {
        description: 'Pega tus coordenadas para envio.'
      });
      return false;
    }

    if (isPickup && !hasPickupInfo) {
      scrollToField('pickup-point');
      toast.error('Falta el punto de pickup', {
        description: 'Selecciona o escribe tu punto de pickup para continuar.'
      });
      return false;
    }

    if (validation.shouldRedirectToDistributors) {
      document.getElementById('distribuidores')?.scrollIntoView({ behavior: 'smooth' });
      return false;
    }

    return true;
  };

  const buildWhatsAppUrl = () => {
    const isPickup = deliveryZone === 'cdmx' || deliveryMethod === 'pickup';
    const phoneNumber = '522215606205';
    const sanitize = (text: string) => text.replace(/[<>"'&]/g, '');

    const lines: string[] = [];
    lines.push(isPickup
      ? 'Hola! Quiero hacer un pedido para recoger:'
      : subtotal >= freeShippingThreshold
        ? 'Hola! Quiero hacer un pedido con envio gratis:'
        : `Hola! Quiero hacer un pedido con envio (costo $${shippingCost.toFixed(0)}):`);

    lines.push('');
    lines.push(`Cliente: ${sanitize(customerName)}`);
    lines.push(`Telefono: ${sanitize(customerPhone)}`);
    lines.push(`Zona: ${sanitize(DELIVERY_ZONES[deliveryZone])}`);
    lines.push(`Metodo: ${isPickup ? 'Pickup' : 'Envio'}`);

    if (isPickup) {
      lines.push('');
      if (deliveryZone === 'cdmx') {
        lines.push(`Punto de pickup: ${sanitize(pickupPoint)}`);
      } else {
        lines.push(`Punto de pickup: Puebla`);
      }
      lines.push('Horario: A coordinar por WhatsApp');
    } else {
      lines.push('');
      lines.push(`Ubicacion: ${sanitize(deliveryLocationLink)}`);
    }

    lines.push('');
    lines.push(`Subtotal: $${subtotal.toFixed(0)} MXN`);
    lines.push(`Envio: $${shippingCost.toFixed(0)} MXN`);
    lines.push(`Total: $${totalWithShipping.toFixed(0)} MXN`);
    lines.push('');
    lines.push('Productos:');

    items.forEach((item, i) => {
      const weight = (item.product.weight * item.quantity).toFixed(2);
      const lineTotal = item.product.price * item.quantity;
      lines.push(`${i + 1}. ${sanitize(item.product.name)} (${item.product.weight}kg) x${item.quantity} = ${weight}kg - $${lineTotal}`);
    });

    const encodedMessage = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;

    const url = buildWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('Redirigiendo a WhatsApp...', {
      description: 'Por favor envía el mensaje para confirmar tu pedido.'
    });
  };

  return { handleCalculate };
};
