import React from "react";

export default function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent`}
      />
    </div>
  );
}
