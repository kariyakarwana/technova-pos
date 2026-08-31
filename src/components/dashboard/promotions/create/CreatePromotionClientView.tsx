"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreatePromotionHeader from "./CreatePromotionHeader";
import PromotionInformationCard from "./PromotionInformationCard";
import DiscountConfigurationCard from "./DiscountConfigurationCard";
import CreatePromotionFormActions from "./CreatePromotionFormActions";

export default function CreatePromotionClientView() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generateCouponCode, setGenerateCouponCode] = useState(false);

  // Collapse states
  const [isInfoCollapsed, setIsInfoCollapsed] = useState(false);
  const [isDiscountCollapsed, setIsDiscountCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleCreate() {
    if (!name.trim()) {
      alert("Please enter a Promotion Name.");
      return;
    }
    if (!discountValue.trim()) {
      alert("Please enter a Discount Value.");
      return;
    }
    if (!startDate.trim()) {
      alert("Please enter a Start Date.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Promotion "${name}" created successfully!`);
      router.push("/promotions");
    }, 500);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <CreatePromotionHeader />

      {/* 2. Form Cards Stack */}
      <div className="space-y-6">
        {/* Promotion Information Card */}
        <PromotionInformationCard
          name={name}
          onNameChange={setName}
          description={description}
          onDescriptionChange={setDescription}
          isCollapsed={isInfoCollapsed}
          onToggleCollapse={() => setIsInfoCollapsed((prev) => !prev)}
        />

        {/* Discount Configuration Card */}
        <DiscountConfigurationCard
          discountType={discountType}
          onDiscountTypeChange={setDiscountType}
          discountValue={discountValue}
          onDiscountValueChange={setDiscountValue}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          generateCouponCode={generateCouponCode}
          onToggleGenerateCouponCode={() =>
            setGenerateCouponCode((prev) => !prev)
          }
          isCollapsed={isDiscountCollapsed}
          onToggleCollapse={() => setIsDiscountCollapsed((prev) => !prev)}
        />

        {/* 3. Form Actions */}
        <CreatePromotionFormActions
          onCreate={handleCreate}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  );
}
