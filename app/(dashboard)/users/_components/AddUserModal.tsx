"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/CustomInput";
import { UserService } from "@/services/UserService"; 
import { hideLoader, showLoader } from "@/lib/redux/slices/loadingSlice";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";


export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status?: string;
  createdAt?: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: User) => void;
  availableRoles: string[];
}

export function AddUserModal({
  isOpen,
  onClose,
  onAddUser,
  availableRoles,
}: AddUserModalProps) {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(availableRoles[0] || "Merchant Manager");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRole(availableRoles[0] || "Merchant Manager");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    dispatch(showLoader());

    try {
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        role,
      };

      const response = await UserService.addUser(payload);

      dispatch(hideLoader());

      if (response) {
        const createdUser: User = response.data || {
          id: response.data?.id || `usr-${Date.now()}`,
          firstName,
          lastName,
          email,
          phone,
          role,
          status: "ACTIVE",
          createdAt: new Date().toISOString().split("T")[0],
        };

        onAddUser(createdUser);
        handleResetAndClose();

        dispatch(
          showResponseModal({
            status: "success",
            title: "User Created",
            message: `User account for "${firstName} ${lastName}" has been successfully created.`,
            buttonText: "Done",
          })
        );
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            title: "Creation Failed",
            message: "Unable to create user account. Please try again.",
            buttonText: "Try Again",
          })
        );
      }
    } catch (error: any) {
      dispatch(hideLoader());

      const status = error?.response?.status;
      let errorMessage = "An error occurred while connecting to UserService.";

      if (status === 404) {
        errorMessage =
          "The user creation endpoint was not found on the server. Please verify the API route configuration.";
      } else if (error?.response?.data) {
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
          title: status ? `Request Error (${status})` : "Registration Error",
          message: errorMessage,
          buttonText: "Close",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Add New User</h3>
              <p className="text-xs text-muted-foreground">
                Grant portal access and assign system roles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <CustomInput
              label="First Name"
              placeholder="e.g. Abebe"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <CustomInput
              label="Last Name"
              placeholder="e.g. Bikila"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <CustomInput
            label="Email Address"
            type="email"
            placeholder="abebe@netsatech.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <CustomInput
            label="Phone Number"
            type="tel"
            placeholder="+251 911 234 567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSubmitting}
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetAndClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}