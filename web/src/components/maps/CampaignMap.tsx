import { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Organization, Campaign } from '../../api/types';

interface CampaignMapProps {
  organizations: Organization[];
  campaigns?: Campaign[];
  onMarkerClick?: (organizationId: string) => void;
  onCampaignMarkerClick?: (campaign: Campaign) => void;
}

interface GoogleMapsAPI {
  Map: new (element: HTMLElement, options?: GoogleMapOptions) => GoogleMap;
  Marker: new (options?: MarkerOptions) => GoogleMarker;
  InfoWindow: new (options?: InfoWindowOptions) => GoogleInfoWindow;
  LatLng: new (lat: number, lng: number) => GoogleLatLng;
  MapTypeControlStyle: Record<string, number>;
  ControlPosition: Record<string, number>;
  SymbolPath: Record<string, number>;
  Point: new (x: number, y: number) => GooglePoint;
  Animation: Record<string, number>;
  event: {
    addListener: (
      instance: GoogleMap | GoogleMarker,
      eventName: string,
      handler: () => void
    ) => void;
  };
}

interface GoogleMapOptions {
  center?: GoogleLatLng;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  mapTypeId?: string;
  disableDefaultUI?: boolean;
  zoomControl?: boolean;
  fullscreenControl?: boolean;
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  mapTypeControlOptions?: {
    style?: number;
    position?: number;
  };
  styles?: Array<{
    featureType?: string;
    elementType?: string;
    stylers?: Array<Record<string, string | number>>;
  }>;
}

interface MarkerOptions {
  position?: GoogleLatLng;
  map?: GoogleMap | null;
  title?: string;
  icon?: string | GoogleMarkerIcon;
  animation?: number;
}

interface InfoWindowOptions {
  content?: string;
  maxWidth?: number;
}

interface GoogleMarkerIcon {
  url?: string;
  path?: string | number;
  size?: GoogleSize;
  origin?: GooglePoint;
  anchor?: GooglePoint;
  scaledSize?: GoogleSize;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWeight?: number;
  scale?: number;
}

interface GoogleMap {
  setCenter: (latLng: GoogleLatLng) => void;
  setZoom: (zoom: number) => void;
  panTo: (latLng: GoogleLatLng) => void;
  getZoom: () => number;
  addListener?: (event: string, handler: () => void) => void;
}

interface GoogleMarker {
  setMap: (map: GoogleMap | null) => void;
  setPosition: (latLng: GoogleLatLng) => void;
  setIcon: (icon: string | GoogleMarkerIcon) => void;
  setAnimation: (animation: number | null) => void;
  addListener?: (event: string, handler: () => void) => void;
}

interface GoogleInfoWindow {
  open: (map: GoogleMap, marker?: GoogleMarker) => void;
  close: () => void;
  setContent: (content: string) => void;
}

interface GoogleLatLng {
  lat: () => number;
  lng: () => number;
}

interface GooglePoint {
  x: number;
  y: number;
}

interface GoogleSize {
  width: number;
  height: number;
}

declare global {
  interface Window {
    google: {
      maps: GoogleMapsAPI;
    };
  }
}

const MapSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: ${(props) => props.theme.colors.background.card};
  border: 0.0625rem solid ${(props) => props.theme.colors.border.light};

  @media (min-width: 768px) {
    height: 400px;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.background.card};
`;

const LoadingText = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const Legend = styled.div`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  border: 0.0625rem solid ${(props) => props.theme.colors.border.light};
`;

const LegendTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 0.75rem 0;
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  flex-shrink: 0;
`;

const LegendLabel = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const CATEGORY_COLORS: Record<string, string> = {
  Animals: '#F97316',
  Community: '#8B5CF6',
  Education: '#3B82F6',
  Health: '#EF4444',
  Environment: '#22C55E',
  Arts: '#EC4899',
};

const getCategoryColor = (category?: string): string => {
  if (!category) return '#00A0C4';
  return CATEGORY_COLORS[category] || '#00A0C4';
};

