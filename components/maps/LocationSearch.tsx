"use client";

import { useState, useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Search, MapPin, Loader2, Navigation } from "lucide-react";

interface LocationSearchProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
  initialValue?: string;
  autoDetect?: boolean;
}

export function LocationSearch({ onLocationSelect, placeholder, initialValue, autoDetect }: LocationSearchProps) {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const placesLibrary = useMapsLibrary("places");
  const geocodingLibrary = useMapsLibrary("geocoding");
  const autoCompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!placesLibrary) return;
    autoCompleteService.current = new placesLibrary.AutocompleteService();
    const dummyDiv = document.createElement("div");
    placesService.current = new placesLibrary.PlacesService(dummyDiv);
  }, [placesLibrary]);

  useEffect(() => {
    if (autoDetect && !initialValue) {
      handleDetectLocation();
    }
  }, [autoDetect, geocodingLibrary]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        if (geocodingLibrary) {
          const geocoder = new geocodingLibrary.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            setDetecting(false);
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              setInputValue(address);
              onLocationSelect(address, latitude, longitude);
            }
          });
        }
      },
      (error) => {
        setDetecting(false);
        console.error("Error detecting location:", error);
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value || !autoCompleteService.current) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    autoCompleteService.current.getPlacePredictions(
      { input: value, types: ["address"] },
      (results, status) => {
        setLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results);
          setIsOpen(true);
        } else {
          setPredictions([]);
        }
      }
    );
  };

  const handleSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    setInputValue(prediction.description);
    setPredictions([]);
    setIsOpen(false);

    if (!placesService.current) return;

    placesService.current.getDetails(
      { placeId: prediction.place_id, fields: ["geometry", "formatted_address"] },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          onLocationSelect(
            place.formatted_address || prediction.description,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        }
      }
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center bg-secondary/5 rounded-2xl px-4 py-2 hover:bg-secondary/10 transition-colors border border-border/50">
        <MapPin className="h-4 w-4 text-primary mr-2 shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder || "Enter your address..."}
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground h-10"
          onFocus={() => inputValue && predictions.length > 0 && setIsOpen(true)}
        />
        <button 
          onClick={handleDetectLocation}
          className="ml-2 p-2 hover:bg-primary/10 rounded-xl transition-colors text-primary"
          title="Detect my location"
          disabled={detecting}
        >
          {detecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </button>
      </div>

      {isOpen && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
          {predictions.map((p) => (
            <div
              key={p.place_id}
              onClick={() => handleSelect(p)}
              className="p-4 hover:bg-secondary/5 cursor-pointer flex items-start gap-3 transition-colors border-b border-border last:border-0"
            >
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground line-clamp-1">
                  {p.structured_formatting.main_text}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {p.structured_formatting.secondary_text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
