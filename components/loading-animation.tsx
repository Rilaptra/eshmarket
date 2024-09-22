"use client";

import { useState, useEffect } from "react";

export function LoadingAnimation() {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity opacity-100`}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
    </div>
  );
}
