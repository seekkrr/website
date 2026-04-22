export async function getMarkdownPolicy(filename: string): Promise<string> {
    // We use raw.githubusercontent.com instead of jsDelivr to avoid the 24-hour edge cache on branches.
    // GitHub's raw CDN caches objects for roughly 5 minutes, which pairs perfectly with our 60s ISG revalidation.
    const url = `https://raw.githubusercontent.com/seekkrr/policies/main/en/${filename}.md`;
    
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
