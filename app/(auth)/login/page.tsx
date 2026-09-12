"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Phone, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/CustomInput";
import { showLoader, hideLoader } from "@/lib/redux/slices/loadingSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordModal } from "../_components/ForgotPasswordModal";
import { OtpVerificationModal } from "../_components/OtpVerificationModal";
import { ResetPasswordModal } from "../_components/ResetPasswordModal";
import { AuthService } from "@/services/AuthService";
import { useAppDispatch } from "@/lib/redux/store";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";

const REMEMBER_ME_PHONE_KEY = "remembered_phone";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Modal State Control
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState("");

  // 1. Auto-fill phone from localStorage on component mount
  useEffect(() => {
    const savedPhone = localStorage.getItem(REMEMBER_ME_PHONE_KEY);
    if (savedPhone) {
      setPhone(savedPhone);
      setRememberMe(true);
    }
  }, []);

  // 2. Capture native browser autofill values when Chrome/Safari inject values directly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (passwordInputRef.current && passwordInputRef.current.value) {
        setPassword(passwordInputRef.current.value);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    dispatch(showLoader());

    const data = {
      phoneNumber: `0${phone}`,
      password: password,
    };

    AuthService.logIn(data)
      .then((response: any) => {
        dispatch(hideLoader());

        const token = response?.accessToken;

        if (token) {
          if (rememberMe) {
            localStorage.setItem(REMEMBER_ME_PHONE_KEY, phone);
          } else {
            localStorage.removeItem(REMEMBER_ME_PHONE_KEY);
          }

          sessionStorage.setItem("token", token);
          router.push("/dashboard");
          router.refresh();
        } else {
          dispatch(
            showResponseModal({
              status: "error",
              title: "Login Failed",
              message:
                response?.message ||
                "Invalid phone number or password. Please try again.",
              buttonText: "Try Again",
            }),
          );
        }
      })
      .catch((error: any) => {
        dispatch(hideLoader());

        const status = error?.response?.status;
        let errorMessage =
          "Unable to reach the server. Please check your connection.";

        if (error?.response?.data) {
          const serverData = error.response.data;
          errorMessage =
            typeof serverData === "string"
              ? serverData
              : serverData.message || serverData.error || errorMessage;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        dispatch(
          showResponseModal({
            status: "error",
            title: status
              ? `Authentication Error (${status})`
              : "Network Error",
            message: errorMessage,
            buttonText: "Try Again",
          }),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePhoneSubmitted = (fullPhone: string) => {
    setRecoveryPhone(fullPhone);
    setIsForgotModalOpen(false);
    setIsOtpModalOpen(true);
  };

  const handleOtpVerified = () => {
    setIsOtpModalOpen(false);
    setIsResetModalOpen(true);
  };

  const handlePasswordResetSuccess = () => {
    setIsResetModalOpen(false);
  };

  return (
    <>
      <Card className="w-full max-w-md border-border bg-card shadow-sm px-6 py-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-card-foreground">
            Netsa Tech Admin Dashboard
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm">
            Sign in to access admin portal
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Explicit method="post" signals password managers to handle autofill */}
          <form onSubmit={handleLogin} method="post" className="space-y-4">
            <CustomInput
              label="Phone Number"
              type="tel"
              name="username"
              autoComplete="username"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="911234567"
              required
              inlinePrefix={
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  <span>+251</span>
                </div>
              }
            />

            <div className="relative">
              <CustomInput
                ref={passwordInputRef}
                label="Password"
                icon={Lock}
                name="password"
                autoComplete="current-password"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs font-medium text-primary hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSubmitPhone={handlePhoneSubmitted}
      />

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        phoneNumber={recoveryPhone}
        onClose={() => setIsOtpModalOpen(false)}
        onVerified={handleOtpVerified}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onPasswordResetSuccess={handlePasswordResetSuccess}
      />
    </>
  );
}