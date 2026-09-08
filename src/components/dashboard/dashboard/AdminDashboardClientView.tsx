"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { DashboardLayoutRenderer } from "@/components/dashboard/dashboard/registry";
import { DashboardBuilderGrid } from "@/components/dashboard/dashboard/builder/dashboard-builder-grid";
import { DashboardBuilderToolbar } from "@/components/dashboard/dashboard/builder/dashboard-builder-toolbar";
import { WidgetPicker } from "@/components/dashboard/dashboard/builder/widget-picker";
import { TemplatePicker } from "@/components/dashboard/dashboard/builder/template-picker";
import { VisualThemePanel } from "@/components/dashboard/dashboard/builder/visual-theme-panel";
import { ApplyTemplateDialog } from "@/components/dashboard/dashboard/builder/apply-template-dialog";
import { SaveTemplateDialog } from "@/components/dashboard/dashboard/builder/save-template-dialog";
import { WidgetSettingsDialog } from "@/components/dashboard/dashboard/builder/widget-settings-dialog";
import { Button } from "@/components/ui/button";
import {
  getDashboards,
  updateDashboardLayout,
  createDashboard,
  applyDashboardTemplate,
  getVisualThemes,
} from "@/lib/api/dashboard";
import { apiGet } from "@/lib/api/client";
import { DEFAULT_DASHBOARD_LAYOUT } from "@/lib/dashboard/default-layout";
import type {
  Dashboard,
  DashboardLayout,
  DashboardLayoutWidget,
  DashboardReportData,
  DashboardTemplate,
  DashboardWidgetSettings,
  FormattedDashboardData,
  VisualTheme,
} from "@/types/dashboard";
import type { KpiCardItem, TopBannerMetric } from "./AdminDashboardTypes";

const money = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);

const compact = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const delta = (value: number) =>
  `${value >= 0 ? "+" : ""}${Math.round(value)}%`;

const fallbackImage = "/posmachine.png";

