// src/components/ProtectedEmployeeRoles.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("react-redux", () => ({
    useSelector: vi.fn(),
}));

import { useSelector } from "react-redux";
import ProtectedEmployeeRoles from "./ProtectedEmployeeRoles";
import {
    BUSINESS_EMPLOYEE_ROLE,
    BusinessEmployeeRole,
} from "../../helpers/types/BusinessEmployeeRole";
import {
    BUSINESS_PERMISSIONS,
    BusinessPermission,
} from "../../helpers/types/BusinessPermission";

const mockedSelector = vi.mocked(useSelector);

// ---- State builder ----

interface RootStateShape {
    userStore: {
        selectedBusinessEmployee: {
            role?: BusinessEmployeeRole;
            permissions?: BusinessPermission[];
        } | null;
    };
}

function mockState(
    employee: {
        role?: BusinessEmployeeRole;
        permissions?: BusinessPermission[];
    } | null,
) {
    const state: RootStateShape = {
        userStore: {
            selectedBusinessEmployee: employee,
        },
    };

    mockedSelector.mockImplementation((selector) => selector(state));
}

function makeEmployee({
    role,
    permissions = [],
}: {
    role?: BusinessEmployeeRole;
    permissions?: BusinessPermission[];
} = {}) {
    return { role, permissions };
}

// ---- Render helper ----

function renderGuard(
    props: {
        roles?: BusinessEmployeeRole[];
        permissions?: BusinessPermission[];
    } = {},
) {
    return render(
        <MemoryRouter initialEntries={["/protected"]}>
            <Routes>
                <Route element={<ProtectedEmployeeRoles {...props} />}>
                    <Route
                        path="/protected"
                        element={<div>PROTECTED CONTENT</div>}
                    />
                </Route>
                <Route
                    path="/choose-business"
                    element={<div>CHOOSE BUSINESS</div>}
                />
                <Route path="/not-found" element={<div>NOT FOUND</div>} />
            </Routes>
        </MemoryRouter>,
    );
}

// ---- Tests ----

