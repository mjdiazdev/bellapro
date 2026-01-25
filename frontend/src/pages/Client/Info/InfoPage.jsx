import React from "react";
import { useParams } from "react-router-dom";
import Header from '../../../components/common/HeaderClient';
import Footer from '../../../components/common/Footer';
import InfoLayout from "../../../components/common/InfoLayout";
import NotFound from "../../../components/common/NotFound";
import { CookiesContent } from "../../../components/Client/Info/CookiesContent";
import { PrivacyContent } from "../../../components/Client/Info/PrivacyContent";
import { TerminoContent } from "../../../components/Client/Info/TerminoContent";
import { FaqsContent } from "../../../components/Client/Info/FaqsContent";

const infoData = {
  "politica-de-cookies": {
    title: "Política de cookies",
    update: "23 Jun 2025",
    component: <CookiesContent />
  },
  "privacidad": {
    title: "Privacidad",
    update: "23 Jun 2025",
    component: <PrivacyContent />
  },
  "terminos-y-condiciones": {
    title: "Términos y condiciones de uso",
    update: "23 Jun 2025",
    component: <TerminoContent />
  },
  "preguntas-frecuentes": {
    title: "Preguntas frecuentes",
    update: null,
    component: <FaqsContent />
  },
};

export default function InfoPage() {
  const { slug } = useParams();
  
  // 1. Buscamos el contenido basado en el slug
  const content = infoData[slug];

  // 2. Si el contenido no existe, mostramos el NotFound envuelto en Header/Footer
  if (!content) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#FFF5F9]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <NotFound />
        </main>
        <Footer />
      </div>
    );
  }

  // 3. Si existe, renderizamos la página normal
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <InfoLayout title={content.title} lastUpdate={content.update}>
          {content.component}
        </InfoLayout>
      </main>

      <Footer />
    </div>
  );
}