export function CampaignMap({
  organizations,
  campaigns = [],
  onMarkerClick,
  onCampaignMarkerClick,
}: CampaignMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return;

    const initMap = () => {
      if (!window.google?.maps) {
        return;
      }

      const map = new window.google.maps.Map(mapRef.current!, {
        zoom: 4,
        center: new window.google.maps.LatLng(39.8283, -98.5795),
        minZoom: 2.5,
        maxZoom: 18,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#a6c8f0' }],
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f2efe9' }],
          },
          {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#8f8f94' }, { weight: 1 }],
          },
        ],
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_CENTER,
        },
      } as GoogleMapOptions);

      googleMapRef.current = map;
      setIsLoading(false);

      if (map.addListener) {
        map.addListener('zoom_changed', () => {
          const zoom = map.getZoom?.() || 4;
          setZoomLevel(zoom / 4);
        });
      }
    };

    if (window.google?.maps) {
      initMap();
    } else {
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com/maps/api/js"]'
      );
      if (existingScript) {
        // Script exists but may not be loaded yet - poll for google.maps
        const checkGoogleMaps = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkGoogleMaps);
            initMap();
          }
        }, 100);
        setTimeout(() => clearInterval(checkGoogleMaps), 10000);
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => {
        setIsLoading(false);
      };
      document.head.appendChild(script);
    }
  }, []);

  // Create markers
  const createMarkers = useCallback(() => {
    if (!googleMapRef.current || organizations.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    organizations.forEach((org) => {
      if (!org.latitude || !org.longitude) return;

      const color = getCategoryColor(org.category);
      const orgCampaigns = campaigns.filter((c) => c.organization.id === org.id);
      const firstCampaign = orgCampaigns[0];

      const marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(org.latitude, org.longitude),
        map: googleMapRef.current || undefined,
        title: org.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE as unknown as string,
          scale: Math.max(zoomLevel > 1 ? 12 : 8, 8),
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 3,
          anchor: new window.google.maps.Point(0, 0),
        },
        animation: window.google.maps.Animation.DROP,
      });

      const infoContent = `
        <div style="padding: 0.5rem; min-width: 180px; font-family: 'Montserrat', sans-serif;">
          <h3 style="margin: 0 0 0.5rem 0; color: ${color}; font-size: 1rem; font-weight: 600;">${org.name}</h3>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.75rem; color: #666;">${org.campaignCount} campaign${org.campaignCount !== 1 ? 's' : ''}</p>
          <div style="display: flex; gap: 0.5rem;">
            <button
              id="view-org-${org.id}"
              style="
                flex: 1;
                padding: 0.375rem 0.5rem;
                background-color: transparent;
                color: ${color};
                border: 1px solid ${color};
                border-radius: 0.25rem;
                cursor: pointer;
                font-size: 0.75rem;
                font-weight: 600;
              "
            >
              View Org
            </button>
            ${
              firstCampaign
                ? `<button
              id="view-campaign-${firstCampaign.id}"
              style="
                flex: 1;
                padding: 0.375rem 0.5rem;
                background-color: ${color};
                color: white;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
                font-size: 0.75rem;
                font-weight: 600;
              "
            >
              Campaign
            </button>`
                : ''
            }
          </div>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
      });

      if (marker.addListener) {
        marker.addListener('click', () => {
          if (googleMapRef.current) {
            infoWindow.open(googleMapRef.current, marker);

            // Add click listeners after info window opens
            setTimeout(() => {
              const viewOrgBtn = document.getElementById(`view-org-${org.id}`);
              const viewCampaignBtn = document.getElementById(`view-campaign-${firstCampaign?.id}`);

              if (viewOrgBtn && onMarkerClick) {
                viewOrgBtn.onclick = () => {
                  infoWindow.close();
                  onMarkerClick(org.id);
                };
              }

              if (viewCampaignBtn && firstCampaign && onCampaignMarkerClick) {
                viewCampaignBtn.onclick = () => {
                  infoWindow.close();
                  onCampaignMarkerClick(firstCampaign);
                };
              }
            }, 100);
          }
        });
      }

      markersRef.current.push(marker);
    });
  }, [organizations, campaigns, onMarkerClick, onCampaignMarkerClick, zoomLevel]);

  // Update markers when organizations change
  useEffect(() => {
    if (!isLoading) {
      requestAnimationFrame(() => {
        setTimeout(createMarkers, 100);
      });
    }
  }, [createMarkers, isLoading]);

  const categoryTypes = Object.keys(CATEGORY_COLORS);

  return (
    <MapSection>
      <MapWrapper>
        <MapContainer ref={mapRef} />
        {isLoading && (
          <LoadingOverlay>
            <LoadingText>Loading map...</LoadingText>
          </LoadingOverlay>
        )}
      </MapWrapper>
      <Legend>
        <LegendTitle>Campaign Categories</LegendTitle>
        <LegendGrid>
          {categoryTypes.map((category) => (
            <LegendItem key={category}>
              <LegendDot $color={CATEGORY_COLORS[category]} />
              <LegendLabel>{category}</LegendLabel>
            </LegendItem>
          ))}
        </LegendGrid>
      </Legend>
    </MapSection>
  );
}
