"use client";

import { LayoutGrid, Package } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet, apiPost } from "@/lib/api/client";
import { CategorySidebar } from "./CategorySidebar";
import { useOfflineMode } from "./OfflineContext";
import { ProductCatalogGrid } from "./ProductCatalogGrid";
import { PosHeader } from "./PosHeader";
import { PosOrderPanel } from "./PosOrderPanel";
import type { CartItem, Product } from "./pos.mock";

type ApiProduct = {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  sellingPrice: number | string;
  images: Array<{ url: string }>;
  trackSerials: boolean;
  category: { name: string } | null;
  stockLevels: Array<{
    quantityOnHand: number | string;
    quantityReserved: number | string;
  }>;
};
type Customer = {
  id: string;
  customerNumber: string;
  firstName: string;
  lastName: string | null;
  creditLimit: number | string;
  currentBalance: number | string;
  storeCreditAccount: { balance: number | string } | null;
  loyaltyAccount: { points: number | string } | null;
};
type Quote = {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
};
const emptyQuote: Quote = {
  subtotal: 0,
  discountTotal: 0,
  taxTotal: 0,
  total: 0,
};

function LivePos() {
  const { branchId, branch } = useBranch();
  const { isOffline } = useOfflineMode();
  const [products, setProducts] = useState<Product[]>([]),
    [customers, setCustomers] = useState<Customer[]>([]),
    [cart, setCart] = useState<CartItem[]>([]),
    [category, setCategory] = useState("All"),
    [search, setSearch] = useState(""),
    [barcode, setBarcode] = useState(""),
    [customerId, setCustomerId] = useState(""),
    [quote, setQuote] = useState<Quote>(emptyQuote),
    [paid, setPaid] = useState(0),
    [paymentMethod, setPaymentMethod] = useState("CASH"),
    [credit, setCredit] = useState(false),
    [dueDate, setDueDate] = useState(""),
    [message, setMessage] = useState<string | null>(null),
    [catalogError, setCatalogError] = useState<string | null>(null),
    [customerError, setCustomerError] = useState<string | null>(null),
    [loadingProducts, setLoadingProducts] = useState(false),
    [receipt, setReceipt] = useState<{
      invoiceNumber: string;
      receiptNumber: string;
      total: number;
    } | null>(null);
  const load = useCallback(async () => {
    setCatalogError(null);
    setCustomerError(null);
    if (!branchId) {
      setProducts([]);
      setCatalogError(
        "No active branch is assigned. Select or assign a branch before opening POS.",
      );
      return;
    }
    setLoadingProducts(true);
    try {
      const context = await apiGet<{
        products: ApiProduct[];
        customers: Customer[];
      }>(`/sales/pos-context?branchId=${encodeURIComponent(branchId)}`);
      const rows = Array.isArray(context.products) ? context.products : [];
      setProducts(
        rows.map((item) => {
          const levels = Array.isArray(item.stockLevels)
            ? item.stockLevels
            : [];
          const images = Array.isArray(item.images) ? item.images : [];
          const stock =
            Number(levels[0]?.quantityOnHand ?? 0) -
            Number(levels[0]?.quantityReserved ?? 0);
          return {
            id: item.id,
            sku: item.sku,
            barcode: item.barcode,
            name: item.name,
            price: Number(item.sellingPrice),
            stockCount: stock,
            category: item.category?.name ?? "Uncategorized",
            image: images[0]?.url ?? "/technova-logo.svg",
            inStockFormatted: `${stock} Pcs`,
            trackSerials: item.trackSerials,
          };
        }),
      );
      setCustomers(Array.isArray(context.customers) ? context.customers : []);
    } catch (error) {
      setProducts([]);
      setCustomers([]);
      setCatalogError(
        error instanceof Error ? error.message : "Unable to load POS products.",
      );
    } finally {
      setLoadingProducts(false);
    }
  }, [branchId]);
  useEffect(() => {
    void load();
  }, [load]);
  const categories = useMemo(
    () => [
      { id: "All", label: "All", icon: LayoutGrid },
      ...Array.from(new Set(products.map((item) => item.category))).map(
        (name) => ({ id: name, label: name, icon: Package }),
      ),
    ],
    [products],
  );
  const filtered = useMemo(
    () =>
      products.filter(
        (item) =>
          (category === "All" || item.category === category) &&
          `${item.name} ${item.sku ?? ""} ${item.barcode ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [category, products, search],
  );
  function add(product: Product) {
    if (product.stockCount <= 0)
      return setMessage(`${product.name} is out of stock.`);
    setMessage(null);
    setCart((current) => {
      if (product.trackSerials)
        return [
          ...current,
          {
            id: crypto.randomUUID(),
            productId: product.id,
            name: product.name,
            price: product.price,
            stockCount: product.stockCount,
            qty: 1,
            image: product.image,
            trackSerials: true,
            serialNumber: "",
          },
        ];
      const found = current.find((item) => item.productId === product.id);
      return found
        ? current.map((item) =>
            item.id === found.id
              ? { ...item, qty: Math.min(item.qty + 1, product.stockCount) }
              : item,
          )
        : [
            ...current,
            {
              id: product.id,
              productId: product.id,
              name: product.name,
              price: product.price,
              stockCount: product.stockCount,
              qty: 1,
              image: product.image,
            },
          ];
    });
  }
  function scan() {
    const value = barcode.trim().toLowerCase();
    const product = products.find(
      (item) =>
        item.barcode?.toLowerCase() === value ||
        item.sku?.toLowerCase() === value,
    );
    if (!product)
      return setMessage(`No active product matches “${barcode.trim()}”.`);
    add(product);
    setBarcode("");
  }
  const items = useMemo(
    () =>
      cart.map((item) => ({
        productId: item.productId ?? item.id,
        quantity: item.qty,
        serialNumber: item.trackSerials ? item.serialNumber : undefined,
      })),
    [cart],
  );
  useEffect(() => {
    if (!items.length) {
      setQuote(emptyQuote);
      return;
    }
    if (isOffline) {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      );
      setQuote({ subtotal, discountTotal: 0, taxTotal: 0, total: subtotal });
      setPaid(subtotal);
      return;
    }
    const timer = setTimeout(
      () =>
        void apiPost<Quote>("/sales/quote", { items })
          .then((result) => {
            setQuote(result);
            setPaid(result.total);
          })
          .catch((error) =>
            setMessage(
              error instanceof Error
                ? error.message
                : "Unable to calculate order.",
            ),
          ),
      200,
    );
    return () => clearTimeout(timer);
  }, [cart, isOffline, items]);
  async function checkout() {
    if (!branchId || !cart.length) return;
    if (paid < 0) return setMessage("Paid amount cannot be negative.");
    if (!credit && paid < quote.total)
      return setMessage("Use customer credit for a partial payment.");
    if (paid > quote.total)
      return setMessage("Paid amount cannot exceed the order total.");
    if (cart.some((item) => item.trackSerials && !item.serialNumber?.trim()))
      return setMessage(
        "Enter the serial number for every serialized product.",
      );
    if (paymentMethod === "STORE_CREDIT" && !customerId)
      return setMessage("Select a registered customer to use store credit.");
    const selectedCustomer = customers.find((item) => item.id === customerId);
    if (
      paymentMethod === "STORE_CREDIT" &&
      Number(selectedCustomer?.storeCreditAccount?.balance ?? 0) < paid
    )
      return setMessage("The customer does not have enough store credit.");
    if (credit && (!customerId || !dueDate))
      return setMessage(
        "Select a customer and due date for a credit purchase.",
      );
    const creditAmount = quote.total - paid;
    const availableCredit = Number(selectedCustomer?.creditLimit ?? 0) - Number(selectedCustomer?.currentBalance ?? 0);
    if (credit && creditAmount > availableCredit + 0.01)
      return setMessage(`Customer credit limit exceeded. Available credit is LKR ${Math.max(0, availableCredit).toLocaleString()}.`);
    if (credit && new Date(dueDate).getTime() <= Date.now())
      return setMessage("Credit due date must be in the future.");
    const payload = {
      branchId,
      customerId: customerId || undefined,
      items,
      payments: paid > 0 ? [{ method: paymentMethod, amount: paid }] : [],
      credit: credit
        ? {
            dueDate: new Date(dueDate).toISOString(),
            notes: "POS credit checkout",
          }
        : undefined,
    };
    if (isOffline) {
      const queue = JSON.parse(
        localStorage.getItem("technova_pos_queue") ?? "[]",
      ) as unknown[];
      queue.push({
        clientOperationId: crypto.randomUUID(),
        operationType: "SALE_CREATE",
        clientTimestamp: new Date().toISOString(),
        payload,
      });
      localStorage.setItem("technova_pos_queue", JSON.stringify(queue));
      setCart([]);
      setQuote(emptyQuote);
      return setMessage("Sale stored locally for synchronization.");
    }
    try {
      const result = await apiPost<{
        invoiceNumber: string;
        receiptNumber: string;
        total: number;
      }>("/sales", payload);
      setReceipt(result);
      setCart([]);
      setQuote(emptyQuote);
      setMessage("Sale completed successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout failed.");
    }
  }
  const emptyMessage =
    catalogError ??
    (!branchId
      ? "Select an active branch to load products."
      : products.length === 0
        ? "No active products exist for this organization. Add products in Product Management."
        : "No products match the current category or search.");
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#F9F9FF]">
      <PosHeader
        searchQuery={search}
        onSearchChange={setSearch}
        onViewAllCategories={() => setCategory("All")}
        isOffline={isOffline}
        barcodeValue={barcode}
        onBarcodeChange={setBarcode}
        onBarcodeSubmit={scan}
        branchName={branch?.name}
      />
      {(catalogError || customerError) && (
        <div className="flex flex-wrap gap-2 border-b bg-amber-50 px-4 py-2 text-[11px] text-amber-800">
          {catalogError && (
            <span>
              <b>Products:</b> {catalogError}
            </span>
          )}
          {customerError && (
            <span>
              <b>Customers:</b> {customerError}
            </span>
          )}
          <button
            type="button"
            onClick={() => void load()}
            className="ml-auto font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <CategorySidebar
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
        <ProductCatalogGrid
          products={filtered}
          cartItems={cart}
          onAdd={add}
          loading={loadingProducts}
          emptyMessage={emptyMessage}
        />
        <PosOrderPanel
          cartItems={cart}
          isOffline={isOffline}
          customers={customers}
          customerId={customerId}
          quote={quote}
          paid={paid}
          paymentMethod={paymentMethod}
          credit={credit}
          dueDate={dueDate}
          message={message}
          receipt={receipt}
          onCustomerChange={setCustomerId}
          onUpdateQty={(id, delta) =>
            setCart((current) =>
              current.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      qty: Math.max(
                        1,
                        Math.min(item.stockCount, item.qty + delta),
                      ),
                    }
                  : item,
              ),
            )
          }
          onRemoveItem={(id) =>
            setCart((current) => current.filter((item) => item.id !== id))
          }
          onClearCart={() => setCart([])}
          onUpdateSerial={(id, serialNumber) =>
            setCart((current) =>
              current.map((item) =>
                item.id === id ? { ...item, serialNumber } : item,
              ),
            )
          }
          onPaidChange={setPaid}
          onPaymentMethodChange={setPaymentMethod}
          onCreditChange={(enabled) => {
            setCredit(enabled);
            setPaid(enabled ? 0 : quote.total);
            if (!enabled) setDueDate("");
          }}
          onDueDateChange={setDueDate}
          onCheckout={() => void checkout()}
        />
      </div>
    </div>
  );
}

export function PosClientView() {
  return <LivePos />;
}
export default PosClientView;
