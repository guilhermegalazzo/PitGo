"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Navigation, Loader2, AlertTriangle } from "lucide-react";

interface LocationSearchProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
  initialValue?: string;
  autoDetect?: boolean;
}

export function LocationSearch({
  onLocationSelect,
  placeholder = "Enter location...",
  initialValue = "",
  autoDetect = false
}: LocationSearchProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [apiReady, setApiReady] = useState(false);
  const [apiError, setApiError] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Check if google.maps is loaded
  useEffect(() => {
    const check = () => {
      if (typeof google !== "undefined" && google.maps) {
        setApiReady(true);
        return true;
      }
      return false;
    };
    if (!check()) {
      const interval = setInterval(() => {
        if (check()) clearInterval(interval);
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  // Auto-detect on mount
  useEffect(() => {
    if (autoDetect && apiReady && !inputValue) {
      detectLocation();
    }
  }, [autoDetect, apiReady]);

  const fetchSuggestions = async (value: string) => {
    if (!apiReady || value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      // Use the NEW Places API (AutocompleteSuggestion) 
      if (google.maps.places && 'AutocompleteSuggestion' in google.maps.places) {
        const { suggestions: results } = await (google.maps.places as any).AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: value,
          includedRegionCodes: ["BR"],
        });

        if (results && results.length > 0) {
          const mapped = results.map((s: any) => ({
            place_id: s.placePrediction?.placeId || s.placePrediction?.place || '',
            description: s.placePrediction?.text?.text || '',
            main_text: s.placePrediction?.mainText?.text || s.placePrediction?.text?.text || '',
            secondary_text: s.placePrediction?.secondaryText?.text || '',
          }));
          setSuggestions(mapped);
          setApiError(false);
          return;
        }
      }

      // Fallback: try legacy AutocompleteService (might work for some accounts)
      if (google.maps.places?.AutocompleteService) {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          { input: value, componentRestrictions: { country: "br" } },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              const mapped = predictions.map(p => ({
                place_id: p.place_id,
                description: p.description,
                main_text: p.structured_formatting?.main_text || p.description,
                secondary_text: p.structured_formatting?.secondary_text || '',
              }));
              setSuggestions(mapped);
              setApiError(false);
            } else {
              setApiError(true);
            }
          }
        );
        return;
      }

      setApiError(true);
    } catch (err) {
      console.warn("Autocomplete error:", err);
      setApiError(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Always call onLocationSelect with typed text so form is never blocked
    if (value.length >= 3) {
      onLocationSelect(value, -23.561414, -46.655881);
    }

    // Debounce autocomplete calls
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSelectSuggestion = async (suggestion: any) => {
    setLoading(true);
    setSuggestions([]);
    setInputValue(suggestion.description);

    try {
      // Try new Place API first
      if (google.maps.places && 'Place' in google.maps.places) {
        const place = new (google.maps.places as any).Place({ id: suggestion.place_id });
        await place.fetchFields({ fields: ['location', 'formattedAddress'] });

        if (place.location) {
          const lat = place.location.lat();
          const lng = place.location.lng();
          const address = place.formattedAddress || suggestion.description;
          setInputValue(address);
          onLocationSelect(address, lat, lng);
          setLoading(false);
          return;
        }
      }

      // Fallback: Geocoding API
      if (google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: suggestion.description }, (results, status) => {
          setLoading(false);
          if (status === "OK" && results?.[0]?.geometry?.location) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            const address = results[0].formatted_address || suggestion.description;
            setInputValue(address);
            onLocationSelect(address, lat, lng);
          } else {
            // Use typed address as fallback
            onLocationSelect(suggestion.description, -23.561414, -46.655881);
          }
        });
        return;
      }

      setLoading(false);
      onLocationSelect(suggestion.description, -23.561414, -46.655881);
    } catch (err) {
      setLoading(false);
      onLocationSelect(suggestion.description, -23.561414, -46.655881);
    }
  };

  const detectLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Reverse geocode
          if (apiReady && google.maps.Geocoder) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              setLoading(false);
              if (status === "OK" && results?.[0]) {
                const address = results[0].formatted_address;
                setInputValue(address);
                onLocationSelect(address, lat, lng);
              } else {
                setInputValue("Sua Localização");
                onLocationSelect("Sua Localização", lat, lng);
              }
            });
          } else {
            setLoading(false);
            setInputValue("Sua Localização");
            onLocationSelect("Sua Localização", lat, lng);
          }
        },
        (error) => {
          setLoading(false);
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLoading(false);
    }
  };

  // Manual fallback — just press Enter
  const handleManualEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.length >= 3) {
      onLocationSelect(inputValue, -23.561414, -46.655881);
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-1 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
        <Search className="h-4 w-4 text-primary" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleManualEnter}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none py-3 text-sm w-full font-bold text-white placeholder:text-white/20"
        />
        <button
          onClick={detectLocation}
          disabled={loading}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors shrink-0"
          type="button"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Navigation className="h-4 w-4 text-primary" />
          )}
        </button>
      </div>

      {apiError && (
        <div className="mt-2 flex items-start gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <AlertTriangle className="h-3 w-3 text-orange-500 mt-1 shrink-0" />
          <p className="text-[9px] font-black uppercase tracking-widest text-orange-500/80 leading-tight">
            Autocomplete indisponível. <br /> Pressione ENTER para usar endereço manual.
          </p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A3D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
          {suggestions.map((s, idx) => (
            <div
              key={s.place_id || idx}
              onClick={() => handleSelectSuggestion(s)}
              className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-start gap-3 border-b border-white/5 last:border-0"
            >
              <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{s.main_text}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">{s.secondary_text}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
