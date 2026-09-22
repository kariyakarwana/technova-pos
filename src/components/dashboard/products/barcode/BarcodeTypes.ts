export type BarcodeProductItem = {
  id: string;
  sku: string;
  name: string;
  barcodeCode: string | null;
  price: number;
  stock: number;
  productImage: string;
};

export type BarcodeLabelSettings = {
  paperSize: "36mm" | "50mm" | "70mm";
  showName: boolean;
  showSku: boolean;
  showPrice: boolean;
  showValue: boolean;
};
