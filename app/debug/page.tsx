"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
    const [envInfo, setEnvInfo] = useState<string>("Loading...");

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        setEnvInfo(`
      Supabase URL: ${url ? url.substring(0, 15) + "..." : "MISSING"}
      Supabase Key: ${key ? "PRESENT" : "MISSING"}
      App URL: ${process.env.NEXT_PUBLIC_APP_URL || "MISSING"}
    `);
    }, []);

    return (
        <div className="p-10 font-mono whitespace-pre-wrap bg-white text-black min-h-screen">
            <h1 className="text-xl font-bold mb-4">Environment Debug</h1>
            {envInfo}
        </div>
    );
}
