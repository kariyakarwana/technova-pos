import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./client";
import type {
  CreateDashboardPayload,
  CreateDashboardTemplatePayload,
  CreateVisualThemePayload,
  Dashboard,
  DashboardLayout,
  DashboardQueryParams,
  DashboardTemplate,
  DashboardTemplateQueryParams,
  PaginatedResponse,
  UpdateDashboardLayoutPayload,
  UpdateDashboardPayload,
  UpdateDashboardTemplatePayload,
  UpdateVisualThemePayload,
  VisualTheme,
  VisualThemeQueryParams,
} from "@/types/dashboard";

/**
 * Builds query string from an object, omitting undefined / null properties.
 */
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  }
  const str = search.toString();
  return str ? `?${str}` : "";
}

/* =========================================================================
   DASHBOARDS API
   ========================================================================= */

/**
 * List dashboards for the current organization / user / branch.
 */
export function getDashboards(
  query?: DashboardQueryParams,
): Promise<PaginatedResponse<Dashboard>> {
  return apiGet<PaginatedResponse<Dashboard>>(
    `/dashboards${buildQueryString(query as Record<string, unknown>)}`,
  );
}

/**
 * Fetch a single dashboard by ID.
 */
export function getDashboard(id: string): Promise<Dashboard> {
  return apiGet<Dashboard>(`/dashboards/${encodeURIComponent(id)}`);
}

/**
 * Create a new dashboard.
 */
export function createDashboard(
  payload: CreateDashboardPayload,
): Promise<Dashboard> {
  return apiPost<Dashboard>("/dashboards", payload);
}

/**
 * Update metadata or default status of a dashboard.
 */
export function updateDashboard(
  id: string,
  payload: UpdateDashboardPayload,
): Promise<Dashboard> {
  return apiPatch<Dashboard>(`/dashboards/${encodeURIComponent(id)}`, payload);
}

/**
 * Update the layout configuration of a dashboard.
 */
export function updateDashboardLayout(
  id: string,
  layout: DashboardLayout,
): Promise<Dashboard> {
  const payload: UpdateDashboardLayoutPayload = { layout };
  return apiPut<Dashboard>(`/dashboards/${encodeURIComponent(id)}/layout`, payload);
}

/**
 * Delete a dashboard.
 */
export function deleteDashboard(
  id: string,
): Promise<{ success: boolean; id: string }> {
  return apiDelete<{ success: boolean; id: string }>(
    `/dashboards/${encodeURIComponent(id)}`,
  );
}

/**
 * Apply a template to an existing dashboard.
 */
export function applyDashboardTemplate(
  id: string,
  templateId: string,
): Promise<Dashboard> {
  return apiPost<Dashboard>(
    `/dashboards/${encodeURIComponent(id)}/apply-template`,
    { templateId },
  );
}

/* =========================================================================
   DASHBOARD TEMPLATES API
   ========================================================================= */

/**
 * List dashboard templates.
 */
export function getDashboardTemplates(
  query?: DashboardTemplateQueryParams,
): Promise<PaginatedResponse<DashboardTemplate>> {
  return apiGet<PaginatedResponse<DashboardTemplate>>(
    `/dashboard-templates${buildQueryString(query as Record<string, unknown>)}`,
  );
}

/**
 * Fetch a single dashboard template by ID.
 */
export function getDashboardTemplate(id: string): Promise<DashboardTemplate> {
  return apiGet<DashboardTemplate>(
    `/dashboard-templates/${encodeURIComponent(id)}`,
  );
}

/**
 * Create a new dashboard template.
 */
export function createDashboardTemplate(
  payload: CreateDashboardTemplatePayload,
): Promise<DashboardTemplate> {
  return apiPost<DashboardTemplate>("/dashboard-templates", payload);
}

/**
 * Update an existing dashboard template.
 */
export function updateDashboardTemplate(
  id: string,
  payload: UpdateDashboardTemplatePayload,
): Promise<DashboardTemplate> {
  return apiPatch<DashboardTemplate>(
    `/dashboard-templates/${encodeURIComponent(id)}`,
    payload,
  );
}

/**
 * Delete a dashboard template.
 */
export function deleteDashboardTemplate(
  id: string,
): Promise<{ success: boolean; id: string }> {
  return apiDelete<{ success: boolean; id: string }>(
    `/dashboard-templates/${encodeURIComponent(id)}`,
  );
}

/* =========================================================================
   VISUAL THEMES API
   ========================================================================= */

/**
 * List visual themes.
 */
export function getVisualThemes(
  query?: VisualThemeQueryParams,
): Promise<PaginatedResponse<VisualTheme>> {
  return apiGet<PaginatedResponse<VisualTheme>>(
    `/visual-themes${buildQueryString(query as Record<string, unknown>)}`,
  );
}

/**
 * Fetch a single visual theme by ID.
 */
export function getVisualTheme(id: string): Promise<VisualTheme> {
  return apiGet<VisualTheme>(`/visual-themes/${encodeURIComponent(id)}`);
}

/**
 * Create a new visual theme.
 */
export function createVisualTheme(
  payload: CreateVisualThemePayload,
): Promise<VisualTheme> {
  return apiPost<VisualTheme>("/visual-themes", payload);
}

/**
 * Update an existing visual theme.
 */
export function updateVisualTheme(
  id: string,
  payload: UpdateVisualThemePayload,
): Promise<VisualTheme> {
  return apiPatch<VisualTheme>(
    `/visual-themes/${encodeURIComponent(id)}`,
    payload,
  );
}

/**
 * Mark a visual theme as the organization default.
 */
export function setDefaultVisualTheme(id: string): Promise<VisualTheme> {
  return apiPost<VisualTheme>(
    `/visual-themes/${encodeURIComponent(id)}/set-default`,
    {},
  );
}

/**
 * Delete a visual theme.
 */
export function deleteVisualTheme(
  id: string,
): Promise<{ success: boolean; id: string }> {
  return apiDelete<{ success: boolean; id: string }>(
    `/visual-themes/${encodeURIComponent(id)}`,
  );
}
