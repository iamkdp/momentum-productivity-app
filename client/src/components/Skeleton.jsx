export function SkeletonCard() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-3 animate-pulse">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-2/3" />
                <div className="h-2 bg-zinc-800 rounded w-1/3" />
            </div>
        </div>
    );
}

export function SkeletonList({ count = 3 }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}