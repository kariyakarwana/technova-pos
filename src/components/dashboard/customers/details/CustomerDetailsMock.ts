export interface PurchaseHistoryItem {
  orderId: string;
  date: string;
  totalAmount: string;
  status: "Completed" | "Returned" | "Pending";
}

export interface PointHistoryItem {
  orderId: string;
  date: string;
  totalPoints: string;
  status: "Completed" | "Returned" | "Pending";
}

export interface CustomerProfileData {
  customerId: string;
  name: string;
  customerSince: string;
  email: string;
  phone: string;
  city: string;
  avatarUrl?: string;
  personalDetails: {
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    shippingAddress: string;
  };
  loyaltySnapshot: {
    totalPoints: string;
    expiringSoon: string;
    expDate: string;
  };
  purchaseHistory: PurchaseHistoryItem[];
  pointHistory: PointHistoryItem[];
}

export const MOCK_CUSTOMER_PROFILE: CustomerProfileData = {
  customerId: "PT001",
  name: "Saman Ratnayake",
  customerSince: "Sep 08, 2027",
  email: "saman@gmail.com",
  phone: "+94 77 340 9342",
  city: "Galle",
  avatarUrl:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  personalDetails: {
    fullName: "Eleanor Vance",
    phoneNumber: "+94 77 340 9342",
    emailAddress: "saman@gmail.com",
    shippingAddress: "238/B, Imaduwa, Galle",
  },
  loyaltySnapshot: {
    totalPoints: "12,450",
    expiringSoon: "450 pts",
    expDate: "Dec 31, 2024",
  },
  purchaseHistory: [
    {
      orderId: "#ORD-9921",
      date: "Oct 24, 2024",
      totalAmount: "$245.50",
      status: "Completed",
    },
    {
      orderId: "#ORD-9844",
      date: "Sep 12, 2024",
      totalAmount: "$1,120.00",
      status: "Completed",
    },
    {
      orderId: "#ORD-9710",
      date: "Aug 05, 2024",
      totalAmount: "$89.99",
      status: "Returned",
    },
    {
      orderId: "#ORD-9502",
      date: "Jun 18, 2024",
      totalAmount: "$450.25",
      status: "Completed",
    },
    {
      orderId: "#ORD-9100",
      date: "Mar 02, 2024",
      totalAmount: "$3,200.00",
      status: "Completed",
    },
  ],
  pointHistory: [
    {
      orderId: "#ORD-9921",
      date: "Oct 24, 2024",
      totalPoints: "+20",
      status: "Completed",
    },
    {
      orderId: "#ORD-9844",
      date: "Sep 12, 2024",
      totalPoints: "+80",
      status: "Completed",
    },
    {
      orderId: "#ORD-9710",
      date: "Aug 05, 2024",
      totalPoints: "-30",
      status: "Returned",
    },
    {
      orderId: "#ORD-9502",
      date: "Jun 18, 2024",
      totalPoints: "+20",
      status: "Completed",
    },
    {
      orderId: "#ORD-9100",
      date: "Mar 02, 2024",
      totalPoints: "+120",
      status: "Completed",
    },
  ],
};
