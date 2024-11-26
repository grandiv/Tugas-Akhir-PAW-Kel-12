import LoginCard from "@/components/LoginCard";
import React from "react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen min-w-full grid grid-cols-2 max-lg:grid-cols-1 relative"
      style={{
        backgroundImage: `url('/homepage/background.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-center max-lg:order-last">
        <LoginCard />
      </div>
      <div className="flex flex-col justify-center max-lg:text-center lg:h-screen z-10">
        <h1 className="text-[96px] font-bold">
          <span className="text-white">Ladang</span>{" "}
          <span className="text-[#0B9343]">Lokal</span>
        </h1>
      </div>
      <Image
        src="/register/register_background.png"
        alt="Login Background"
        width={1500}
        height={1000}
        className="absolute bottom-0 right-0 w-1/3 max-w-[1500px] opacity-90"
      />
    </main>
  );
}
