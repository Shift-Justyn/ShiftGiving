import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Organization } from '../../api/types';

interface CampaignMapProps {
  organizations: Organization[];
  onMarkerClick?: (organizationId: string) => void;
}

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (min-width: 768px) {
    height: 400px;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;

  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const ScrollOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
`;

const ScrollMessage = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const CATEGORY_COLORS: Record<string, string> = {
  Animals: '#F97316',
  Community: '#8B5CF6',
  Education: '#3B82F6',
  Health: '#EF4444',
  Environment: '#22C55E',
};

const getCategoryColor = (category?: string): string => {
  if (!category) return '#00A0C4';
  return CATEGORY_COLORS[category] || '#00A0C4';
};

const createDotIcon = (color: string) => {
  return L.divIcon({
    className: 'dot-marker',
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background-color: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
  });
};

export function CampaignMap({ organizations, onMarkerClick }: CampaignMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [showScrollMessage, setShowScrollMessage] = useState(false);
  const hideMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
    }).setView([39.8283, -98.5795], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !leafletMapRef.current) return;

    const map = leafletMapRef.current;

    const handleWheel = (e: WheelEvent) => {
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      if (modifierKey) {
        map.scrollWheelZoom.enable();
        if (hideMessageTimeoutRef.current) {
          clearTimeout(hideMessageTimeoutRef.current);
        }
        setShowScrollMessage(false);
      } else {
        map.scrollWheelZoom.disable();
        setShowScrollMessage(true);

        if (hideMessageTimeoutRef.current) {
          clearTimeout(hideMessageTimeoutRef.current);
        }
        hideMessageTimeoutRef.current = setTimeout(() => {
          setShowScrollMessage(false);
        }, 1500);
      }
    };

    const handleMouseLeave = () => {
      map.scrollWheelZoom.disable();
      setShowScrollMessage(false);
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: true });
    wrapper.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
      if (hideMessageTimeoutRef.current) {
        clearTimeout(hideMessageTimeoutRef.current);
      }
    };
  }, [isMac]);

  useEffect(() => {
    if (!leafletMapRef.current) return;

    const map = leafletMapRef.current;
    const markers: L.Marker[] = [];

    organizations.forEach((org) => {
      if (org.latitude && org.longitude) {
        const color = getCategoryColor(org.category);
        const dotIcon = createDotIcon(color);

        const marker = L.marker([org.latitude, org.longitude], {
          icon: dotIcon,
        }).addTo(map);

        const popupContent = `
          <div style="padding: 0.5rem;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">${org.name}</h3>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.75rem; color: #666;">${org.campaignCount} campaign${org.campaignCount !== 1 ? 's' : ''}</p>
            <button
              style="
                padding: 0.25rem 0.75rem;
                background-color: ${color};
                color: white;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
                font-size: 0.75rem;
              "
              onclick="window.dispatchEvent(new CustomEvent('map-marker-click', { detail: '${org.id}' }))"
            >
              View
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        markers.push(marker);
      }
    });

    const handleMarkerClick = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (onMarkerClick && customEvent.detail) {
        onMarkerClick(customEvent.detail);
      }
    };

    window.addEventListener('map-marker-click', handleMarkerClick);

    return () => {
      markers.forEach((marker) => marker.remove());
      window.removeEventListener('map-marker-click', handleMarkerClick);
    };
  }, [organizations, onMarkerClick]);

  const scrollMessage = isMac ? 'Use \u2318 + scroll to zoom' : 'Use Ctrl + scroll to zoom';

  return (
    <MapWrapper ref={wrapperRef}>
      <MapContainer ref={mapRef} />
      <ScrollOverlay $visible={showScrollMessage}>
        <ScrollMessage>{scrollMessage}</ScrollMessage>
      </ScrollOverlay>
    </MapWrapper>
  );
}
