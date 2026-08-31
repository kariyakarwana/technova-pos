export interface BarcodeProductItem {
  id: string;
  sku: string;
  name: string;
  brandName: string;
  description: string;
  barcodeCode: string;
  createdBy: string;
  productImage: string;
  avatarImage: string;
}

export const MOCK_BARCODE_PRODUCTS: BarcodeProductItem[] = [
  { id: "1", sku: "PT001", name: "Lenovo IdeaPad 3", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "James Kirwin", productImage: "https://picsum.photos/seed/lenovo3/40/40", avatarImage: "https://picsum.photos/seed/james/32/32" },
  { id: "2", sku: "PT002", name: "Beats Pro", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "Francis Chang", productImage: "https://picsum.photos/seed/beatspro/40/40", avatarImage: "https://picsum.photos/seed/francis/32/32" },
  { id: "3", sku: "PT003", name: "Nike Jordan", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "Antonio Engle", productImage: "https://picsum.photos/seed/nikejordan/40/40", avatarImage: "https://picsum.photos/seed/antonio/32/32" },
  { id: "4", sku: "PT004", name: "Apple Series 5 Watch", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "Leo Kelly", productImage: "https://picsum.photos/seed/applewatch5/40/40", avatarImage: "https://picsum.photos/seed/leokelly/32/32" },
  { id: "5", sku: "PT005", name: "Amazon Echo Dot", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "Annette Walker", productImage: "https://picsum.photos/seed/echodot/40/40", avatarImage: "https://picsum.photos/seed/annette/32/32" },
  { id: "6", sku: "PT006", name: "Sanford Chair Sofa", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "John Weaver", productImage: "https://picsum.photos/seed/sanfordchair/40/40", avatarImage: "https://picsum.photos/seed/johnw/32/32" },
  { id: "7", sku: "PT007", name: "Red Premium Satchel", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "Gary Hennessy", productImage: "https://picsum.photos/seed/satchel/40/40", avatarImage: "https://picsum.photos/seed/gary/32/32" },
  { id: "8", sku: "PT008", name: "Iphone 14 Pro", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "Eleanor Panek", productImage: "https://picsum.photos/seed/iphone14pro/40/40", avatarImage: "https://picsum.photos/seed/eleanor/32/32" },
  { id: "9", sku: "PT009", name: "Gaming Chair", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "William Levy", productImage: "https://picsum.photos/seed/gamingchair/40/40", avatarImage: "https://picsum.photos/seed/william/32/32" },
  { id: "10", sku: "PT010", name: "Borealis Backpack", brandName: "Pc", description: "Pc", barcodeCode: "463-789-1234", createdBy: "Charlotte Klotz", productImage: "https://picsum.photos/seed/borealis/40/40", avatarImage: "https://picsum.photos/seed/charlotte/32/32" },
];

export const TOTAL_BARCODE_PAGES = 15;
