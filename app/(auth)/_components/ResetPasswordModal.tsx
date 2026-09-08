"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
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

interface ResetPasswordModalProps {
  isOpen: boolean;
  phoneNumber?: string;
  resetToken?: string;
  onClose: () => void;
  onPasswordResetSuccess: () => void;
}

export function ResetPasswordModal({
  isOpen,
  phoneNumber,
  resetToken,
  onClose,
  onPasswordResetSuccess,
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();

  const handleResetForm = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    dispatch(showLoader("Updating password..."));

    try {
      const response = await AuthService.resetPassword({
        phone: phoneNumber,
        token: resetToken,
        newPassword,
      });

      dispatch(hideLoader());

      if (response) {
        handleResetForm();
        onClose();
        onPasswordResetSuccess();

        dispatch(
          showResponseModal({
            status: "success",
            title: "Password Updated",
            message: "Your password has been reset successfully. You can now log in with your new credentials.",
            buttonText: "Log In",
          })
        );
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            title: "Reset Failed",
            message: "Failed to reset password. Please request a new verification code and try again.",
            buttonText: "Try Again",
          })
        );
      }
    } catch (err: any) {
      dispatch(hideLoader());
      const apiMessage = err?.response?.data?.message || "Something went wrong while resetting your password.";
      setError(apiMessage);

      dispatch(
        showResponseModal({
          status: "error",
          title: "Error",
          message: apiMessage,
          buttonText: "OK",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-card-foreground">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter your new password and confirm it below to update your credentials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <CustomInput
            label="New Password"
            icon={Lock}
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="••••••••"
            required
          />

          <CustomInput
            label="Confirm New Password"
            icon={Lock}
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="••••••••"
            required
            error={error}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}