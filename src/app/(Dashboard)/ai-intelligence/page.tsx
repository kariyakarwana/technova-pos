import type { Metadata } from "next";
import AIIntelligenceClientView from "@/components/dashboard/ai-intelligence/AIIntelligenceClientView";

export const metadata: Metadata = {
  title: "AI Intelligence Analytics & Assistant | TechNova POS",
  description: "Proactive AI business recommendations, inventory health scores, revenue forecasting, and interactive assistant.",
};

export default function AIIntelligencePage() {
  return <AIIntelligenceClientView />;
}
