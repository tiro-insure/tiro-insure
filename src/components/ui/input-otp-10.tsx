"use client";

import { useState, useEffect, useRef } from "react";
import ParticleSphereAnimation from "@/components/ui/input-otp-10-utils/particalsphear";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck } from "lucide-react";

export default function InputOtp10() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const value = digits.join("");

  const applyDigits = (startIndex: number, rawValue: string) => {
    const numbers = rawValue.replace(/\D/g, "").slice(0, 6 - startIndex).split("");
    if (numbers.length === 0) return;
    setDigits((current) => {
      const next = [...current];
      numbers.forEach((number, offset) => { next[startIndex + offset] = number; });
      return next;
    });
    inputRefs.current[Math.min(startIndex + numbers.length, 5)]?.focus();
  };

  useEffect(() => {
    if (value === "123456") {
      setIsSuccess(true);
      const verifiedDelay = window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("tiro:otp-verified"));
      }, 600);
      return () => window.clearTimeout(verifiedDelay);
    } else {
      setIsSuccess(false);
    }
  }, [value]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto rounded-2xl border border-border bg-linear-to-b from-card to-card/60 p-4 sm:p-5 backdrop-blur-xl overflow-hidden group select-none">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/15 transition-colors duration-500" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border border-dashed border-primary/30 animate-spin pointer-events-none"
            style={{ animationDuration: "60s" }}
          />
          <div
            className="absolute inset-2 rounded-full border border-primary/15 animate-spin pointer-events-none"
            style={{ animationDuration: "30s", animationDirection: "reverse" }}
          />
          <div className="absolute inset-4 rounded-full border border-dashed border-primary/5 pointer-events-none" />
          <div
            className={cn(
              "absolute -inset-1.5 rounded-full transition-all duration-500",
              isSuccess
                ? "bg-linear-to-t from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 animate-pulse"
                : "bg-linear-to-t from-primary/0 via-primary/5 to-primary/0 animate-pulse",
            )}
            style={!isSuccess ? { animationDuration: "3s" } : undefined}
          />
          <div
            className={cn(
              "w-24 h-24 rounded-full overflow-hidden flex items-center justify-center transition-all duration-500",
              isSuccess ? "scale-105" : "scale-95 group-hover:scale-100",
            )}
          >
            <ParticleSphereAnimation className="w-full h-full scale-135 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-xs rounded-full"
              >
                <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="text-center flex flex-col gap-1.5">
          <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">
            {isSuccess ? "System Key Decrypted" : "Enter Credentials"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xs leading-relaxed">
            {isSuccess
              ? "Session authorization successfully validated by Security Hub."
              : "Please input the 6-digit verification code sent to your dynamic authenticator node."}
          </p>
        </div>
        <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => { inputRefs.current[index] = element; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Verification code digit ${index + 1}`}
              value={digit}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => {
                const number = event.currentTarget.value.replace(/\D/g, "");
                if (number.length > 1) {
                  applyDigits(index, number);
                  return;
                }
                setDigits((current) => {
                  const next = [...current];
                  next[index] = number;
                  return next;
                });
                if (number && index < 5) inputRefs.current[index + 1]?.focus();
              }}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digits[index] && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
                if (event.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
                if (event.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
              }}
              onPaste={(event) => {
                event.preventDefault();
                applyDigits(index, event.clipboardData.getData("text"));
              }}
              className={cn(
                "h-12 w-10 sm:w-11 rounded-xl border bg-muted/10 text-center font-mono text-lg font-bold text-foreground outline-none transition-all duration-200",
                isSuccess
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                  : "border-border/60 hover:border-primary/50 focus:border-primary focus:bg-primary/5 focus:ring-2 focus:ring-primary/15",
              )}
            />
          ))}
        </div>
        <div className="h-4 flex items-center justify-center">
          <span className="text-xs font-mono text-muted-foreground/70 uppercase tracking-widest">
            {value.length === 0
              ? "Awaiting key signature..."
              : value.length < 6
                ? `Entering signature: ${value.length} / 6`
                : value === "123456"
                  ? "Signature matching complete"
                  : "Invalid signature"}
          </span>
        </div>
      </div>
    </div>
  );
}
