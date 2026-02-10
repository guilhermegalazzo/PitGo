"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  if (!apiKey) {
    console.warn("Google Maps API Key missing");
    return <>{children}</>;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      {children}
    </APIProvider>
  );
}
