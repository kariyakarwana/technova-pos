import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createVisualTheme,
  deleteVisualTheme,
  getVisualTheme,
  getVisualThemes,
  setDefaultVisualTheme,
  updateVisualTheme,
} from "@/lib/api/dashboard";
import type { VisualTheme, VisualThemeTokens } from "@/types/dashboard";

const mockResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

describe("Visual Themes — Types & Serialization", () => {
  it("handles valid VisualThemeTokens structures and round-trips via JSON", () => {
    const tokens: VisualThemeTokens = {
      mode: "dark",
      primaryColor: "#0E9384",
      secondaryColor: "#092C4C",
      backgroundColor: "#0B1120",
      cardBackground: "#1E293B",
      surfaceColor: "#334155",
      textColor: "#F8FAFC",
      borderRadius: "0.5rem",
      fontFamily: "Inter, sans-serif",
      customVariables: {
        "chart-accent": "#38BDF8",
      },
    };

    const theme: VisualTheme = {
      id: "theme-alpha",
      organizationId: "org-1",
      name: "Midnight Emerald",
      isDefault: true,
      tokens,
      createdAt: "2026-09-06T00:00:00.000Z",
      updatedAt: "2026-09-06T00:00:00.000Z",
    };

    const serialized = JSON.stringify(theme);
    const parsed = JSON.parse(serialized) as VisualTheme;
    expect(parsed).toEqual(theme);
    expect(parsed.tokens.primaryColor).toBe("#0E9384");
    expect(parsed.tokens.customVariables?.["chart-accent"]).toBe("#38BDF8");
  });

  it("round-trips the canonical DEFAULT_VISUAL_THEME via JSON", async () => {
    const { DEFAULT_VISUAL_THEME } = await import("@/lib/dashboard/default-layout");
    expect(DEFAULT_VISUAL_THEME.name).toBe("Default");
    expect(DEFAULT_VISUAL_THEME.isDefault).toBe(true);

    const serialized = JSON.stringify(DEFAULT_VISUAL_THEME);
    const parsed = JSON.parse(serialized) as VisualTheme;
    expect(parsed).toEqual(DEFAULT_VISUAL_THEME);
    expect(parsed.tokens.primaryColor).toBe("#0E9384");
    expect(parsed.tokens.backgroundColor).toBe("#F8FAFC");
    expect(parsed.tokens.cardBackground).toBe("#FFFFFF");
    expect(parsed.tokens.textColor).toBe("#1D2939");
  });
});

describe("Visual Themes — API Client Integration", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("performs getVisualThemes with query filtering", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      mockResponse({
        data: [
          {
            id: "vt-1",
            name: "Default Theme",
            isDefault: true,
            tokens: { primaryColor: "#0E9384" },
          },
        ],
        meta: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await getVisualThemes({ isDefault: true, search: "Default" });
    expect(res.data).toHaveLength(1);
    expect(res.data[0].id).toBe("vt-1");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/backend/visual-themes?isDefault=true&search=Default",
      expect.anything(),
    );
  });

  it("creates, updates, sets default, and deletes a visual theme", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse({ id: "vt-2", name: "Sunset" }))
      .mockResolvedValueOnce(mockResponse({ id: "vt-2", name: "Sunset Warm" }))
      .mockResolvedValueOnce(mockResponse({ id: "vt-2", isDefault: true }))
      .mockResolvedValueOnce(mockResponse({ success: true, id: "vt-2" }))
      .mockResolvedValueOnce(mockResponse({ id: "vt-2" }));

    vi.stubGlobal("fetch", fetchMock);

    const created = await createVisualTheme({
      name: "Sunset",
      tokens: { primaryColor: "#F97316" },
    });
    expect(created.id).toBe("vt-2");

    const updated = await updateVisualTheme("vt-2", {
      name: "Sunset Warm",
    });
    expect(updated.name).toBe("Sunset Warm");

    const defaultResult = await setDefaultVisualTheme("vt-2");
    expect(defaultResult.isDefault).toBe(true);

    const deleted = await deleteVisualTheme("vt-2");
    expect(deleted.success).toBe(true);

    const single = await getVisualTheme("vt-2");
    expect(single.id).toBe("vt-2");

    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
    expect(fetchMock.mock.calls[1][1]?.method).toBe("PATCH");
    expect(fetchMock.mock.calls[2][1]?.method).toBe("POST");
    expect(fetchMock.mock.calls[2][0]).toBe("/api/backend/visual-themes/vt-2/set-default");
    expect(fetchMock.mock.calls[3][1]?.method).toBe("DELETE");
    expect(fetchMock.mock.calls[4][1]?.method ?? "GET").toBe("GET");
  });
});
