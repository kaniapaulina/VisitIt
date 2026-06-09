import './ContentStyle.css'
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { useJourneys } from '../../hooks/useJourney';

interface VisitedCountry {
  code: string;
  name: string;
  status: 'visited' | 'wantToVisit';
}

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
        if (visited?.status === 'visited') return '#124d3e';
        
        return '#5f8a6b';
    }, [visitedCountries, hoveredCountry]);

    const getPolygonAltitude = useCallback((feature: any) => {
        const countryCode = feature.properties?.ISO_A3 || feature.properties?.iso_a3;
        return hoveredCountry === countryCode ? 0.02 : 0.009;
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

    const handlePolygonClick = useCallback((polygon: any) => {
        const countryName = polygon.properties?.ADMIN || polygon.properties?.name;
        const countryCode = polygon.properties?.ISO_A3 || polygon.properties?.iso_a3;
        
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
        }
        
        onCountryClick({ name: countryName, code: countryCode });
    }, [onCountryClick]);

    const handlePolygonHover = useCallback((polygon: any | null) => {
        if (polygon) {
            setHoveredCountry(polygon.properties?.ISO_A3 || polygon.properties?.iso_a3);
        } else {
            setHoveredCountry(null);
        }
    }, []);

    const getPolygonLabel = useCallback((d: any) => {
        const name = d.properties?.ADMIN || d.properties?.name || 'Country';
        const code = d.properties?.ISO_A3 || d.properties?.iso_a3;
        const visited = visitedCountries.find(c => c.code === code);
        
        if (visited) {
            return `
                <div style="
                    background-color: rgba(26,104,85, 0.3);
                    color: white;
                    padding: 10px 14px;
                    font-family: 'Segoe UI', sans-serif;
                    min-width: 100px;
                    text-align: center;
                ">
                    <div style="font-size: 16px; font-weight: 600;">
                        ${name} (✔)
                    </div>
                </div>
            `;
        }
        
        return `
            <div style="
                background-color: rgba(255, 255, 255, 0.15);
                color: white;
                padding: 10px 14px;
                font-family: 'Segoe UI', sans-serif;
                font-weight: 400;
                min-width: 100px;
                text-align: center;
            ">
                <div style="font-size: 16px; font-weight: 500;">
                    ${name}
                </div>
            </div>
        `;
    }, [visitedCountries]);

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
                        backgroundImageUrl={undefined}
                        backgroundColor='#d7ecd3'
                        polygonsData={polygonFeatures}
                        polygonAltitude={getPolygonAltitude}
                        polygonCapColor={getPolygonColor}
                        polygonSideColor={() => '#285233'}
                        polygonStrokeColor={() => '#d7ecd3'}
                        polygonLabel={getPolygonLabel}
                        onPolygonClick={handlePolygonClick}
                        onPolygonHover={handlePolygonHover}
                    />
                )}
            </div>
        </div>
    );
}

export default Content;