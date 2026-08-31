export interface ProactiveRecommendation {
  id: string;
  type: "overstock" | "route_optimization" | "pricing";
  title: string;
  impactLevel: "High Impact" | "Medium Impact" | "Low Impact";
  description: string;
  actionText: string;
  actionHref?: string;
}

export interface RestockAlertItem {
  id: string;
  sku: string;
  product: string;
  estEmpty: string;
  isUrgent: boolean;
  actionType: "Order" | "Review";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  recommendations?: ProactiveRecommendation[];
}

export interface AIIntelligenceData {
  healthScore: number;
  healthSummary: string;
  recommendations: ProactiveRecommendation[];
  restockAlerts: RestockAlertItem[];
  suggestedPrompts: string[];
  initialChatMessages: ChatMessage[];
}

export const MOCK_AI_DATA: AIIntelligenceData = {
  healthScore: 88,
  healthSummary:
    "Overall stock levels are optimal. Minor drift detected in peripherals category.",
  recommendations: [
    {
      id: "rec-1",
      type: "overstock",
      title: "Overstock Alert: LAP-PRO-15",
      impactLevel: "High Impact",
      description:
        "Current stock is 45% above projected demand for Q3.",
      actionText: "Run 10% Promo →",
    },
    {
      id: "rec-2",
      type: "route_optimization",
      title: "Optimize Downtown Route",
      impactLevel: "Medium Impact",
      description:
        "Consolidating deliveries to Downtown Branch saves ~12% logistics cost.",
      actionText: "Review Schedule →",
    },
  ],
  restockAlerts: [
    {
      id: "alert-1",
      sku: "MOU-WL-01",
      product: "Wireless Mouse V2",
      estEmpty: "3 Days",
      isUrgent: true,
      actionType: "Order",
    },
    {
      id: "alert-2",
      sku: "CBL-USB-C",
      product: "USB-C Cable 2m",
      estEmpty: "5 Days",
      isUrgent: true,
      actionType: "Review",
    },
    {
      id: "alert-3",
      sku: "MON-27-4K",
      product: '27" 4K Monitor',
      estEmpty: "12 Days",
      isUrgent: false,
      actionType: "Review",
    },
  ],
  suggestedPrompts: [
    "Which products are trending?",
    "Optimize stock for Downtown",
    "Forecast Q4 Revenue",
  ],
  initialChatMessages: [
    {
      id: "msg-1",
      sender: "assistant",
      text: "Hello! I am your TechNova AI Business Assistant. I monitor your inventory health, sales velocity, and delivery supply chains in real-time. How can I assist your operations today?",
      timestamp: "Just now",
    },
  ],
};
