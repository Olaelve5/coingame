import React from "react";
import { useQRCode } from "next-qrcode";

interface QRCodeProps {
  gameCode: string;
}

function QRCode({ gameCode }: QRCodeProps) {
  const { Canvas } = useQRCode();

  return (
    <div className="overflow-hidden w-fit rounded-2xl bg-blue-300 mt-6">
      <Canvas
        text={`http://192.168.1.48:3000/join/${gameCode}`}
        options={{
          type: "image/jpeg",
          quality: 0.3,
          errorCorrectionLevel: "M",
          margin: 3,
          scale: 4,
          width: 150,
          color: {
            dark: "#0f172a",
            light: "FFFFFF",
          },
        }}
      />
    </div>
  );
}

export default QRCode;
