import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { IconCrop169Filled } from "@tabler/icons-react";

interface PinInputProps {
  showPinInput?: boolean;
  length?: number;
  onChange?: (value: string) => void;
}

const PinInput = ({ showPinInput, length = 6, onChange }: PinInputProps) => {
  const [pins, setPins] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single character

    const newPins = [...pins];
    newPins[index] = value.toUpperCase();
    setPins(newPins);

    // Call onChange with combined pin value
    onChange?.(newPins.join(""));

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pins[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (showPinInput) {
      // Focus the first input when showPinInput becomes true
      inputRefs.current[0]?.focus();
    }
  }, [showPinInput]);

  const inputClass = `
    block size-[38px] 
    text-center 
    bg-slate-700 
    text-white
    rounded-md 
    text-sm
    font-bold
    bungee-font
    uppercase 
    placeholder:text-gray-400
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    disabled:opacity-50 
    disabled:pointer-events-none
  `;

  // Split the inputs into two groups
  const firstHalf = [...Array(length / 2)];
  const secondHalf = [...Array(length / 2)];

  return (
    <div className="py-2 px-3 flex flex-col items-center gap-5">
      <h1 className="text-xl font-bold">Enter game code</h1>
      <div className="flex items-center justify-center gap-x-5">
        {/* First half of inputs */}
        <div className="flex gap-x-5">
          {firstHalf.map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={pins[index]}
              className={inputClass}
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <IconCrop169Filled className="text-white" size={10} />

        {/* Second half of inputs */}
        <div className="flex gap-x-5">
          {secondHalf.map((_, index) => {
            const actualIndex = index + length / 2;
            return (
              <input
                key={actualIndex}
                ref={(el) => {
                  inputRefs.current[actualIndex] = el;
                }}
                type="text"
                value={pins[actualIndex]}
                className={inputClass}
                maxLength={1}
                onChange={(e) => handleChange(actualIndex, e.target.value)}
                onKeyDown={(e) => handleKeyDown(actualIndex, e)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PinInput;
