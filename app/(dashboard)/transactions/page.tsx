"use client";
import  { useState } from "react";

import { TransactionHeaderKpi } from "./_components/TransactionHeaderKpi";
import { TransactionFilters } from "./_components/TransactionFilters";
import { TransactionTable } from "./_components/TransactionTable";
import { TransactionBottomCards } from "./_components/TransactionBottomCards";
import { TransactionItem } from "./types";

export const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx-1",
    invoiceNumber: "INV-2025-98421",
    ejNumber: "EJ 88492041",
    timestamp: "May 14, 2025 14:32:08 UTC",
    merchantName: "Central Cafe",
    tenantId: "Tenant #T-4421",
    merchantCode: "CC",
    customerName: "Binyam Tesfaye",
    customerPhone: "+251 91 123 4892",
    subtotal: 45.0,
    vatAmount: 6.75,
    totalAmount: 51.75,
    settlementStatus: "FULLY SETTLED",
    paymentMethod: "Cash",
    fiscalStatus: "FISCALIZED / VERIFIED",
    hashOrAck: "Hash: 84b7...d2a1",
  },
  {
    id: "tx-2",
    invoiceNumber: "INV-2025-98420",
    ejNumber: "EJ 88492040",
    timestamp: "May 14, 2025 14:30:19 UTC",
    merchantName: "Acme Supermarket",
    tenantId: "Tenant #T-1002",
    merchantCode: "AS",
    customerName: "Sara Mekonnen",
    customerPhone: "+251 92 841 0093",
    subtotal: 148.5,
    vatAmount: 22.28,
    totalAmount: 170.78,
    settlementStatus: "FULLY SETTLED",
    paymentMethod: "Telebirr",
    fiscalStatus: "FISCALIZED / VERIFIED",
    hashOrAck: "Hash: fc91...33e4",
  },
  {
    id: "tx-3",
    invoiceNumber: "INV-2025-98419",
    ejNumber: "EJ 88492039",
    timestamp: "May 14, 2025 14:28:44 UTC",
    merchantName: "Metro Pharmacy",
    tenantId: "Tenant #T-0843",
    merchantCode: "MP",
    customerName: "Walk-in Counter",
    customerPhone: "N/A (Cash Slip)",
    subtotal: 22.0,
    vatAmount: 3.3,
    totalAmount: 25.3,
    settlementStatus: "FULLY SETTLED",
    paymentMethod: "Card (Visa)",
    fiscalStatus: "FISCALIZED / VERIFIED",
    hashOrAck: "Hash: 119a...f478",
  },
  {
    id: "tx-4",
    invoiceNumber: "INV-2025-98418",
    ejNumber: "EJ 88492038",
    timestamp: "May 14, 2025 14:15:02 UTC",
    merchantName: "Velocity Motors",
    tenantId: "Tenant #T-0391",
    merchantCode: "VM",
    customerName: "Horizon Logistics Ltd",
    customerPhone: "TIN: 004928172",
    subtotal: 3200.0,
    vatAmount: 480.0,
    totalAmount: 3680.0,
    settlementStatus: "VERIFIED WIRE",
    paymentMethod: "Bank Transfer",
    fiscalStatus: "SYNCED",
    hashOrAck: "MoR ACK: #994821",
  },
];



export default function TransactionsPage() {
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState("ALL");
  const [selectedMethod, setSelectedMethod] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedMerchant("ALL");
    setSelectedMethod("ALL");
    setSelectedStatus("ALL");
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMerchant = selectedMerchant === "ALL" || tx.merchantName === selectedMerchant;
    const matchesMethod = selectedMethod === "ALL" || tx.paymentMethod === selectedMethod;
    const matchesStatus = selectedStatus === "ALL" || tx.fiscalStatus === selectedStatus;

    return matchesSearch && matchesMerchant && matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      <TransactionHeaderKpi />
      <TransactionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedMerchant={selectedMerchant}
        setSelectedMerchant={setSelectedMerchant}
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onReset={handleResetFilters}
      />
      <TransactionTable transactions={filteredTransactions} />
      <TransactionBottomCards />
    </div>
  );
}