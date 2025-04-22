
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressMapProps {
  address: string;
  onAddressChange?: (address: string) => void;
  readOnly?: boolean;
}

const AddressMap = ({ address, onAddressChange, readOnly = false }: AddressMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 15
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !address || !mapboxToken) return;

    // Convert address to coordinates using Mapbox Geocoding API
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`)
      .then(response => response.json())
      .then(data => {
        const [lng, lat] = data.features[0]?.center || [0, 0];
        
        map.current?.setCenter([lng, lat]);
        
        // Clear existing markers
        const existingMarker = document.querySelector('.mapboxgl-marker');
        if (existingMarker) {
          existingMarker.remove();
        }
        
        // Add marker
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!);
      })
      .catch(err => console.error('Error geocoding address:', err));
  }, [address, mapboxToken]);

  return (
    <div className="space-y-4">
      {!mapboxToken && (
        <div className="space-y-2">
          <Label htmlFor="mapbox-token">Enter your Mapbox public token to enable the map</Label>
          <Input
            id="mapbox-token"
            type="text"
            placeholder="pk.eyJ1..."
            onChange={(e) => setMapboxToken(e.target.value)}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => onAddressChange?.(e.target.value)}
          readOnly={readOnly}
        />
      </div>
      {mapboxToken && (
        <div ref={mapContainer} className="h-[300px] w-full rounded-md border" />
      )}
    </div>
  );
};

export default AddressMap;