describe("ProtectedEmployeeRoles", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("nincs selectedBusinessEmployee", () => {
        it("-> /choose-business redirect", () => {
            mockState(null);

            renderGuard({ roles: [BUSINESS_EMPLOYEE_ROLE.OWNER] });

            expect(screen.getByText("CHOOSE BUSINESS")).toBeInTheDocument();
            expect(
                screen.queryByText("PROTECTED CONTENT"),
            ).not.toBeInTheDocument();
        });
    });

    describe("ROLE check", () => {
        it("ha nincs megadva roles -> engedi (nem fut role check)", () => {
            mockState(makeEmployee());

            renderGuard();

            expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
        });

        it("employee role-ja megegyezik a required role-lal -> engedi", () => {
            mockState(makeEmployee({ role: BUSINESS_EMPLOYEE_ROLE.MANAGER }));

            renderGuard({ roles: [BUSINESS_EMPLOYEE_ROLE.MANAGER] });

            expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
            expect(screen.queryByText("NOT FOUND")).not.toBeInTheDocument();
        });

        it("több lehetséges role, employee az egyikbe tartozik -> engedi", () => {
            mockState(makeEmployee({ role: BUSINESS_EMPLOYEE_ROLE.MANAGER }));

            renderGuard({
                roles: [
                    BUSINESS_EMPLOYEE_ROLE.OWNER,
                    BUSINESS_EMPLOYEE_ROLE.MANAGER,
                ],
            });

            expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
        });

        it("employee role-ja nem szerepel a required roles-ban -> /not-found", () => {
            mockState(makeEmployee({ role: BUSINESS_EMPLOYEE_ROLE.EMPLOYEE }));

            renderGuard({ roles: [BUSINESS_EMPLOYEE_ROLE.OWNER] });

            expect(screen.getByText("NOT FOUND")).toBeInTheDocument();
            expect(
                screen.queryByText("PROTECTED CONTENT"),
            ).not.toBeInTheDocument();
        });

        it("hiányzó role (undefined) -> /not-found (ha van requirement)", () => {
            mockState(makeEmployee()); // nincs role

            renderGuard({ roles: [BUSINESS_EMPLOYEE_ROLE.OWNER] });

            expect(screen.getByText("NOT FOUND")).toBeInTheDocument();
        });
    });

    describe("PERMISSION check", () => {
        it("ha nincs megadva permissions -> engedi (nem fut permission check)", () => {
            mockState(makeEmployee());

            renderGuard();

            expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
        });

        it("employee rendelkezik a required permission-nel -> engedi", () => {
            mockState(
                makeEmployee({
                    permissions: [BUSINESS_PERMISSIONS.MANAGE_EMPLOYEES],
                }),
            );

            renderGuard({
                permissions: [BUSINESS_PERMISSIONS.MANAGE_EMPLOYEES],
            });

            expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
        });

        it("több required permission valamelyike megvan (some) -> engedi", () => {
            mockState(
                makeEmployee({
                    permissions: [BUSINESS_PERMISSIONS.VIEW_STATISTICS],
                }),
            );

            renderGuard({
                permissions: [
                    BUSINESS_PERMISSIONS.MANAGE_EMPLOYEES,
                    BUSINESS_PERMISSIONS.VIEW_STATISTICS,
                ],
            });

            expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
        });

        it("egyik required permission sincs meg -> /not-found", () => {
            mockState(
                makeEmployee({
                    permissions: [
                        BUSINESS_PERMISSIONS.EDIT_OWN_SCHEDULE,
                        BUSINESS_PERMISSIONS.CREATE_BOOKING,
                    ],
                }),
            );

            renderGuard({
                permissions: [
                    BUSINESS_PERMISSIONS.MANAGE_BUSINESS_SETTINGS,
                    BUSINESS_PERMISSIONS.VIEW_ALL_GUESTS,
                ],
            });

            expect(screen.getByText("NOT FOUND")).toBeInTheDocument();
        });

        it("üres permissions lista -> /not-found (ha van requirement)", () => {
            mockState(makeEmployee()); // permissions default []

            renderGuard({
                permissions: [BUSINESS_PERMISSIONS.VIEW_SERVICES],
            });

            expect(screen.getByText("NOT FOUND")).toBeInTheDocument();
        });
    });

    describe("kombinált ROLE + PERMISSION check", () => {
        it("mindkét requirement teljesül -> engedi", () => {
            mockState(
                makeEmployee({
                    role: BUSINESS_EMPLOYEE_ROLE.OWNER,
                    permissions: [
                        BUSINESS_PERMISSIONS.EDIT_ALL_BOOKINGS,
                        BUSINESS_PERMISSIONS.VIEW_ALL_SCHEDULE,
                    ],
                }),
            );

            renderGuard({
                roles: [BUSINESS_EMPLOYEE_ROLE.OWNER],
                permissions: [BUSINESS_PERMISSIONS.EDIT_ALL_BOOKINGS],
            });

            expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
        });

        it("role jó, de permission hiányzik -> /not-found", () => {
            mockState(
                makeEmployee({
                    role: BUSINESS_EMPLOYEE_ROLE.OWNER,
                    permissions: [],
                }),
            );

            renderGuard({
                roles: [BUSINESS_EMPLOYEE_ROLE.OWNER],
                permissions: [BUSINESS_PERMISSIONS.VIEW_ALL_STATISTICS],
            });

            expect(screen.getByText("NOT FOUND")).toBeInTheDocument();
        });

        it("permission jó, de role nem -> /not-found", () => {
            mockState(
                makeEmployee({
                    role: BUSINESS_EMPLOYEE_ROLE.EMPLOYEE,
                    permissions: [BUSINESS_PERMISSIONS.EDIT_OWN_SERVICES],
                }),
            );

            renderGuard({
                roles: [BUSINESS_EMPLOYEE_ROLE.MANAGER],
                permissions: [BUSINESS_PERMISSIONS.EDIT_OWN_SERVICES],
            });

            expect(screen.getByText("NOT FOUND")).toBeInTheDocument();
        });

        it("nincs se roles se permissions -> minden bejelentkezett employee-t enged", () => {
            mockState(makeEmployee({ role: BUSINESS_EMPLOYEE_ROLE.EMPLOYEE }));

            renderGuard();

            expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument();
        });
    });
});