export default function AdminDashboardClientView() {
  const { branchId } = useBranch();
  const [report, setReport] = useState<DashboardReportData | null>(null);
  const [layout, setLayout] = useState<DashboardLayout>(DEFAULT_DASHBOARD_LAYOUT);
  const [dashboardId, setDashboardId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [workingLayout, setWorkingLayout] = useState<DashboardLayout>(DEFAULT_DASHBOARD_LAYOUT);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Template integration
  const [showTemplates, setShowTemplates] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<DashboardTemplate | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateListRefreshKey, setTemplateListRefreshKey] = useState(0);

  // Visual Theme integration
  const [showThemes, setShowThemes] = useState(false);
  const [activeTheme, setActiveTheme] = useState<VisualTheme | null>(null);

  // Unsaved changes confirmation dialog
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Widget settings dialog state (Step 10)
  const [configuringWidget, setConfiguringWidget] = useState<DashboardLayoutWidget | null>(null);

  const hasUnsavedChanges = isEditing && JSON.stringify(workingLayout) !== JSON.stringify(layout);

  // Load live data and default theme
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const reportUrl = `/reports/dashboard${branchId ? `?branchId=${encodeURIComponent(branchId)}` : ""
      }`;

    const reportPromise = apiGet<DashboardReportData>(reportUrl);
    const layoutPromise = getDashboards({
      branchId: branchId || undefined,
      isDefault: true,
      pageSize: 1,
    }).catch(() => null);

    const themePromise = getVisualThemes({ isDefault: true, pageSize: 1 })
      .then((res) => res.data[0] || null)
      .catch(() => null);

    Promise.all([reportPromise, layoutPromise, themePromise])
      .then(([reportData, dashboardResponse, defaultTheme]) => {
        if (!active) return;
        setReport(reportData);
        if (defaultTheme) {
          setActiveTheme(defaultTheme);
        }

        const customDashboard: Dashboard | undefined = dashboardResponse?.data?.[0];
        if (
          customDashboard?.layout?.widgets &&
          Array.isArray(customDashboard.layout.widgets) &&
          customDashboard.layout.widgets.length > 0
        ) {
          setLayout(customDashboard.layout);
          setDashboardId(customDashboard.id);
        } else {
          setLayout(DEFAULT_DASHBOARD_LAYOUT);
          setDashboardId(customDashboard?.id ?? null);
        }
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load dashboard data.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [branchId]);

  const handleEdit = useCallback(() => {
    setWorkingLayout(layout);
    setStatusMsg(null);
    setShowTemplates(false);
    setShowThemes(false);
    setIsEditing(true);
  }, [layout]);

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true);
      return;
    }
    setWorkingLayout(layout);
    setStatusMsg(null);
    setShowTemplates(false);
    setShowThemes(false);
    setPendingTemplate(null);
    setIsEditing(false);
  }, [hasUnsavedChanges, layout]);

  const handleConfirmDiscard = useCallback(() => {
    setShowCancelConfirm(false);
    setWorkingLayout(layout);
    setStatusMsg({ type: "success", text: "Changes discarded." });
    setShowTemplates(false);
    setShowThemes(false);
    setPendingTemplate(null);
    setIsEditing(false);
  }, [layout]);

  const handleKeepEditing = useCallback(() => {
    setShowCancelConfirm(false);
  }, []);

  const handleReset = useCallback(() => {
    setWorkingLayout(DEFAULT_DASHBOARD_LAYOUT);
    setStatusMsg({
      type: "success",
      text: "Reset to default layout. Click 'Save Layout' to persist.",
    });
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setStatusMsg(null);
    try {
      let savedDashboard: Dashboard;
      if (dashboardId) {
        savedDashboard = await updateDashboardLayout(dashboardId, workingLayout);
      } else {
        savedDashboard = await createDashboard({
          name: "My Dashboard",
          isDefault: true,
          branchId: branchId || undefined,
          layout: workingLayout,
        });
        setDashboardId(savedDashboard.id);
      }
      setLayout(savedDashboard.layout);
      setIsEditing(false);
      setShowTemplates(false);
      setShowThemes(false);
      setStatusMsg({ type: "success", text: "Dashboard layout saved." });
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save layout.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [dashboardId, workingLayout, branchId]);

  const handleLayoutChange = useCallback((updated: DashboardLayout) => {
    setWorkingLayout(updated);
  }, []);

  const handleAddWidget = useCallback((widget: DashboardLayoutWidget) => {
    setWorkingLayout((prev) => ({
      ...prev,
      widgets: [...prev.widgets, widget],
    }));
  }, []);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    setWorkingLayout((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== widgetId),
    }));
  }, []);

  // Widget settings handlers (Step 10)
  const handleConfigureWidget = useCallback((widget: DashboardLayoutWidget) => {
    setConfiguringWidget(widget);
  }, []);

  const handleApplyWidgetSettings = useCallback(
    (newSettings: DashboardWidgetSettings, newTitle?: string) => {
      if (!configuringWidget) return;
      const targetId = configuringWidget.id;
      setWorkingLayout((prev) => ({
        ...prev,
        widgets: prev.widgets.map((w) => {
          if (w.id !== targetId) return w;
          return {
            ...w,
            title: newTitle !== undefined ? newTitle : w.title,
            settings: { ...newSettings },
          };
        }),
      }));
      setConfiguringWidget(null);
      setStatusMsg({
        type: "success",
        text: `Settings updated for widget. Click 'Save Layout' to persist.`,
      });
    },
    [configuringWidget],
  );

  const handleCloseWidgetSettings = useCallback(() => {
    setConfiguringWidget(null);
  }, []);

  // Template handlers
  const handleToggleTemplates = useCallback(() => {
    setShowTemplates((prev) => !prev);
    setShowThemes(false);
    setPendingTemplate(null);
  }, []);

  const handleTemplateSelect = useCallback((template: DashboardTemplate) => {
    setPendingTemplate(template);
  }, []);

  const handleOpenSaveTemplate = useCallback(() => {
    setShowSaveTemplate(true);
  }, []);

  const handleSaveTemplateSuccess = useCallback((templateName: string) => {
    setShowSaveTemplate(false);
    setTemplateListRefreshKey((k) => k + 1);
    setStatusMsg({ type: "success", text: `Template "${templateName}" saved.` });
  }, []);

  const handleSaveTemplateClose = useCallback(() => {
    setShowSaveTemplate(false);
  }, []);

  const handleTemplateConfirm = useCallback(async () => {
    if (!pendingTemplate) return;

    setIsApplyingTemplate(true);
    setStatusMsg(null);
    try {
      let targetId = dashboardId;
      if (!targetId) {
        const created = await createDashboard({
          name: "My Dashboard",
          isDefault: true,
          branchId: branchId || undefined,
          layout: DEFAULT_DASHBOARD_LAYOUT,
        });
        targetId = created.id;
        setDashboardId(targetId);
      }

      const applied = await applyDashboardTemplate(targetId, pendingTemplate.id);
      setLayout(applied.layout);
      setWorkingLayout(applied.layout);
      setPendingTemplate(null);
      setShowTemplates(false);
      setIsEditing(false);
      setStatusMsg({ type: "success", text: `Template "${pendingTemplate.name}" applied.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to apply template.";
      if (msg.includes("403") || msg.toLowerCase().includes("forbidden")) {
        setStatusMsg({
          type: "error",
          text: "You do not have permission to apply dashboard templates.",
        });
      } else {
        setStatusMsg({ type: "error", text: msg });
      }
      setPendingTemplate(null);
    } finally {
      setIsApplyingTemplate(false);
    }
  }, [pendingTemplate, dashboardId, branchId]);

  const handleTemplateCancel = useCallback(() => {
    setPendingTemplate(null);
  }, []);

  // Visual Theme handlers
  const handleToggleThemes = useCallback(() => {
    setShowThemes((prev) => !prev);
    setShowTemplates(false);
  }, []);

  const handleApplyTheme = useCallback((theme: VisualTheme) => {
    setActiveTheme(theme);
    setStatusMsg({ type: "success", text: `Theme "${theme.name}" applied.` });
  }, []);

  const themeStyle = useMemo<React.CSSProperties>(() => {
    if (!activeTheme?.tokens) return {};
    const t = activeTheme.tokens;
    const style: Record<string, string> = {};
    if (t.primaryColor) style["--brand-green"] = t.primaryColor;
    if (t.secondaryColor) style["--brand-blue-pending"] = t.secondaryColor;
    if (t.backgroundColor) style["--brand-app-bg"] = t.backgroundColor;
    if (t.cardBackground) {
      style["--brand-card-bg"] = t.cardBackground;
      style["--brand-white"] = t.cardBackground;
    }
    if (t.surfaceColor) style["--brand-surface"] = t.surfaceColor;
    if (t.textColor) style["--brand-black-font"] = t.textColor;
    if (t.borderRadius) style["--theme-border-radius"] = t.borderRadius;
    if (t.fontFamily) style["fontFamily"] = t.fontFamily;
    if (t.customVariables) {
      for (const [k, v] of Object.entries(t.customVariables)) {
        if (k && v && typeof v === "string") {
          const varName = k.startsWith("--") ? k : `--${k}`;
          style[varName] = v;
        }
      }
    }
    return style as React.CSSProperties;
  }, [activeTheme]);

  const data: FormattedDashboardData | null = useMemo(() => {
    if (!report) return null;

    const banners: TopBannerMetric[] = [
      {
        title: "Total Sales",
        amount: money(report.sales.total),
        change: delta(report.comparisons.sales),
        isPositive: report.comparisons.sales >= 0,
        bgGradient: "bg-gradient-to-r from-orange-400 to-amber-500",
        iconName: "sales",
      },
      {
        title: "Total Sales Return",
        amount: money(report.returns.total),
        change: delta(report.comparisons.returns),
        isPositive: report.comparisons.returns <= 0,
        bgGradient: "bg-[#092C4C]",
        iconName: "sales_return",
      },
      {
        title: "Total Purchase",
        amount: money(report.purchases.total),
        change: delta(report.comparisons.purchases),
        isPositive: report.comparisons.purchases >= 0,
        bgGradient: "bg-[var(--brand-green)]",
        iconName: "purchase",
      },
      {
        title: "Purchase Returns",
        amount: money(0),
        change: "0%",
        isPositive: true,
        bgGradient: "bg-blue-600",
        iconName: "purchase_return",
      },
    ];

    const kpis: KpiCardItem[] = [
      {
        title: "Gross Profit",
        amount: money(report.profit),
        changeText: "Sales less product cost",
        isPositive: report.profit >= 0,
        iconBg: "bg-sky-50",
        iconColor: "text-sky-500",
        iconType: "profit",
      },
      {
        title: "Invoice Due",
        amount: money(report.sales.balanceDue),
        changeText: `${report.credit.accounts} active credit accounts`,
        isPositive: report.sales.balanceDue === 0,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        iconType: "due",
      },
      {
        title: "Purchase Expenses",
        amount: money(report.purchases.total),
        changeText: `${report.purchases.count} purchase orders`,
        isPositive: true,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
        iconType: "expense",
      },
      {
        title: "Refunded Payments",
        amount: money(report.returns.total),
        changeText: `${report.returns.count} returns`,
        isPositive: report.returns.total === 0,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-500",
        iconType: "payment_return",
      },
    ];

    const sold = report.topSellingProducts.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const completed = (status: string) =>
      status === "COMPLETED" ||
      status === "REFUNDED" ||
      status === "PARTIALLY_REFUNDED";

    return {
      banners,
      kpis,
      overall: {
        suppliersCount: report.suppliers,
        customersCount: report.customers,
        ordersCount: report.sales.count,
        firstTimeAmount: compact(report.customerOverview.firstTime),
        firstTimeRate: report.customers
          ? `${Math.round(
            (report.customerOverview.firstTime / report.customers) * 100,
          )}%`
          : "0%",
        returnAmount: compact(report.customerOverview.returning),
        returnRate: report.customers
          ? `${Math.round(
            (report.customerOverview.returning / report.customers) * 100,
          )}%`
          : "0%",
      },
      products: report.topSellingProducts.map((item) => ({
        id: item.id,
        name: item.name,
        price: money(item.price),
        salesCount: `${compact(item.quantity)} sold`,
        trend: sold ? `${Math.round((item.quantity / sold) * 100)}%` : "0%",
        isPositive: true,
        imageUrl: item.imageUrl || fallbackImage,
      })),
      lowStock: report.lowStockProducts.map((item) => ({
        id: item.id,
        name: item.name,
        skuId: `SKU: ${item.sku}`,
        inStock: item.quantity,
        imageUrl: item.imageUrl || fallbackImage,
      })),
      recent: report.recentSales.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: money(item.total),
        date: new Intl.DateTimeFormat("en-LK", { dateStyle: "medium" }).format(
          new Date(item.date),
        ),
        rawDate: item.date,
        status: completed(item.status)
          ? ("Completed" as const)
          : item.status === "CANCELLED"
            ? ("Cancelled" as const)
            : item.status === "DRAFT"
              ? ("OnHold" as const)
              : ("Processing" as const),
        imageUrl: item.imageUrl || fallbackImage,
      })),
      customers: report.topCustomers.map((item) => ({
        id: item.id,
        name: item.name,
        country: item.country || "Not specified",
        orderCount: `${item.orderCount} Orders`,
        spentAmount: money(item.spent),
        avatarUrl: item.avatarUrl || fallbackImage,
      })),
      categories: report.categories.map((item, index) => ({
        ...item,
        color: [
          "#F97316",
          "#991B1B",
          "#0E9384",
          "#2563EB",
          "#7C3AED",
        ][index] || "#0E9384",
      })),
    };
  }, [report]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--brand-app-bg)] p-6" style={themeStyle}>
        <div className="rounded-2xl border bg-white p-8 text-sm text-slate-500 shadow-xs">
          Loading live dashboard data…
        </div>
      </main>
    );
  }

  if (error || !data || !report) {
    return (
      <main className="min-h-screen bg-[var(--brand-app-bg)] p-6" style={themeStyle}>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-xs">
          {error || "Dashboard data is unavailable."}
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen space-y-6 bg-[var(--brand-app-bg)] p-6"
      style={themeStyle}
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-green)]">
            Live business overview
          </p>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-xs text-slate-500">
            Database values from{" "}
            {new Intl.DateTimeFormat("en-LK", { dateStyle: "medium" }).format(
              new Date(report.period.from),
            )}{" "}
            to{" "}
            {new Intl.DateTimeFormat("en-LK", { dateStyle: "medium" }).format(
              new Date(report.period.to),
            )}
            .
          </p>
        </div>

        <DashboardBuilderToolbar
          isEditing={isEditing}
          isSaving={isSaving}
          showingTemplates={showTemplates}
          showingThemes={showThemes}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onReset={handleReset}
          onToggleTemplates={handleToggleTemplates}
          onToggleThemes={handleToggleThemes}
          onSaveAsTemplate={handleOpenSaveTemplate}
        />
      </header>

      {statusMsg && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${statusMsg.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
        >
          {statusMsg.text}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          {showTemplates && (
            <TemplatePicker
              onSelect={handleTemplateSelect}
              refreshKey={templateListRefreshKey}
              selectedTemplateId={pendingTemplate?.id ?? null}
            />
          )}
          {showThemes && (
            <VisualThemePanel
              activeThemeId={activeTheme?.id ?? null}
              onApply={handleApplyTheme}
            />
          )}
          <WidgetPicker
            currentLayout={workingLayout}
            onAdd={handleAddWidget}
          />
          <DashboardBuilderGrid
            layout={workingLayout}
            report={report}
            formattedData={data}
            onLayoutChange={handleLayoutChange}
            onRemove={handleRemoveWidget}
            onConfigure={handleConfigureWidget}
          />
        </div>
      ) : (
        <DashboardLayoutRenderer
          layout={layout}
          report={report}
          formattedData={data}
        />
      )}

      {pendingTemplate && (
        <ApplyTemplateDialog
          template={pendingTemplate}
          hasUnsavedChanges={hasUnsavedChanges}
          isApplying={isApplyingTemplate}
          onConfirm={handleTemplateConfirm}
          onCancel={handleTemplateCancel}
        />
      )}

      {showSaveTemplate && (
        <SaveTemplateDialog
          workingLayout={workingLayout}
          onSuccess={handleSaveTemplateSuccess}
          onClose={handleSaveTemplateClose}
        />
      )}

      {configuringWidget && (
        <WidgetSettingsDialog
          widget={configuringWidget}
          onApply={handleApplyWidgetSettings}
          onClose={handleCloseWidgetSettings}
        />
      )}

      {showCancelConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-confirm-title"
          aria-describedby="cancel-confirm-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={handleKeepEditing}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xl">
            <h2
              id="cancel-confirm-title"
              className="text-base font-semibold text-[var(--brand-black-font)]"
            >
              Discard Unsaved Changes?
            </h2>
            <p id="cancel-confirm-desc" className="mt-2 text-sm text-slate-600">
              You have customized your dashboard layout. Canceling now will discard your unsaved modifications and restore the previously saved layout.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleKeepEditing}
              >
                Keep Editing
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleConfirmDiscard}
              >
                Discard Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
