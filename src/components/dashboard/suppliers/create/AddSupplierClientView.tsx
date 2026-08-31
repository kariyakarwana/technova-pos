"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddSupplierHeader from "./AddSupplierHeader";
import SupplierInformationCard from "./SupplierInformationCard";
import SupplierContactDetailsCard from "./SupplierContactDetailsCard";
import SupplierFinancialDetailsCard from "./SupplierFinancialDetailsCard";
import AddSupplierFormActions from "./AddSupplierFormActions";

export default function AddSupplierClientView() {
  const router = useRouter();

  // State
  const [isPreferred, setIsPreferred] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [supplierId] = useState("SUP-1006");
  const [description, setDescription] = useState("");

  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [taxId, setTaxId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [creditLimit, setCreditLimit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleCancel() {
    router.push("/suppliers");
  }

  function handleSaveDraft() {
    alert("Supplier saved as Draft.");
  }

  function handleSaveCreate() {
    if (!companyName.trim()) {
      alert("Please enter a Company Name.");
      return;
    }
    if (!contactName.trim()) {
      alert("Please enter a Primary Contact Name.");
      return;
    }
    if (!email.trim()) {
      alert("Please enter a valid Email Address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Supplier "${companyName}" created successfully!`);
      router.push("/suppliers/management");
    }, 600);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header with Preferred Toggle */}
      <AddSupplierHeader
        isPreferred={isPreferred}
        onTogglePreferred={setIsPreferred}
      />

      {/* 2. Form Stack */}
      <div className="space-y-6 max-w-5xl">
        {/* Card 1: Supplier Information */}
        <SupplierInformationCard
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          supplierId={supplierId}
          description={description}
          onDescriptionChange={setDescription}
        />

        {/* Card 2: Contact Details */}
        <SupplierContactDetailsCard
          contactName={contactName}
          onContactNameChange={setContactName}
          email={email}
          onEmailChange={setEmail}
          phone={phone}
          onPhoneChange={setPhone}
          website={website}
          onWebsiteChange={setWebsite}
          address={address}
          onAddressChange={setAddress}
          city={city}
          onCityChange={setCity}
          state={state}
          onStateChange={setState}
          zipCode={zipCode}
          onZipCodeChange={setZipCode}
        />

        {/* Card 3: Business & Financial Details */}
        <SupplierFinancialDetailsCard
          taxId={taxId}
          onTaxIdChange={setTaxId}
          paymentTerms={paymentTerms}
          onPaymentTermsChange={setPaymentTerms}
          creditLimit={creditLimit}
          onCreditLimitChange={setCreditLimit}
        />

        {/* Card 4: Action Buttons */}
        <AddSupplierFormActions
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
          onSaveCreate={handleSaveCreate}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  );
}
