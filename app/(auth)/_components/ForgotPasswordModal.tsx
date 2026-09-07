"use client";

import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/custom-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const fullPhoneNumber = `+251${phone}`;

    // Mock API call simulation
    setTimeout(() => {
      setIsLoading(false);
      onSubmitPhone(fullPhoneNumber);
      setPhone("");
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-border bg-card ">
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
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="911234567"
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
            <Button type="submit" disabled={isLoading || phone.length < 8}>
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