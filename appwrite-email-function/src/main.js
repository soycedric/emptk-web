const nodemailer = require('nodemailer');

module.exports = async ({ req, res, log, error }) => {
    // Verificamos que sí traiga datos del pedido (evento de base de datos)
    if (!req.body || !req.body.customerName) {
        log("No se recibieron datos del cliente. Payload: " + JSON.stringify(req.body || {}));
        return res.json({ success: false, msg: 'Sin datos de pedido.' });
    }

    const pedido = req.body;
    const smtpPort = parseInt(process.env.SMTP_PORT || "465");

    log("=== DEBUG VARIABLES ===");
    log("SMTP_HOST: " + (process.env.SMTP_HOST || "FALTA"));
    log("SMTP_PORT: " + (process.env.SMTP_PORT || "FALTA"));
    log("SMTP_USER: " + (process.env.SMTP_USER ? "EXISTE" : "FALTA"));
    log("SMTP_PASSWORD: " + (process.env.SMTP_PASSWORD ? "EXISTE" : "FALTA"));
    log("=======================");

    // Configurar el transporte SMTP con las variables de entorno
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for others like 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        connectionTimeout: 8000, // Timeout rápido para ver el error
        greetingTimeout: 8000,
        socketTimeout: 8000,
        logger: true, // Imprime logs internos
        debug: true,
    });

    // Validamos que el JSON de items exista para formatearlo si se puede
    let itemsHtml = "";
    try {
        if (pedido.items) {
            const parsedItems = JSON.parse(pedido.items);
            itemsHtml = "<ul>" + parsedItems.map(i => `<li>${i.qty}x ${i.name} ($${i.price})</li>`).join("") + "</ul>";
        }
    } catch (e) {
        log("No se pudieron parsear los items: " + e.message);
    }

    const isPickup = pedido.deliveryMethod === 'pickup';
    const zoneName = pedido.deliveryZone === 'cdmx' ? 'CDMX' : 'Puebla';

    const htmlCorreo = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">🚨 ¡Nuevo Registro de Pedido!</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Cliente:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${pedido.customerName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${pedido.customerPhone}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Estado del Pago:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${pedido.status === 'abandoned' ? 'Borrador / Sin confirmar pago' : pedido.status}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Método de Pago:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${pedido.paymentMethod === 'online' ? 'Pago en Línea' : 'Contraentrega'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Zona:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${zoneName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tipo de Entrega:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${isPickup ? 'Pickup (Recoger)' : 'A domicilio'}</td></tr>
                
                ${isPickup && pedido.pickupPoint ?
            `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Punto de Recolección:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${pedido.pickupPoint}</td></tr>`
            : ''
        }
                
                ${!isPickup && pedido.deliveryLocationLink ?
            `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Ubicación de Envío:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="${pedido.deliveryLocationLink}" target="_blank">Ver en Maps</a></td></tr>`
            : ''
        }
            </table>
            
            <h3 style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">Productos Solicitados</h3>
            ${itemsHtml || '<p>No se cargaron los productos correctamente.</p>'}
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr><td style="padding: 4px 0;"><strong>Subtotal:</strong></td><td style="padding: 4px 0; text-align: right;">$${pedido.subtotal || 0}</td></tr>
                ${pedido.shippingCost > 0 ? `<tr><td style="padding: 4px 0;"><strong>Envío:</strong></td><td style="padding: 4px 0; text-align: right;">$${pedido.shippingCost}</td></tr>` : ''}
                ${pedido.discountAmount > 0 ? `<tr><td style="padding: 4px 0; color: #2e7d32;"><strong>Descuento (-10%):</strong></td><td style="padding: 4px 0; text-align: right; color: #2e7d32;">-$${pedido.discountAmount}</td></tr>` : ''}
                <tr><td style="padding: 8px 0; border-top: 2px solid #333;"><strong>TOTAL:</strong></td><td style="padding: 8px 0; text-align: right; border-top: 2px solid #333;"><strong>$${pedido.total || pedido.subtotal}</strong></td></tr>
            </table>

            <p style="font-size: 11px; color: #999; margin-top: 30px; text-align: center;">
                Notificación automática de Empatika
            </p>
        </div>
    `;

    try {
        // Enviar el correo
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.DESTINATION_EMAIL, // Se envía a la variable DESTINATION_EMAIL
            subject: `🚨 Aviso: Pedido de ${pedido.customerName} ($${pedido.total || pedido.subtotal})`,
            html: htmlCorreo,
        });

        log('¡Correo de aviso enviado exitosamente!');
        return res.json({ success: true, message: "Correo enviado" });
    } catch (err) {
        error('Error enviando el correo: ' + err.message);
        return res.json({ success: false, error: err.message });
    }
};
