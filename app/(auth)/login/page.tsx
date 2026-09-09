"use client";

import { useState } from "react";
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

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State Control
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 86400;
    document.cookie = `session_token=mock_admin_token; path=/; max-age=${maxAge}; SameSite=Lax`;

    router.push("/dashboard");

    router.refresh();
    // setIsLoading(true);

    // dispatch(showLoader("Authenticating credentials..."));


    // const data = {
    //   phoneNumber: `+251${phone}`,
    //   password: password,
    // };

    // AuthService.logIn(data)
    //   .then((response) => {
    //     dispatch(hideLoader());

    //     if (response) {
    //       const fullPhoneNumber = `+251${phone}`;
    //       const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 86400;
    //       document.cookie = `session_token=mock_admin_token; path=/; max-age=${maxAge}; SameSite=Lax`;

    //       // Show Success Modal before redirecting
    //       dispatch(
    //         showResponseModal({
    //           status: "success",
    //           title: "Welcome Back!",
    //           message: "Authentication successful. Redirecting to dashboard...",
    //           buttonText: "Proceed",
    //           onConfirm: () => {
    //             router.push("/dashboard");
    //             router.refresh();
    //           },
    //         })
    //       );
    //     } else {
    //       // Show Error Modal
    //       dispatch(
    //         showResponseModal({
    //           status: "error",
    //           title: "Login Failed",
    //           message: "Invalid phone number or password. Please try again.",
    //           buttonText: "Try Again",
    //         })
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     dispatch(hideLoader());
    //     dispatch(
    //       showResponseModal({
    //         status: "error",
    //         title: "Network Error",
    //         message: "Unable to reach the server. Please check your connection.",
    //       })
    //     );

    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //          const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 86400;
    //       document.cookie = `session_token=mock_admin_token; path=/; max-age=${maxAge}; SameSite=Lax`;
    //   });
  };

  // Step 1: Phone Submitted -> Open OTP Modal
  const handlePhoneSubmitted = (fullPhone: string) => {
    setRecoveryPhone(fullPhone);
    setIsForgotModalOpen(false);
    setIsOtpModalOpen(true);
  };

  // Step 2: OTP Verified -> Open Reset Password Modal
  const handleOtpVerified = () => {
    setIsOtpModalOpen(false);
    setIsResetModalOpen(true);
  };

  // Step 3: Password Updated -> Close Reset Modal & Prompt Sign In
  const handlePasswordResetSuccess = () => {
    setIsResetModalOpen(false);
    console.log("Password successfully reset for", recoveryPhone);
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
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone Input with Separate +251 Box */}
            <CustomInput
              label="Phone Number"
              type="tel"
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

            {/* Password Input with Eye Toggle */}
            <div className="relative">
              <CustomInput
                label="Password"
                icon={Lock}
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

            {/* Remember Me & Forgot Password Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">Remember me</span>
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

      {/* 1. Phone Input Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSubmitPhone={handlePhoneSubmitted}
      />

      {/* 2. 6-Digit OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        phoneNumber={recoveryPhone}
        onClose={() => setIsOtpModalOpen(false)}
        onVerified={handleOtpVerified}
      />

      {/* 3. Set New Password Modal */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onPasswordResetSuccess={handlePasswordResetSuccess}
      />
    </>
  );
}