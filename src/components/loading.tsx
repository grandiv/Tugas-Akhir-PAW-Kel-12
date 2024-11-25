import { Loader2 } from "lucide-react";
import React from "react";

const LoadingComponent = () => {
  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <Loader2 className="animate-spin w-10 h-10" />
        <p className="mt-2">Memuat...</p>
      </div>
    </div>
  );
};

export default LoadingComponent;
