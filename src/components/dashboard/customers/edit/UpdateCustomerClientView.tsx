"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UpdateCustomerHeader from "./UpdateCustomerHeader";
import UpdateCustomerFormCard from "./UpdateCustomerFormCard";
import UpdateCustomerFormActions from "./UpdateCustomerFormActions";

interface UpdateCustomerClientViewProps {
  id?: string;
}

export default function UpdateCustomerClientView({
  id,
}: UpdateCustomerClientViewProps) {
  const router = useRouter();

  // Form State
  const [customerId, setCustomerId] = useState(id ? String(id) : "PT001");
  const [firstName, setFirstName] = useState("Saman");
  const [lastName, setLastName] = useState("Eliya");
  const [phone, setPhone] = useState("773409342");
  const [email, setEmail] = useState("saman@gmail.com");
  const [address, setAddress] = useState("Galle");
  const [date, setDate] = useState("08/09/2027");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerOptions = useMemo(
    () => [
      "PT001",
      "PT002",
      "PT003",
      "PT004",
      "PT005",
      "PT006",
      "PT007",
      "PT008",
      "PT009",
      "PT010",
    ],
    []
  );

  function handleRefresh() {
    setFirstName("Saman");
    setLastName("Eliya");
    setPhone("773409342");
    setEmail("saman@gmail.com");
    setAddress("Galle");
    setDate("08/09/2027");
  }

  function handleCancel() {
    router.push("/customers");
  }

  function handleUpdate() {
    if (!firstName.trim()) {
      toast.error("Please enter First Name.", { duration: 8000 });
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter Last Name.", { duration: 8000 });
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter Phone Number.", { duration: 8000 });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Customer ${customerId} (${firstName} ${lastName}) updated successfully!`, { duration: 5000 });
      router.push("/customers");
    }, 500);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <UpdateCustomerHeader
        onRefresh={handleRefresh}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* 2. Form Card */}
      <div className="space-y-4">
        <UpdateCustomerFormCard
          customerId={customerId}
          onCustomerIdChange={setCustomerId}
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
          customerOptions={customerOptions}
        />

        {/* 3. Actions */}
        <UpdateCustomerFormActions
          onCancel={handleCancel}
          onUpdate={handleUpdate}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  );
}
