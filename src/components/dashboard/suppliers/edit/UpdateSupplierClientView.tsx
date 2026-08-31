"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UpdateSupplierHeader from "./UpdateSupplierHeader";
import UpdateSupplierInformationCard from "./UpdateSupplierInformationCard";
import UpdateSupplierContactDetailsCard from "./UpdateSupplierContactDetailsCard";
import UpdateSupplierFinancialDetailsCard from "./UpdateSupplierFinancialDetailsCard";
import UpdateSupplierFormActions from "./UpdateSupplierFormActions";

interface UpdateSupplierClientViewProps {
  id?: string;
}

export default function UpdateSupplierClientView({
  id,
}: UpdateSupplierClientViewProps) {
  const router = useRouter();

  // Initial prefilled values
  const [isPreferred, setIsPreferred] = useState(true);
  const [companyName, setCompanyName] = useState("Global IT Traders");
  const [supplierId] = useState(id ? String(id) : "SUP-1001");
  const [description, setDescription] = useState(
    "Primary enterprise hardware provider for servers, switches, and high-performance NVMe storage modules."
  );

  const [contactName, setContactName] = useState("Sarah Chen");
  const [email, setEmail] = useState("schen@globalit.cn");
  const [phone, setPhone] = useState("+86 (123) 456-7890");
  const [website, setWebsite] = useState("https://www.globalittraders.cn");
  const [address, setAddress] = useState("123 Technology Blvd, Suite 400");
  const [city, setCity] = useState("Shenzhen");
  const [state, setState] = useState("Guangdong");
  const [zipCode, setZipCode] = useState("518000");

  const [taxId, setTaxId] = useState("VAT-88429910");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [creditLimit, setCreditLimit] = useState("25000.00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleCancel() {
    router.push("/suppliers/management");
  }

  function handleSaveDraft() {
    alert("Supplier updates saved as Draft.");
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
      alert(`Supplier "${companyName}" updated successfully!`);
      router.push("/suppliers/management");
    }, 600);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header with Preferred Toggle */}
      <UpdateSupplierHeader
        isPreferred={isPreferred}
        onTogglePreferred={setIsPreferred}
      />

      {/* 2. Form Stack */}
      <div className="space-y-6 max-w-5xl">
        {/* Card 1: Supplier Information */}
        <UpdateSupplierInformationCard
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          supplierId={supplierId}
          description={description}
          onDescriptionChange={setDescription}
        />

        {/* Card 2: Contact Details */}
        <UpdateSupplierContactDetailsCard
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
        <UpdateSupplierFinancialDetailsCard
          taxId={taxId}
          onTaxIdChange={setTaxId}
          paymentTerms={paymentTerms}
          onPaymentTermsChange={setPaymentTerms}
          creditLimit={creditLimit}
          onCreditLimitChange={setCreditLimit}
        />

        {/* Card 4: Action Buttons */}
        <UpdateSupplierFormActions
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
          onSaveCreate={handleSaveCreate}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  );
}
