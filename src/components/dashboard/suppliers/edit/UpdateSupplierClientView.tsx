"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UpdateSupplierHeader from "./UpdateSupplierHeader";
import UpdateSupplierInformationCard from "./UpdateSupplierInformationCard";
import UpdateSupplierContactDetailsCard from "./UpdateSupplierContactDetailsCard";
import UpdateSupplierFinancialDetailsCard from "./UpdateSupplierFinancialDetailsCard";
import UpdateSupplierFormActions from "./UpdateSupplierFormActions";
import { apiGet, apiPatch } from "@/lib/api/client";

interface UpdateSupplierClientViewProps {
  id?: string;
}

export default function UpdateSupplierClientView({
  id,
}: UpdateSupplierClientViewProps) {
  const router = useRouter();

  // Initial prefilled values
  const [isPreferred, setIsPreferred] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [supplierId] = useState(id ? String(id) : "SUP-1001");
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
  const [portalEnabled, setPortalEnabled] = useState(false);
  const [allowOrderChanges, setAllowOrderChanges] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiGet<{
      name: string; contactName: string | null; email: string | null; phone: string | null;
      address: Record<string, string> | null; portalEnabled: boolean;
      allowOrderChanges: boolean | null; emailNotificationsEnabled: boolean | null;
      inAppNotificationsEnabled: boolean | null;
    }>(`/suppliers/${id}`).then((supplier) => {
      const values = supplier.address ?? {};
      setCompanyName(supplier.name);
      setContactName(supplier.contactName ?? "");
      setEmail(supplier.email ?? "");
      setPhone(supplier.phone ?? "");
      setAddress(values.address ?? ""); setCity(values.city ?? "");
      setState(values.state ?? ""); setZipCode(values.zipCode ?? "");
      setWebsite(values.website ?? ""); setDescription(values.description ?? "");
      setTaxId(values.taxId ?? ""); setPaymentTerms(values.paymentTerms ?? "Net 30");
      setCreditLimit(values.creditLimit ?? ""); setIsPreferred(values.preferred === "true");
      setPortalEnabled(supplier.portalEnabled);
      setAllowOrderChanges(supplier.allowOrderChanges ?? true);
      setEmailNotificationsEnabled(supplier.emailNotificationsEnabled ?? true);
      setInAppNotificationsEnabled(supplier.inAppNotificationsEnabled ?? true);
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load supplier."));
  }, [id]);

  function handleCancel() {
    router.push("/suppliers/management");
  }

  function handleSaveDraft() {
    setMessage("Supplier drafts are not enabled. Save the updates when they are ready.");
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
      await apiPatch(`/suppliers/${id}`, {
        name: companyName.trim(), contactName: contactName.trim(), email: email.trim(),
        phone: phone.trim() || undefined,
        address: { address, city, state, zipCode, website, description, taxId, paymentTerms, creditLimit, preferred: String(isPreferred) },
        portalEnabled, allowOrderChanges, emailNotificationsEnabled, inAppNotificationsEnabled,
      });
      router.push(`/suppliers/${id}`); router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update supplier.");
    } finally {
      setIsSubmitting(false);
    }
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
        {message && <div role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">{message}</div>}
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

        <section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xs">
          <h2 className="font-bold text-slate-900">Supplier portal access</h2>
          <p className="mt-1 text-sm text-slate-500">Enabling access for the first time creates the supplier login and emails a temporary password. Disabling it immediately blocks that login.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Supplier login enabled", portalEnabled, setPortalEnabled],
              ["Allow proposed order changes", allowOrderChanges, setAllowOrderChanges],
              ["Email notifications", emailNotificationsEnabled, setEmailNotificationsEnabled],
              ["In-app notifications", inAppNotificationsEnabled, setInAppNotificationsEnabled],
            ].map(([label, checked, setter]) => <label key={String(label)} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-700">{String(label)}<input type="checkbox" checked={Boolean(checked)} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} className="h-4 w-4 accent-[#0E9384]" /></label>)}
          </div>
        </section>

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
