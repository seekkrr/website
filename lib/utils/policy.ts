export async function getMarkdownPolicy(filename: "privacy-policy" | "refund-policy" | "terms-and-conditions" | "creator-terms"): Promise<string> {
    const url = `https://cdn.jsdelivr.net/gh/seekkrr/policies@main/en/${filename}.md`;
    
    const res = await fetch(url, {
        next: { revalidate: 60 }
    });

    if (!res.ok) {
        // We throw an error instead of returning a string message so that Next.js will NOT cache the error state.
        // During ISR, if an error is thrown, Next.js discards the build and continues serving the previous successful cache.
        throw new Error(`Failed to fetch policy: ${filename} (Status: ${res.status})`);
    }

    return await res.text();
}
