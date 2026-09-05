"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddSupplierHeader from "./AddSupplierHeader";
import SupplierInformationCard from "./SupplierInformationCard";
import SupplierContactDetailsCard from "./SupplierContactDetailsCard";
import SupplierFinancialDetailsCard from "./SupplierFinancialDetailsCard";
import AddSupplierFormActions from "./AddSupplierFormActions";
import { apiPost } from "@/lib/api/client";

export default function AddSupplierClientView() {
  const router = useRouter();

  // State
  const [isPreferred, setIsPreferred] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [supplierId] = useState(() => `SUP-${Date.now().toString().slice(-8)}`);
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
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [allowOrderChanges, setAllowOrderChanges] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  function handleCancel() {
    router.push("/suppliers");
  }

  function handleSaveDraft() {
    setMessage("Supplier drafts are not enabled. Use Save & Create when the details are ready.");
  }

  async function handleSaveCreate() {
    if (!companyName.trim()) {
      setMessage("Please enter a Company Name.");
      return;
    }
    if (!contactName.trim()) {
      setMessage("Please enter a Primary Contact Name.");
      return;
    }
    if (!email.trim()) {
      setMessage("Please enter a valid Email Address.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      await apiPost("/suppliers", {
        code: supplierId,
        name: companyName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: {
          address,
          city,
          state,
          zipCode,
          website,
          description,
          taxId,
          paymentTerms,
          creditLimit,
          preferred: String(isPreferred),
        },
        portalEnabled,
        allowOrderChanges,
        emailNotificationsEnabled,
        inAppNotificationsEnabled,
      });
      router.push("/suppliers/management");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create supplier.");
    } finally {
      setIsSubmitting(false);
    }
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
        {message && <div role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">{message}</div>}
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

        <section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xs">
          <h2 className="font-bold text-slate-900">Supplier portal access</h2>
          <p className="mt-1 text-sm text-slate-500">When enabled, a secure temporary password is generated and emailed to this supplier contact.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Create supplier login", portalEnabled, setPortalEnabled],
              ["Allow proposed order changes", allowOrderChanges, setAllowOrderChanges],
              ["Email notifications", emailNotificationsEnabled, setEmailNotificationsEnabled],
              ["In-app notifications", inAppNotificationsEnabled, setInAppNotificationsEnabled],
            ].map(([label, checked, setter]) => (
              <label key={String(label)} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-700">
                {String(label)}
                <input type="checkbox" checked={Boolean(checked)} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} className="h-4 w-4 accent-[#0E9384]" />
              </label>
            ))}
          </div>
        </section>

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
