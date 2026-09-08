"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/lib/redux/store";
import { showLoader, hideLoader } from "@/lib/redux/slices/loadingSlice";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";
import { AuthService } from "@/services/AuthService";

interface OtpVerificationModalProps {
  isOpen: boolean;
  phoneNumber: string;
  onClose: () => void;
  onVerified: () => void;
}

export function OtpVerificationModal({
  isOpen,
  phoneNumber,
  onClose,
  onVerified,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useAppDispatch();

  // Reset timer & inputs when modal opens
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      setTimer(60);
      setOtp(Array(6).fill(""));
      if (timer > 0) {
        interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Support pasting full 6-digit OTP code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasteData.length === 6) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    dispatch(showLoader("Resending OTP code..."));

    try {
      const response = await AuthService.sendForgetOtp({ phone: phoneNumber });
      dispatch(hideLoader());

      if (response) {
        setTimer(60);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();

        dispatch(
          showResponseModal({
            status: "success",
            title: "OTP Resent",
            message: `A new 6-digit verification code has been sent to ${phoneNumber}.`,
            buttonText: "OK",
          })
        );
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            title: "Resend Failed",
            message: "Unable to resend OTP code. Please try again.",
            buttonText: "Try Again",
          })
        );
      }
    } catch (error: any) {
      dispatch(hideLoader());
      dispatch(
        showResponseModal({
          status: "error",
          title: "Error",
          message: error?.response?.data?.message || "Failed to resend code.",
        })
      );
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join("");
    if (fullCode.length !== 6) return;

    setIsLoading(true);
    dispatch(showLoader("Verifying OTP code..."));

    try {
      const response = await AuthService.verifyOtp({
        phone: phoneNumber,
        code: fullCode,
      });

      dispatch(hideLoader());

      if (response) {
        onClose();
        onVerified();

        dispatch(
          showResponseModal({
            status: "success",
            title: "Verification Successful",
            message: "Your phone number has been verified successfully.",
            buttonText: "Proceed",
          })
        );
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            title: "Verification Failed",
            message: "Invalid or expired OTP code. Please try again.",
            buttonText: "Try Again",
          })
        );
      }
    } catch (error: any) {
      dispatch(hideLoader());
      dispatch(
        showResponseModal({
          status: "error",
          title: "Error",
          message:
            error?.response?.data?.message ||
            "Verification failed. Please check your network connection.",
          buttonText: "OK",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-card-foreground">
            Verify OTP Code
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter the 6-digit verification code sent to{" "}
            <span className="font-semibold text-foreground">{phoneNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-6 mt-2">
          {/* 6 Digit Inputs */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="h-12 w-12 text-center text-lg font-bold rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ))}
          </div>

          {/* Resend Action */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Didn't receive code?</span>
            {timer > 0 ? (
              <span>
                Resend in <strong className="text-foreground">{timer}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-medium text-primary hover:underline focus:outline-none cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || otp.some((d) => d === "")}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Proceed"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}