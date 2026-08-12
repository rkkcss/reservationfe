import { useEffect, useRef, useState } from "react";
import { getSlugAvailableQuery } from "../../../helpers/queries/business-queries";
import { SlugCheckResponse } from "../../../helpers/types/SlugCheckResponse";

export const useSlugAvailability = () => {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingResolversRef = useRef<Array<(res: SlugCheckResponse) => void>>(
        [],
    );
    const confirmedAvailableSlugRef = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const checkAvailability = (value: string): Promise<SlugCheckResponse> => {
        return new Promise((resolve) => {
            pendingResolversRef.current.push(resolve);

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(async () => {
                const { data } = await getSlugAvailableQuery(value);
                const resolvers = pendingResolversRef.current;
                pendingResolversRef.current = [];
                resolvers.forEach((r) => r(data));
            }, 500);
        });
    };

    const confirmAvailable = (slug: string) => {
        confirmedAvailableSlugRef.current = slug;
        setSuggestions([]);
    };

    const isConfirmedAvailable = (value: string) =>
        confirmedAvailableSlugRef.current === value;

    const resetConfirmation = () => {
        confirmedAvailableSlugRef.current = null;
    };

    return {
        suggestions,
        setSuggestions,
        checkAvailability,
        confirmAvailable,
        isConfirmedAvailable,
        resetConfirmation,
    };
};
