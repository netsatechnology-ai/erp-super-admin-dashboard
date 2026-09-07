"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/custom-input";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  }) => void;
  availableRoles: string[];
}

export function AddUserModal({
  isOpen,
  onClose,
  onAddUser,
  availableRoles,
}: AddUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(availableRoles[0] || "Merchant Manager");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    onAddUser({ firstName, lastName, email, phone, role });
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRole(availableRoles[0] || "Merchant Manager");
    onClose();
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
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
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
              required
            />
            <CustomInput
              label="Last Name"
              placeholder="e.g. Bikila"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <CustomInput
            label="Email Address"
            type="email"
            placeholder="abebe@netsatech.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <CustomInput
            label="Phone Number"
            type="tel"
            placeholder="+251 911 234 567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </div>
    </div>
  );
}