
export default function DebugPage() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    return (
        <div style={{ padding: 40, fontFamily: 'monospace' }}>
            <h1>Debug Server Side v2</h1>
            <p><strong>Supabase URL:</strong> {url}</p>
            <p><strong>Supabase Key (Start):</strong> {key ? key.substring(0, 10) + "..." : "MISSING"}</p>
            <p><strong>Maps Key (Start):</strong> {mapsKey ? mapsKey.substring(0, 5) + "..." : "MISSING"}</p>
            <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || "MISSING"}</p>
        </div>
    );
}
