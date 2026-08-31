"use client";

import { useMemo, useState } from "react";
import StockReceiptHeader from "./StockReceiptHeader";
import ReceiptDetailsCard from "./ReceiptDetailsCard";
import StockReceiveScanBar from "./StockReceiveScanBar";
import StockReceiveTable, { type ReceivedItem } from "./StockReceiveTable";
import StockReceiveSummaryFooter from "./StockReceiveSummaryFooter";

const INITIAL_RECEIVED_ITEMS: ReceivedItem[] = [
  {
    id: "1",
    name: "ThinkPad X1 Carbon Gen 10",
    sku: "SKU-TPX1-10G",
    receivedQty: 15,
    unitPrice: 1250.0,
    expiryDate: "",
  },
  {
    id: "2",
    name: "Dell UltraSharp 27 Monitor",
    sku: "SKU-DELL-U27",
    receivedQty: 30,
    unitPrice: 450.0,
    expiryDate: "",
  },
  {
    id: "3",
    name: "Logitech MX Master 3S",
    sku: "SKU-LOGI-MX3S",
    receivedQty: 50,
    unitPrice: 85.0,
    expiryDate: "",
  },
];

export default function StockReceiveClientView() {
  const [items, setItems] = useState<ReceivedItem[]>(INITIAL_RECEIVED_ITEMS);
  const [scanInput, setScanInput] = useState("");

  function handleQtyChange(id: string, qty: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, receivedQty: qty } : item))
    );
  }

  function handleUnitPriceChange(id: string, price: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unitPrice: price } : item))
    );
  }

  function handleExpiryChange(id: string, expiry: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, expiryDate: expiry } : item))
    );
  }

  function handleSearchSubmit() {
    if (!scanInput.trim()) return;

    const trimmed = scanInput.trim();
    // If item already exists, increment qty
    const existingIndex = items.findIndex(
      (item) =>
        item.sku.toLowerCase() === trimmed.toLowerCase() ||
        item.name.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (existingIndex >= 0) {
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, receivedQty: item.receivedQty + 1 }
            : item
        )
      );
    } else {
      // Add as new received item
      const newItem: ReceivedItem = {
        id: String(Date.now()),
        name: trimmed,
        sku: `SKU-${trimmed.toUpperCase().replace(/\s+/g, "-").slice(0, 8)}`,
        receivedQty: 1,
        unitPrice: 100.0,
        expiryDate: "",
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setScanInput("");
  }

  const { totalItems, totalSkus, totalValue } = useMemo(() => {
    let itemsSum = 0;
    let valueSum = 0;

    for (const item of items) {
      itemsSum += item.receivedQty;
      valueSum += item.receivedQty * item.unitPrice;
    }

    return {
      totalItems: itemsSum,
      totalSkus: items.length,
      totalValue: valueSum,
    };
  }, [items]);

  function handleConfirmStock() {
    alert(
      `Stock Receipt Confirmed!\nTotal Items: ${totalItems} (${totalSkus} SKUs)\nTotal Value: $${totalValue.toLocaleString(
        "en-US",
        { minimumFractionDigits: 2 }
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">
      {/* 1. Page Header with Breadcrumbs */}
      <StockReceiptHeader />

      {/* 2. Top Card: Receipt Details */}
      <ReceiptDetailsCard onConfirm={handleConfirmStock} />

      {/* 3. Bottom Card: Receiving Barcode Scanner & Table */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs flex flex-col justify-between">
        {/* Scanner Bar */}
        <StockReceiveScanBar
          scanInput={scanInput}
          onScanInputChange={setScanInput}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Data Table */}
        <StockReceiveTable
          items={items}
          onQtyChange={handleQtyChange}
          onUnitPriceChange={handleUnitPriceChange}
          onExpiryChange={handleExpiryChange}
        />

        {/* Highlighted Footer Summary Strip */}
        <StockReceiveSummaryFooter
          totalItems={totalItems}
          totalSkus={totalSkus}
          totalValue={totalValue}
        />
      </div>
    </main>
  );
}
