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
  gap: 0;
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

  // Create markers - one per campaign location (campaigns can have multiple locations)
  const createMarkers = useCallback(() => {
    if (!googleMapRef.current || campaigns.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const formatCurrency = (amount: number): string => {
      if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
      }
      return `$${amount}`;
    };

    campaigns.forEach((campaign) => {
      const org = organizations.find((o) => o.id === campaign.organization.id);
      const color = getCategoryColor(campaign.category || org?.category);
      const orgName = org?.name || campaign.organization.name;
      const orgId = org?.id || campaign.organization.id;

      // Get all locations for this campaign
      const campaignLocations =
        campaign.locations && campaign.locations.length > 0
          ? campaign.locations
          : campaign.latitude && campaign.longitude
            ? [
                {
                  name: campaign.location || 'Location',
                  latitude: campaign.latitude,
                  longitude: campaign.longitude,
                },
              ]
            : org?.latitude && org?.longitude
              ? [{ name: org.name, latitude: org.latitude, longitude: org.longitude }]
              : [];

      // Create a marker for each location
      campaignLocations.forEach((loc, locIndex) => {
        const marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(loc.latitude, loc.longitude),
          map: googleMapRef.current || undefined,
          title: `${campaign.title} - ${loc.name}`,
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

        const progressPercentage = Math.min(
          (campaign.raisedAmount / campaign.goalAmount) * 100,
          100
        );
        const markerId = `${campaign.id}-${locIndex}`;

        const infoContent = `
          <div style="padding: 0; min-width: 280px; max-width: 320px; font-family: 'Montserrat', sans-serif; overflow: hidden; border-radius: 0.5rem;">
            ${
              campaign.featuredImageUrl
                ? `<div
                    id="campaign-image-${markerId}"
                    style="
                    width: 100%;
                    height: 120px;
                    background-image: url('${campaign.featuredImageUrl}');
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    cursor: pointer;
                    transition: opacity 0.2s;
                  "
                  onmouseover="this.style.opacity='0.9'"
                  onmouseout="this.style.opacity='1'"
                  >
                    <div style="
                      position: absolute;
                      bottom: 0.5rem;
                      left: 0.5rem;
                      background: ${color};
                      color: white;
                      padding: 0.25rem 0.5rem;
                      border-radius: 0.75rem;
                      font-size: 0.625rem;
                      font-weight: 600;
                    ">${campaign.category || 'Campaign'}</div>
                  </div>`
                : ''
            }
            <div style="padding: 0.75rem;">
              <h3
                id="campaign-title-${markerId}"
                style="margin: 0 0 0.25rem 0; color: #1f2937; font-size: 0.9375rem; font-weight: 700; line-height: 1.3; cursor: pointer; transition: color 0.2s;"
                onmouseover="this.style.color='${color}'" onmouseout="this.style.color='#1f2937'"
              >
                ${campaign.title}
              </h3>
              <p style="margin: 0 0 0.25rem 0; font-size: 0.6875rem; color: #6b7280; display: flex; align-items: center; gap: 0.25rem;">
                <span style="display: inline-block; width: 0.25rem; height: 0.25rem; background: ${color}; border-radius: 50%;"></span>
                ${orgName}
              </p>
              <p style="margin: 0 0 0.5rem 0; font-size: 0.625rem; color: #9ca3af; font-style: italic;">
                ${loc.name}
              </p>
              <p style="margin: 0 0 0.75rem 0; font-size: 0.75rem; color: #4b5563; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${campaign.shortDescription || ''}
              </p>
              <div style="margin-bottom: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                  <span style="font-size: 0.6875rem; color: #6b7280;">Progress</span>
                  <span style="font-size: 0.75rem; font-weight: 600; color: #00a0c4;">${Math.round(progressPercentage)}%</span>
                </div>
                <div style="width: 100%; height: 0.375rem; background: #e5e7eb; border-radius: 0.1875rem; overflow: hidden;">
                  <div style="width: ${progressPercentage}%; height: 100%; background: linear-gradient(90deg, #00a0c4, #0077b6);"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.25rem;">
                  <span style="font-size: 0.625rem; color: #6b7280;">${formatCurrency(campaign.raisedAmount)} raised</span>
                  <span style="font-size: 0.625rem; color: #6b7280;">${formatCurrency(campaign.goalAmount)} goal</span>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <button
                  id="view-org-${markerId}"
                  style="
                    flex: 1;
                    padding: 0.5rem 0.75rem;
                    background-color: transparent;
                    color: ${color};
                    border: 1.5px solid ${color};
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-size: 0.75rem;
                    font-weight: 600;
                    transition: all 0.2s;
                  "
                  onmouseover="this.style.background='${color}10'"
                  onmouseout="this.style.background='transparent'"
                >
                  View Org
                </button>
                <button
                  id="view-campaign-${markerId}"
                  style="
                    flex: 1;
                    padding: 0.5rem 0.75rem;
                    background-color: ${color};
                    color: white;
                    border: none;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-size: 0.75rem;
                    font-weight: 600;
                    transition: all 0.2s;
                  "
                  onmouseover="this.style.background='${color}dd'"
                  onmouseout="this.style.background='${color}'"
                >
                  Donate
                </button>
              </div>
            </div>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent,
          maxWidth: 340,
        });

        if (marker.addListener) {
          marker.addListener('click', () => {
            if (googleMapRef.current) {
              infoWindow.open(googleMapRef.current, marker);

              // Add click listeners after info window opens
              setTimeout(() => {
                const viewOrgBtn = document.getElementById(`view-org-${markerId}`);
                const viewCampaignBtn = document.getElementById(`view-campaign-${markerId}`);
                const campaignImage = document.getElementById(`campaign-image-${markerId}`);
                const campaignTitle = document.getElementById(`campaign-title-${markerId}`);

                if (viewOrgBtn && onMarkerClick) {
                  viewOrgBtn.onclick = () => {
                    infoWindow.close();
                    onMarkerClick(orgId);
                  };
                }

                if (viewCampaignBtn && onCampaignMarkerClick) {
                  viewCampaignBtn.onclick = () => {
                    infoWindow.close();
                    onCampaignMarkerClick(campaign);
                  };
                }

                // Image click navigates to campaign
                if (campaignImage && onCampaignMarkerClick) {
                  campaignImage.onclick = () => {
                    infoWindow.close();
                    onCampaignMarkerClick(campaign);
                  };
                }

                // Title click navigates to campaign
                if (campaignTitle && onCampaignMarkerClick) {
                  campaignTitle.onclick = () => {
                    infoWindow.close();
                    onCampaignMarkerClick(campaign);
                  };
                }
              }, 100);
            }
          });
        }

        markersRef.current.push(marker);
      }); // End campaignLocations.forEach
    }); // End campaigns.forEach
  }, [organizations, campaigns, onMarkerClick, onCampaignMarkerClick, zoomLevel]);

  // Update markers when organizations change
  useEffect(() => {
    if (!isLoading) {
      requestAnimationFrame(() => {
        setTimeout(createMarkers, 100);
      });
    }
  }, [createMarkers, isLoading]);

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
    </MapSection>
  );
}
