// src/components/LoadingScreen.jsx
import React from 'react';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="loading-spinner mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 mt-4">{message}</h2>
      <p className="text-gray-500">Please wait...</p>
    </div>
  );
}