import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface FishingZone {
  id: string;
  name: string;
  type: 'allowed' | 'restricted';
  coordinates: { lat: number; lng: number }[];
  description: string;
}

interface OpenStreetMapProps {
  userLocation?: { lat: number; lng: number } | null;
  vessels?: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }>;
  fishingZones?: FishingZone[];
  height?: number;
}

export default function OpenStreetMap({ userLocation, vessels = [], fishingZones = [], height = 400 }: OpenStreetMapProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Default location (center of ocean)
  const defaultLat = userLocation?.lat || 0;
  const defaultLng = userLocation?.lng || 0;
  const zoom = 10;

  // Helper function to escape HTML and prevent script injection
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Generate markers HTML for vessels with proper escaping
  const vesselsMarkersHTML = vessels.map(vessel => {
    const escapedName = escapeHtml(vessel.name);
    return `
    L.marker([${vessel.latitude}, ${vessel.longitude}], {
      icon: L.divIcon({
        html: '<div style="background: #0ea5e9; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap;">🚢 ${escapedName}</div>',
        className: 'vessel-marker',
        iconSize: [null, null]
      })
    }).addTo(map);
  `}).join('\n');

  // User location marker (safe, no user input)
  const userMarkerHTML = userLocation ? `
    L.marker([${userLocation.lat}, ${userLocation.lng}], {
      icon: L.divIcon({
        html: '<div style="background: #ef4444; color: white; padding: 6px 10px; border-radius: 4px; font-size: 14px; font-weight: bold;">📍 You</div>',
        className: 'user-marker',
        iconSize: [null, null]
      })
    }).addTo(map);
  ` : '';

  // Generate fishing zones polygons
  const fishingZonesHTML = fishingZones.map(zone => {
    const escapedName = escapeHtml(zone.name);
    const escapedDescription = escapeHtml(zone.description);
    const coords = zone.coordinates.map(coord => `[${coord.lat}, ${coord.lng}]`).join(',');
    const color = zone.type === 'allowed' ? '#4CAF50' : '#f44336';
    const fillOpacity = zone.type === 'allowed' ? 0.2 : 0.3;
    
    return `
    var zone_${zone.id} = L.polygon([${coords}], {
      color: '${color}',
      fillColor: '${color}',
      fillOpacity: ${fillOpacity},
      weight: 2
    }).addTo(map).bindPopup('<b>${escapedName}</b><br>${escapedDescription}');
  `}).join('\n');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
        crossorigin=""/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossorigin=""></script>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        #map {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        .vessel-marker, .user-marker {
          border: none;
          background: transparent;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        try {
          // Initialize map
          var map = L.map('map', {
            center: [${defaultLat}, ${defaultLng}],
            zoom: ${zoom},
            zoomControl: true,
            preferCanvas: true
          });
          
          // Add tile layer with error handling
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
            minZoom: 2,
            errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
          }).addTo(map);

          // Force map to recalculate size after load
          setTimeout(function() {
            map.invalidateSize();
          }, 100);

          // Add fishing zones
          ${fishingZonesHTML}

          // Add user location marker
          ${userMarkerHTML}

          // Add vessel markers
          ${vesselsMarkersHTML}

          // Auto-fit bounds if we have vessels
          ${vessels.length > 0 ? `
            setTimeout(function() {
              try {
                var bounds = L.latLngBounds([
                  ${userLocation ? `[${userLocation.lat}, ${userLocation.lng}],` : ''}
                  ${vessels.map(v => `[${v.latitude}, ${v.longitude}]`).join(',\n')}
                ]);
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
              } catch (e) {
                console.error('Error fitting bounds:', e);
              }
            }, 200);
          ` : ''}

          console.log('Map initialized successfully at', ${defaultLat}, ${defaultLng});
        } catch (error) {
          console.error('Error initializing map:', error);
          document.body.innerHTML = '<div style="padding: 20px; color: red;">Map Error: ' + error.message + '</div>';
        }
      </script>
    </body>
    </html>
  `;

  // Always show map if we have user location, even without vessels
  if (!userLocation) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card, height }]}>
        <Text style={[styles.emptyText, { color: colors.icon }]}>
          📍 Enable location to see map
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mixedContentMode="always"
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={['*']}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView HTTP error:', nativeEvent.statusCode);
        }}
        onMessage={(event) => {
          console.log('Map message:', event.nativeEvent.data);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  emptyContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
  },
});
