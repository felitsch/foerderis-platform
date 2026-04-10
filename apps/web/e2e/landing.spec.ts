import { test, expect } from "@playwright/test";

test.describe("Landing Page — Smoke Tests", () => {
  test("page loads without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto("/");
    expect(response?.status()).not.toBe(404);
    expect(errors).toHaveLength(0);
  });

  test("hero section is visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Fördermittel/i, level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Warteliste/i })).toBeVisible();
  });

  test("value proposition section is visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /FörderPilot für Sie/i }),
    ).toBeVisible();
    await expect(page.getByText("Automatische Förderrecherche")).toBeVisible();
    await expect(page.getByText("KI-gestützte Antragsvorbereitung")).toBeVisible();
    await expect(page.getByText("Integrierter Compliance-Check")).toBeVisible();
  });

  test("footer with Impressum link is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Impressum" })).toBeVisible();
  });

  test("Impressum page loads", async ({ page }) => {
    await page.goto("/impressum");
    await expect(
      page.getByRole("heading", { name: "Impressum", level: 1 }),
    ).toBeVisible();
    await expect(page.getByText(/§ 5 TMG/)).toBeVisible();
  });
});

test.describe("Waitlist Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#warteliste");
  });

  test("form is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Früher Zugang/i })).toBeVisible();
    await expect(page.getByLabel(/E-Mail/i)).toBeVisible();
    await expect(page.getByLabel(/Firmenname/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /vormerken/i }),
    ).toBeVisible();
  });

  test("empty submit shows browser validation", async ({ page }) => {
    // HTML5 required attributes prevent submission — button stays enabled but form won't submit
    const emailInput = page.getByLabel(/E-Mail/i);
    await expect(emailInput).toHaveAttribute("required");
    const companyInput = page.getByLabel(/Firmenname/i);
    await expect(companyInput).toHaveAttribute("required");
  });

  test("submit button is enabled by default", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /vormerken/i }),
    ).toBeEnabled();
  });

  test("shows loading state on submit", async ({ page }) => {
    await page.getByLabel(/E-Mail/i).fill("test@example.de");
    await page.getByLabel(/Firmenname/i).fill("Test GmbH");
    await page.getByRole("button", { name: /vormerken/i }).click();
    // Button should show loading state immediately after click
    await expect(page.getByText(/Wird eingetragen/i)).toBeVisible({
      timeout: 2000,
    });
  });
});

test.describe("Responsive Layout", () => {
  test("mobile (375px) — page is usable", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Fördermittel/i, level: 1 }),
    ).toBeVisible();
    await expect(page.getByLabel(/E-Mail/i)).toBeVisible();
    await expect(page.getByLabel(/Firmenname/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "Impressum" })).toBeVisible();
  });

  test("desktop (1280px) — page is usable", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Fördermittel/i, level: 1 }),
    ).toBeVisible();
    await expect(page.getByLabel(/E-Mail/i)).toBeVisible();
    await expect(page.getByLabel(/Firmenname/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "Impressum" })).toBeVisible();
  });
});
