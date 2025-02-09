"use client";

import { IconUserPlus, IconDotsVertical } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const JoinGameButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/join");
  };

  return (
    <div className="relative flex flex-col w-full">
      <button
        onClick={handleClick}
        className="relative group border-none bg-transparent p-0 outline-none cursor-pointer font-mono font-bold text-base">
        <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px"></span>

        <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(0, 69.80%, 49.40%)] to-[hsl(217,33%,16%)]"></span>

        <div
          className="relative flex items-center justify-between py-3 px-6 text-lg 
            text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] 
            group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110">
          <span className="select-none">Join with code</span>
          <IconUserPlus size={26} />
        </div>
      </button>
    </div>
  );
};

export default JoinGameButton;
