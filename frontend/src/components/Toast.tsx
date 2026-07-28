"use client";

import React, { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];

export const showToast = (message: string, type: ToastMessage["type"] = "success") => {
  const id = Math.random().toString(36).substring(2, 9);
  toastListeners.forEach((listener) => listener({ id, message, type }));
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const addToast = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((listener) => listener !== addToast);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-md text-white font-medium text-sm animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-auto min-w-[250px] ${
            t.type === "success"
              ? "bg-green-600"
              : t.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
