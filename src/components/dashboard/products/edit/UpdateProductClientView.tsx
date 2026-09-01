"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UpdateProductHeader from "./UpdateProductHeader";
import UpdateProductInfoCard from "./UpdateProductInfoCard";
import UpdateProductPricingCard from "./UpdateProductPricingCard";
import UpdateProductImagesCard from "./UpdateProductImagesCard";
import UpdateProductCustomFieldsCard from "./UpdateProductCustomFieldsCard";
import UpdateProductFormActions from "./UpdateProductFormActions";

export default function UpdateProductClientView() {
  const router = useRouter();

  // Form State with pre-filled mock data
  const [productName, setProductName] = useState("Lenovo IdeaPad 3");
  const [slug, setSlug] = useState("lenovo-ideapad-3");
  const [sku, setSku] = useState("PT001");
  const [itemCode, setItemCode] = useState("IC-8821");
  const [description, setDescription] = useState("");

  const [productType, setProductType] = useState<"single" | "variable">("single");
  const [quantity, setQuantity] = useState("100");
  const [price, setPrice] = useState("600");
  const [taxType, setTaxType] = useState("Exclusive");
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState("0");
  const [quantityAlert, setQuantityAlert] = useState("10");

  const [warranties, setWarranties] = useState(true);
  const [manufacturer, setManufacturer] = useState(true);
  const [expiry, setExpiry] = useState(true);
  const [warrantyValue, setWarrantyValue] = useState("1 Year");
  const [manufacturerName, setManufacturerName] = useState("Lenovo");
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

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Product "${productName}" updated successfully!`);
      router.push("/products/product-list");
    }, 500);
  }

  return (
    <div className="min-h-screen bg-[var(--brand-app-bg)]">
      <div className="p-6 space-y-6 pb-28">
        {/* Header */}
        <UpdateProductHeader />

        {/* Section Cards Stack */}
        <div className="space-y-4">
          <UpdateProductInfoCard
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

          <UpdateProductPricingCard
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

          <UpdateProductImagesCard />

          <UpdateProductCustomFieldsCard
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
      <UpdateProductFormActions
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
