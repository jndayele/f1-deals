import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img
            src="https://media.base44.com/images/public/user_6a516bbaddc8ef31c90f41d3/12829faea_f1dealslogo.jpg"
            alt="F1 Deals"
            className="w-20 h-20 mx-auto mb-4 rounded-xl object-contain bg-white p-1"
          />
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-gray-400 mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}