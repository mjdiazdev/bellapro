import React from "react";

const InfoLayout = ({ title, lastUpdate, children }) => {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-[1120px] mx-auto">
        <h1 className="text-[3.5rem] leading-[1.2] font-bold text-black mb-4 tracking-tight">
          {title}
        </h1>
        
        {/* Solo renderiza si existe la fecha */}
        {lastUpdate && (
          <p className="text-gray-500 text-[1.13rem] mb-4">
            Última actualización on {lastUpdate}
          </p>
        )}

        <div className={`border-t border-gray-100 ${lastUpdate ? 'pt-4' : 'pt-10'}`}>
          <div className="max-w-none text-gray-700 leading-[1.6] text-[1.13rem]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default InfoLayout;