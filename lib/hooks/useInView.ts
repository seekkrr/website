"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
}

/**
 * Custom hook to detect when an element enters the viewport.
 * Uses IntersectionObserver for performance.
 *
 * @example
 * const { ref, isInView } = useInView({ threshold: 0.2, once: true });
 * return <div ref={ref}>{isInView && <Content />}</div>;
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
    threshold = 0.1,
    rootMargin = "0px",
    once = true,
}: UseInViewOptions = {}) {
    const ref = useRef<T>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const inView = entry.isIntersecting;
                setIsInView(inView);

                if (inView && once) {
                    observer.unobserve(element);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, once]);

    return { ref, isInView };
}
