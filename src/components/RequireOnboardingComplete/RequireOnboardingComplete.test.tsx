// src/components/RequireOnboardingComplete.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

// ---- Mock ----
vi.mock("../../store/hooks", () => ({
    useAppSelector: vi.fn(),
}));

import { useAppSelector } from "../../store/hooks";

// ---- Factories ----
import { setUserStore } from "../../test/factories";
import { RequireOnboardingComplete } from "./RequiredOnboardingCompleted";

const mockedSelector = vi.mocked(useAppSelector);

// ---- Render helper ----

function renderGuard() {
    return render(
        <MemoryRouter initialEntries={["/protected"]}>
            <Routes>
                <Route element={<RequireOnboardingComplete />}>
                    <Route
                        path="/protected"
                        element={<div>PROTECTED CONTENT</div>}
                    />
                </Route>
                <Route path="/dashboard" element={<div>DASHBOARD</div>} />
                <Route
                    path="/choose-business"
                    element={<div>CHOOSE BUSINESS</div>}
                />
            </Routes>
        </MemoryRouter>,
    );
}

// ---- Tests ----

describe("RequireOnboardingComplete", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("ha nincs kiválasztott business employee -> /choose-business redirect", () => {
        setUserStore(mockedSelector, { withEmployee: false, userId: 1 });

        renderGuard();

        expect(screen.getByText("CHOOSE BUSINESS")).toBeInTheDocument();
        expect(screen.queryByText("PROTECTED CONTENT")).not.toBeInTheDocument();
    });

    it("ha nincs owner a businessen -> /choose-business redirect", () => {
        setUserStore(mockedSelector, { userId: 1, ownerId: undefined });

        renderGuard();

        expect(screen.getByText("CHOOSE BUSINESS")).toBeInTheDocument();
        expect(screen.queryByText("PROTECTED CONTENT")).not.toBeInTheDocument();
    });

    it("ha nincs user -> /choose-business redirect", () => {
        setUserStore(mockedSelector, { userId: undefined, ownerId: 1 });

        renderGuard();

        expect(screen.getByText("CHOOSE BUSINESS")).toBeInTheDocument();
        expect(screen.queryByText("PROTECTED CONTENT")).not.toBeInTheDocument();
    });

    it("owner + befejezetlen onboarding (false) -> /dashboard redirect", () => {
        setUserStore(mockedSelector, {
            ownerId: 1,
            userId: 1,
            onboardingCompleted: false,
        });

        renderGuard();

        expect(screen.getByText("DASHBOARD")).toBeInTheDocument();
        expect(screen.queryByText("PROTECTED CONTENT")).not.toBeInTheDocument();
    });

    it("owner + hiányzó onboardingCompleted (undefined) -> /dashboard redirect (falsy check)", () => {
        // Rögzíti a szándékos viselkedést: falsy -> redirect
        setUserStore(mockedSelector, {
            ownerId: 1,
            userId: 1,
            onboardingCompleted: undefined,
        });

        renderGuard();

        expect(screen.getByText("DASHBOARD")).toBeInTheDocument();
        expect(screen.queryByText("PROTECTED CONTENT")).not.toBeInTheDocument();
    });

    it("owner + befejezett onboarding -> engedi a tartalmat", () => {
        setUserStore(mockedSelector, {
            ownerId: 1,
            userId: 1,
            onboardingCompleted: true,
        });

        renderGuard();

        expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
        expect(screen.queryByText("DASHBOARD")).not.toBeInTheDocument();
        expect(screen.queryByText("CHOOSE BUSINESS")).not.toBeInTheDocument();
    });

    it("nem-owner (pl. employee) + befejezetlen onboarding -> engedi a tartalmat", () => {
        setUserStore(mockedSelector, {
            ownerId: 999,
            userId: 1,
            onboardingCompleted: false,
        });

        renderGuard();

        expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
        expect(screen.queryByText("DASHBOARD")).not.toBeInTheDocument();
    });
});
