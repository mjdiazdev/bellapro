import React from "react";
import { useParams } from "react-router-dom";
import Header from '../components/common/HeaderClient';
import Footer from '../components/common/Footer';
import NotFound from "../components/common/NotFound";

export default function NotFoundPage() {

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Contenido Principal */}
      <div>
        <NotFound />
      </div>

      {/* Footer */}
      <Footer />
    </div>

  );
}