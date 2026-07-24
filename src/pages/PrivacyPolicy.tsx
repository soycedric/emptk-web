import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { withBaseUrl } from "@/lib/base-url";

const PrivacyPolicy = () => {
  return (
    <>
      <SEOHead
        title="Aviso de Privacidad - Empátika"
        description="Aviso de Privacidad de Empátika. Conoce cómo protegemos y utilizamos tus datos personales."
        canonicalUrl="https://empatika.mx/aviso-privacidad"
        ogType="article"
        ogImage="https://empatika.mx/logo/letras_empatika.svg"
      />
      <div className="min-h-screen bg-background bg-paper-texture">
        <Header />
        
        <main className="container mx-auto px-4 py-24 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-4">
                AVISO DE <span className="bg-primary text-primary-foreground px-2">PRIVACIDAD</span>
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                Última actualización: Febrero 2026
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 font-body text-foreground/90">
              {/* Identidad y Domicilio */}
              <section className="bg-cream border-2 border-foreground p-6 shadow-brutal">
                <h2 className="font-display text-2xl mb-4">1. IDENTIDAD Y DOMICILIO DEL RESPONSABLE</h2>
                <p className="mb-3">
                  <strong>Empátika</strong> (en adelante "Empátika" o "nosotros"), con domicilio en 
                  7 sur 2907, Col. Chulavista, Puebla, Puebla, México, es el responsable del tratamiento de sus datos personales.
                </p>
                <p>
                  Para cualquier duda o aclaración sobre este aviso de privacidad, puede contactarnos 
                  vía WhatsApp al <strong>+52 221 560 6205</strong>.
                </p>
              </section>

              {/* Datos Personales */}
              <section className="bg-cream border-2 border-foreground p-6 shadow-brutal">
                <h2 className="font-display text-2xl mb-4">2. DATOS PERSONALES QUE RECABAMOS</h2>
                <p className="mb-3">
                  Para las finalidades señaladas en el presente aviso de privacidad, podemos recabar 
                  sus datos personales de las siguientes formas:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cuando nos contacta vía WhatsApp o redes sociales</li>
                  <li>Cuando realiza un pedido de productos Empátika</li>
                  <li>Cuando visita nuestro sitio web</li>
                </ul>
                <p className="mt-4 mb-2">
                  Los datos personales que podemos recabar incluyen:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nombre completo</li>
                  <li>Número de teléfono</li>
                  <li>Dirección de entrega</li>
                  <li>Información de pedidos y preferencias de productos</li>
                </ul>
              </section>

              {/* Finalidades */}
              <section className="bg-cream border-2 border-foreground p-6 shadow-brutal">
                <h2 className="font-display text-2xl mb-4">3. FINALIDADES DEL TRATAMIENTO</h2>
                <p className="mb-3">
                  Sus datos personales serán utilizados para las siguientes finalidades necesarias:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Procesamiento y entrega de pedidos de tofu Empátika</li>
                  <li>Atención a consultas, dudas y solicitudes de información</li>
                  <li>Comunicación sobre el estado de pedidos y entregas</li>
                  <li>Mejora de nuestros productos y servicios</li>
                  <li>Envío de información sobre nuevos productos (con su consentimiento)</li>
                </ul>
              </section>

              {/* Compartir Datos */}
              <section className="bg-cream border-2 border-foreground p-6 shadow-brutal">
                <h2 className="font-display text-2xl mb-4">4. TRANSFERENCIA DE DATOS</h2>
                <p className="mb-3">
                  Le informamos que sus datos personales pueden ser compartidos con terceros únicamente 
                  en los siguientes casos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Servicios de mensajería y logística para realizar entregas</li>
                  <li>Autoridades competentes cuando sea requerido por ley</li>
                </ul>
                <p className="mt-4">
                  Estos terceros están obligados a mantener la confidencialidad de sus datos y utilizarlos 
                  únicamente para los fines específicos para los que fueron compartidos.
                </p>
              </section>

              {/* Derechos ARCO */}
              <section className="bg-cream border-2 border-foreground p-6 shadow-brutal">
                <h2 className="font-display text-2xl mb-4">5. DERECHOS ARCO</h2>
                <p className="mb-3">
                  Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos 
                  y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la 
                  corrección de su información personal (Rectificación), que la eliminemos de nuestros registros 
                  (Cancelación), o bien, oponerse al uso de sus datos personales (Oposición).
                </p>
                <p className="mb-3">
                  Para ejercer estos derechos ARCO, puede contactarnos vía WhatsApp al 
                  <strong> +52 221 560 6205</strong>, proporcionando:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Su nombre completo</li>
                  <li>Descripción clara del derecho que desea ejercer</li>
                  <li>Documentos que acrediten su identidad</li>
                </ul>
                <p className="mt-4">
                  Responderemos a su solicitud en un plazo máximo de 20 días hábiles.
                </p>
              </section>

              {/* Revocación */}
              <section className="bg-cream border-2 border-foreground p-6 shadow-brutal">
                <h2 className="font-display text-2xl mb-4">6. REVOCACIÓN DEL CONSENTIMIENTO</h2>
                <p>
                  Usted puede revocar el consentimiento que nos ha otorgado para el tratamiento de sus datos 
                  personales en cualquier momento. Para ello, debe contactarnos vía WhatsApp al 
                  <strong> +52 221 560 6205</strong>. Sin embargo, es importante que tenga en cuenta que no en 
                  todos los casos podremos atender su solicitud de manera inmediata, ya que podría existir alguna 
                  obligación legal que requiera seguir tratando sus datos.
                </p>
              </section>

              {/* Cookies */}
              <section className="bg-cream border-2 border-foreground p-6 shadow-brutal">
                <h2 className="font-display text-2xl mb-4">7. USO DE COOKIES Y TECNOLOGÍAS SIMILARES</h2>
                <p className="mb-3">
                  Le informamos que en nuestra página web utilizamos cookies y otras tecnologías de rastreo 
                  para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido.
                </p>
                <p className="mb-3">
                  Las cookies que utilizamos nos permiten:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Recordar sus preferencias de navegación</li>
                  <li>Analizar patrones de uso del sitio web</li>
                  <li>Mejorar la funcionalidad y el rendimiento del sitio</li>
                </ul>
                <p className="mt-4">
                  Puede configurar su navegador para rechazar cookies, aunque esto podría afectar algunas 
                  funcionalidades del sitio.
                </p>
              </section>

              {/* Modificaciones */}
              <section className="bg-cream border-2 border-foreground p-6 shadow-brutal">
                <h2 className="font-display text-2xl mb-4">8. MODIFICACIONES AL AVISO DE PRIVACIDAD</h2>
                <p>
                  Nos reservamos el derecho de modificar el presente aviso de privacidad en cualquier momento 
                  para adaptarlo a cambios legislativos o de nuestras prácticas de privacidad. Las modificaciones 
                  estarán disponibles en nuestro sitio web. Le recomendamos revisar periódicamente este aviso.
                </p>
              </section>

              {/* Consentimiento */}
              <section className="bg-primary border-2 border-foreground p-6 shadow-brutal">
                <h2 className="font-display text-2xl mb-4">CONSENTIMIENTO</h2>
                <p>
                  Al proporcionarnos sus datos personales a través de cualquiera de nuestros canales de contacto, 
                  usted acepta y consiente que Empátika trate sus datos personales conforme a los términos y 
                  condiciones del presente Aviso de Privacidad.
                </p>
              </section>
            </div>

            {/* Back Button */}
            <div className="mt-12 text-center">
              <a
                href={withBaseUrl("")}
                className="inline-block px-8 py-3 border-2 border-foreground bg-background hover:bg-primary shadow-brutal hover:-translate-y-1 transition-all font-display text-lg"
              >
                ← VOLVER AL INICIO
              </a>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
