// src/test/factories.ts
import type { User } from "../helpers/types/User";
import type { Business } from "../helpers/types/Business";
import type { BusinessEmployee } from "../helpers/types/BusinessEmployee";
import { Authorities } from "../helpers/types/Authorities";

export const DEFAULT_USER: User = {
    id: 1,
    login: "testuser",
    email: "testuser@example.com",
    firstName: "Test",
    lastName: "User",
    imageUrl: "",
    imagePublicId: "",
    activated: true,
    langKey: "hu",
    createdDate: new Date("2024-01-01T00:00:00Z"),
    authorities: [Authorities.ROLE_USER],
    onboardingVersion: 1,
    fullName: "Test User",
};

export function makeUser(overrides: Partial<User> = {}): User {
    return { ...DEFAULT_USER, ...overrides };
}

// A mockolt state csak a userStore slice-t tartalmazza –
// a többi slice (generalStore, appointmentStore, timeOffStore)
// ezekben a tesztekben nem releváns.
interface RootStateShape {
    userStore: {
        user: User | null;
        selectedBusinessEmployee: BusinessEmployee | null;
    };
}

// ⬇️ `never` paraméterrel a selector bármilyen state-típusra "futtatható":
// a kontravariáns paraméter miatt minden valódi selector ide besorolható.
type AnySelector = (state: never) => unknown;

/**
 * Beállítja a useAppSelector mockot úgy, hogy a VALÓDI selectort
 * futtatja a mock state-en – akárcsak a redux.
 */
export function setUserStore(
    selectorMock: {
        mockImplementation: (fn: (selector: AnySelector) => unknown) => void;
    },
    {
        userId,
        ownerId,
        onboardingCompleted,
        withEmployee = true,
    }: {
        userId?: number;
        ownerId?: number;
        onboardingCompleted?: boolean;
        withEmployee?: boolean;
    },
) {
    const businessOwner: User | null =
        ownerId !== undefined ? makeUser({ id: ownerId }) : null;

    const business = {
        onboardingCompleted,
        owner: businessOwner,
    } as Business;

    const state: RootStateShape = {
        userStore: {
            user: userId !== undefined ? makeUser({ id: userId }) : null,
            selectedBusinessEmployee: withEmployee
                ? ({ business } as BusinessEmployee)
                : null,
        },
    };

    // ⬇️ A valódi selectort futtatjuk a mock state-en.
    // A `state as never` cast itt biztonságos: a mock csak a
    // userStore slice-t tartalmazza, amire ezek a selectorekből
    // ténylegesen hivatkozás történik.
    selectorMock.mockImplementation((selector) => selector(state as never));
}
