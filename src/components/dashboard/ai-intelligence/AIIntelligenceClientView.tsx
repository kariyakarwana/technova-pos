"use client";

import { useState } from "react";
import {
  MOCK_AI_DATA,
  type ChatMessage,
  type ProactiveRecommendation,
  type RestockAlertItem,
} from "./AIIntelligenceMock";
import AIIntelligenceHeader from "./AIIntelligenceHeader";
import AIChatConversationView from "./AIChatConversationView";
import ProactiveRecommendationsCard from "./ProactiveRecommendationsCard";
import InventoryHealthGaugeCard from "./InventoryHealthGaugeCard";
import RevenueForecastChartCard from "./RevenueForecastChartCard";
import PredictiveRestockAlertsTable from "./PredictiveRestockAlertsTable";
import AIAssistantPromptBar from "./AIAssistantPromptBar";

export default function AIIntelligenceClientView() {
  const [data] = useState(MOCK_AI_DATA);
  const [isDetailsHidden, setIsDetailsHidden] = useState(false);
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [messages, setMessages] = useState<ChatMessage[]>(
    MOCK_AI_DATA.initialChatMessages
  );
  const [isPromptProcessing, setIsPromptProcessing] = useState(false);

  function handleActionClick(rec: ProactiveRecommendation) {
    alert(`Executing AI recommendation: ${rec.title}`);
  }

  function handleOrder(item: RestockAlertItem) {
    alert(`Opening purchase order creation for ${item.product} (${item.sku})`);
  }

  function handleReview(item: RestockAlertItem) {
    alert(`Reviewing stock depletion model for ${item.product} (${item.sku})`);
  }

  function generateAssistantResponse(userPrompt: string): {
    text: string;
    recommendations?: ProactiveRecommendation[];
  } {
    const lower = userPrompt.toLowerCase();

    if (lower.includes("trending")) {
      return {
        text: "Top trending products across all branches this week:\n1. Wireless Mouse V2 (+34% velocity)\n2. 27\" 4K Monitor (+21% velocity)\n3. USB-C Rapid Cable (+18% velocity)",
      };
    }

    if (lower.includes("downtown")) {
      return {
        text: "Downtown branch is running at 94% storage efficiency. Consolidating Wednesday & Friday logistics routes will reduce delivery overhead by ~$420/month.",
        recommendations: [data.recommendations[1]],
      };
    }

    if (lower.includes("q4") || lower.includes("revenue") || lower.includes("forecast")) {
      return {
        text: "Q4 Revenue is projected to reach $148,200 (+14.2% YoY growth), primarily driven by the Computing and Peripherals categories.",
      };
    }

    return {
      text: `Analysis complete for: "${userPrompt}". All POS systems report synchronized inventories and balanced profit margins.`,
    };
  }

  function handleSubmitPrompt(promptText: string) {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: promptText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsPromptProcessing(true);

    // If details are visible, collapse to chat focus or keep chat active
    setIsDetailsHidden(true);

    setTimeout(() => {
      const response = generateAssistantResponse(promptText);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: response.text,
        timestamp: "Just now",
        recommendations: response.recommendations,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsPromptProcessing(false);
    }, 700);
  }

  return (
    <main className="min-h-[calc(100vh-2rem)] bg-[var(--brand-app-bg)] p-6 flex flex-col justify-between space-y-6">
      <div className="space-y-6 flex-1 flex flex-col">
        {/* 1. Header */}
        <AIIntelligenceHeader
          isDetailsHidden={isDetailsHidden}
          onToggleDetails={() => setIsDetailsHidden((prev) => !prev)}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onFilterClick={() => alert("Filter AI parameters toggled")}
        />

        {/* 2. Main Content Area */}
        {isDetailsHidden ? (
          /* Focused Chat Conversation View */
          <div className="flex-1 flex flex-col justify-end">
            <AIChatConversationView
              messages={messages}
              isProcessing={isPromptProcessing}
              onActionClick={handleActionClick}
            />
          </div>
        ) : (
          /* Full Analytical Dashboard View */
          <div className="space-y-6">
            {/* Top Row: Proactive Recommendations (8 cols) & Inventory Health (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 flex flex-col">
                <ProactiveRecommendationsCard
                  recommendations={data.recommendations}
                  onActionClick={handleActionClick}
                />
              </div>

              <div className="lg:col-span-4 flex flex-col">
                <InventoryHealthGaugeCard
                  score={data.healthScore}
                  summary={data.healthSummary}
                />
              </div>
            </div>

            {/* Middle Row: Revenue Forecast (7 cols) & Predictive Restock Alerts (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <RevenueForecastChartCard />
              </div>

              <div className="lg:col-span-5 flex flex-col">
                <PredictiveRestockAlertsTable
                  alerts={data.restockAlerts}
                  onOrder={handleOrder}
                  onReview={handleReview}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom AI Assistant Prompt Bar (Docked / Anchored at bottom) */}
      <div className="pt-4 sticky bottom-4 z-20">
        <AIAssistantPromptBar
          suggestedPrompts={data.suggestedPrompts}
          onSubmitPrompt={handleSubmitPrompt}
          isProcessing={isPromptProcessing}
        />
      </div>
    </main>
  );
}
