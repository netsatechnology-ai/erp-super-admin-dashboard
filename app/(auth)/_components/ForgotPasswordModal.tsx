"use client";

import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/CustomInput";
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

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPhone: (fullPhone: string) => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  onSubmitPhone,
}: ForgotPasswordModalProps) {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  // Strip non-numeric characters and cap at 9 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhone(numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 9) return;

    setIsLoading(true);
    const fullPhoneNumber = `+251${phone}`;

    dispatch(showLoader("Sending OTP code..."));

    try {
      const response = await AuthService.sendForgetOtp({ phone: fullPhoneNumber });

      dispatch(hideLoader());

      if (response) {
        onClose();
        onSubmitPhone(fullPhoneNumber);
        setPhone("");

        dispatch(
          showResponseModal({
            status: "success",
            title: "OTP Sent Successfully",
            message: `A 6-digit verification code has been sent to ${fullPhoneNumber}.`,
            buttonText: "Enter Code",
          })
        );
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            title: "Failed to Send OTP",
            message: "The phone number provided is not registered.",
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
            "Unable to send OTP code. Please check your connection.",
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
            Forgot Password
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter your registered phone number to receive a 6-digit verification code.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <CustomInput
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="911234567"
            maxLength={9}
            required
            inlinePrefix={
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">+251</span>
              </div>
            }
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || phone.length !== 9}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send OTP Code"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}