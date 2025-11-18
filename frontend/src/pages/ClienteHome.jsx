import React from "react";
import Header from "../components/Header";
import TopActions from "../components/TopActions";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mt-4 card p-3">

    
      <TopActions />

      <div className="container mt-3">
        <h2>Bienvenido a BellaPro</h2>
      </div>
    </div>
    </>
  );
}
