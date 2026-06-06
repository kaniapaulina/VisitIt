// src/components/Map/Content.tsx
import './ContentStyle.css'
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { useJourneys } from '../../hooks/useJourney';

interface VisitedCountry {
  code: string;
  name: string;
  status: 'visited' | 'wantToVisit';
}

// Props: tylko funkcja do klikania
interface ContentProps {
  onCountryClick: (country: { name: string; code: string }) => void;
}

function Content({ onCountryClick }: ContentProps) {
    const globeRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [polygonFeatures, setPolygonFeatures] = useState<any[]>([]);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 550 });
    const [visitedCountries, setVisitedCountries] = useState<VisitedCountry[]>([]);
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    
    const { journeys } = useJourneys();

    // Aktualizuj visitedCountries
    useEffect(() => {
        if (journeys && journeys.length > 0) {
            const countries: VisitedCountry[] = journeys.map((j: any) => ({
                code: j.country,
                name: j.location || j.country,
                status: 'visited' as const
            }));
            setVisitedCountries(countries);
        }
    }, [journeys]);

    // Załaduj dane geograficzne
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(data => {
                const features = data.features.filter((d: any) =>
                    d.geometry?.type === 'Polygon' ||
                    d.geometry?.type === 'MultiPolygon'
                );
                setPolygonFeatures(features);
            })
            .catch(err => console.error('Failed:', err));
    }, []);

    const getPolygonColor = useCallback((feature: any) => {
        const countryCode = feature.properties?.ISO_A3 || feature.properties?.iso_a3;
        if (hoveredCountry === countryCode) return '#90A4AE';
        
        const visited = visitedCountries.find(c => c.code === countryCode);
        if (visited?.status === 'visited') return '#2E7D32';
        if (visited?.status === 'wantToVisit') return '#F57C00';
        
        return '#546E7A';
    }, [visitedCountries, hoveredCountry]);

    const getPolygonAltitude = useCallback((feature: any) => {
        const countryCode = feature.properties?.ISO_A3 || feature.properties?.iso_a3;
        return hoveredCountry === countryCode ? 0.05 : 0.01;
    }, [hoveredCountry]);

    const handleGlobeReady = useCallback(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.3;
            globeRef.current.controls().enableZoom = true;
            globeRef.current.controls().enablePan = false;
        }
    }, []);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width: width || 1200, height: height || 550 });
            }
        };

        const timer = setTimeout(updateDimensions, 100);
        const observer = new ResizeObserver(updateDimensions);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    // Kliknięcie na kraj - tylko przekazuje info do rodzica
    const handlePolygonClick = useCallback((polygon: any) => {
        const countryName = polygon.properties?.ADMIN || polygon.properties?.name;
        const countryCode = polygon.properties?.ISO_A3 || polygon.properties?.iso_a3;
        
        // Zatrzymaj auto-obrót
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
        }
        
        // Przekaż info do UserHome
        onCountryClick({ name: countryName, code: countryCode });
    }, [onCountryClick]);

    const handlePolygonHover = useCallback((polygon: any | null) => {
        if (polygon) {
            setHoveredCountry(polygon.properties?.ISO_A3 || polygon.properties?.iso_a3);
        } else {
            setHoveredCountry(null);
        }
    }, []);

    return (
        <div className="content">
            <div
                ref={containerRef}
                className='content-map'
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                {polygonFeatures.length > 0 && (
                    <Globe
                        ref={globeRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        onGlobeReady={handleGlobeReady}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
                        backgroundColor='white'
                        polygonsData={polygonFeatures}
                        polygonAltitude={getPolygonAltitude}
                        polygonCapColor={getPolygonColor}
                        polygonSideColor={() => '#37474F'}
                        polygonStrokeColor={() => '#FFFFFF'}
                        polygonLabel={(d: any) => {
                            const name = d.properties?.ADMIN || d.properties?.name || 'Country';
                            const code = d.properties?.ISO_A3 || d.properties?.iso_a3;
                            const visited = visitedCountries.find(c => c.code === code);
                            return visited 
                                ? `${name} ✓`
                                : name;
                        }}
                        onPolygonClick={handlePolygonClick}
                        onPolygonHover={handlePolygonHover}
                    />
                )}
            </div>
        </div>
    );
}

export default Content;