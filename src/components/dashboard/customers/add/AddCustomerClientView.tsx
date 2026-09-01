"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddCustomerHeader from "./AddCustomerHeader";
import AddCustomerFormCard from "./AddCustomerFormCard";
import AddCustomerFormActions from "./AddCustomerFormActions";

export default function AddCustomerClientView() {
  const router = useRouter();

  // Helper to format today's date as dd/mm/yyyy
  const getTodayFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(getTodayFormatted());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleRefresh() {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setDate(getTodayFormatted());
  }

  function handleCancel() {
    router.push("/customers");
  }

  function handleAddCustomer() {
    if (!firstName.trim()) {
      alert("Please enter First Name.");
      return;
    }
    if (!lastName.trim()) {
      alert("Please enter Last Name.");
      return;
    }
    if (!phone.trim()) {
      alert("Please enter Phone Number.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Customer ${firstName} ${lastName} created successfully!`);
      router.push("/customers");
    }, 500);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <AddCustomerHeader
        onRefresh={handleRefresh}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* 2. Form Card */}
      <div className="space-y-4">
        <AddCustomerFormCard
          firstName={firstName}
          onFirstNameChange={setFirstName}
          lastName={lastName}
          onLastNameChange={setLastName}
          phone={phone}
          onPhoneChange={setPhone}
          email={email}
          onEmailChange={setEmail}
          address={address}
          onAddressChange={setAddress}
          date={date}
          onDateChange={setDate}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />

        {/* 3. Actions */}
        <AddCustomerFormActions
          onCancel={handleCancel}
          onSubmit={handleAddCustomer}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  );
}
