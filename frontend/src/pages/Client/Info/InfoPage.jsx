import React from "react";
import { useParams } from "react-router-dom";
import Header from '../../../components/common/HeaderClient';
import Footer from '../../../components/common/Footer';
import InfoLayout from "../../../components/common/InfoLayout";
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
  const content = infoData[slug] || infoData["privacidad"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Contenido Principal */}
      <div>
        <InfoLayout title={content.title} lastUpdate={content.update}>
        {content.component}
        </InfoLayout>
      </div>

      {/* Footer */}
      <Footer />
    </div>

  );
}