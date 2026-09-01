"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddProductHeader from "./AddProductHeader";
import AddProductInfoCard from "./AddProductInfoCard";
import AddProductPricingCard from "./AddProductPricingCard";
import AddProductImagesCard from "./AddProductImagesCard";
import AddProductCustomFieldsCard from "./AddProductCustomFieldsCard";
import AddProductFormActions from "./AddProductFormActions";

export default function AddProductClientView() {
  const router = useRouter();

  // Form State
  const [productName, setProductName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [description, setDescription] = useState("");

  const [productType, setProductType] = useState<"single" | "variable">("single");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [taxType, setTaxType] = useState("Exclusive");
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [quantityAlert, setQuantityAlert] = useState("");

  const [warranties, setWarranties] = useState(true);
  const [manufacturer, setManufacturer] = useState(true);
  const [expiry, setExpiry] = useState(true);
  const [warrantyValue, setWarrantyValue] = useState("1 Year");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturedDate, setManufacturedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleGenerateSku() {
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  }

  function handleGenerateItemCode() {
    setItemCode(`IC-${Math.floor(1000 + Math.random() * 9000)}`);
  }

  function handleSubmit() {
    if (!productName.trim()) {
      alert("Please enter a Product Name.");
      return;
    }
    if (!price.trim()) {
      alert("Please enter a Price.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Product "${productName}" created successfully!`);
      router.push("/products/product-list");
    }, 500);
  }

  return (
    <div className="min-h-screen bg-[var(--brand-app-bg)]">
      <div className="p-6 space-y-6 pb-28">
        {/* Header */}
        <AddProductHeader />

        {/* Section Cards Stack */}
        <div className="space-y-4">
          <AddProductInfoCard
            productName={productName}
            onProductNameChange={setProductName}
            slug={slug}
            onSlugChange={setSlug}
            sku={sku}
            onSkuChange={setSku}
            onGenerateSku={handleGenerateSku}
            itemCode={itemCode}
            onItemCodeChange={setItemCode}
            onGenerateItemCode={handleGenerateItemCode}
            description={description}
            onDescriptionChange={setDescription}
          />

          <AddProductPricingCard
            productType={productType}
            onProductTypeChange={setProductType}
            quantity={quantity}
            onQuantityChange={setQuantity}
            price={price}
            onPriceChange={setPrice}
            taxType={taxType}
            onTaxTypeChange={setTaxType}
            discountType={discountType}
            onDiscountTypeChange={setDiscountType}
            discountValue={discountValue}
            onDiscountValueChange={setDiscountValue}
            quantityAlert={quantityAlert}
            onQuantityAlertChange={setQuantityAlert}
          />

          <AddProductImagesCard />

          <AddProductCustomFieldsCard
            warranties={warranties}
            onWarrantiesChange={setWarranties}
            manufacturer={manufacturer}
            onManufacturerChange={setManufacturer}
            expiry={expiry}
            onExpiryChange={setExpiry}
            warrantyValue={warrantyValue}
            onWarrantyValueChange={setWarrantyValue}
            manufacturerName={manufacturerName}
            onManufacturerNameChange={setManufacturerName}
            manufacturedDate={manufacturedDate}
            onManufacturedDateChange={setManufacturedDate}
            expiryDate={expiryDate}
            onExpiryDateChange={setExpiryDate}
          />
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <AddProductFormActions
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
