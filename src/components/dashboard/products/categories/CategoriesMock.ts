export interface CategoryItem {
  id: string;
  cid: string;
  category: string;
  description: string;
  status: string;
  createdBy: string;
  avatarImage: string;
}

export const MOCK_CATEGORIES: CategoryItem[] = [
  { id: "1", cid: "PT001", category: "Computers", description: "Lenovo", status: "Pc", createdBy: "James Kirwin", avatarImage: "https://picsum.photos/seed/james/32/32" },
  { id: "2", cid: "PT002", category: "Electronics", description: "Beats", status: "Pc", createdBy: "Francis Chang", avatarImage: "https://picsum.photos/seed/francis/32/32" },
  { id: "3", cid: "PT003", category: "Shoe", description: "Nike", status: "Pc", createdBy: "Antonio Engle", avatarImage: "https://picsum.photos/seed/antonio/32/32" },
  { id: "4", cid: "PT004", category: "Electronics", description: "Apple", status: "Pc", createdBy: "Leo Kelly", avatarImage: "https://picsum.photos/seed/leokelly/32/32" },
  { id: "5", cid: "PT005", category: "Electronics", description: "Amazon", status: "Pc", createdBy: "Annette Walker", avatarImage: "https://picsum.photos/seed/annette/32/32" },
  { id: "6", cid: "PT006", category: "Furniture", description: "Modern Wave", status: "Pc", createdBy: "John Weaver", avatarImage: "https://picsum.photos/seed/johnw/32/32" },
  { id: "7", cid: "PT007", category: "Bags", description: "Dior", status: "Pc", createdBy: "Gary Hennessy", avatarImage: "https://picsum.photos/seed/gary/32/32" },
  { id: "8", cid: "PT008", category: "Phone", description: "Apple", status: "Pc", createdBy: "Eleanor Panek", avatarImage: "https://picsum.photos/seed/eleanor/32/32" },
  { id: "9", cid: "PT009", category: "Furniture", description: "Arlime", status: "Pc", createdBy: "William Levy", avatarImage: "https://picsum.photos/seed/william/32/32" },
  { id: "10", cid: "PT010", category: "Bags", description: "The North Face", status: "Pc", createdBy: "Charlotte Klotz", avatarImage: "https://picsum.photos/seed/charlotte/32/32" },
];

export const CATEGORY_OPTIONS = ["Category", "Computers", "Electronics", "Shoe", "Furniture", "Bags", "Phone"];
export const TOTAL_PAGES = 15;
