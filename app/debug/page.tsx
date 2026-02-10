
export default function DebugPage() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return (
        <div style={{ padding: 40, fontFamily: 'monospace' }}>
            <h1>Debug Server Side</h1>
            <p><strong>Supabase URL:</strong> {url || "MISSING"}</p>
            <p><strong>Supabase Key:</strong> {key ? "PRESENT (Hidden)" : "MISSING"}</p>
            <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || "MISSING"}</p>
        </div>
    );
}
