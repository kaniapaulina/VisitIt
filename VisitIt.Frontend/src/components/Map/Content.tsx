import './ContentStyle.css'
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';

function Content() {
    const globeRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [polygonFeatures, setPolygonFeatures] = useState<any[]>([]);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 550 });
    
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(data => {
                const features = data.features.filter((d: any) =>
                    d.geometry?.type === 'Polygon' ||
                    d.geometry?.type === 'MultiPolygon'
                );
                console.log('Valid polygons:', features.length);
                setPolygonFeatures(features);
            })
            .catch(err => console.error('Failed:', err));
    }, []);

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

    const visitedCountries = [
        { lat: 52.5200, lng: 13.4050, label: 'Berlin, Germany', color: '#1E3A77', size: 0.3 },
        { lat: 48.8566, lng: 2.3522, label: 'Paris, France', color: '#1E3A77', size: 0.3 },
        { lat: 41.9028, lng: 12.4964, label: 'Rome, Italy', color: '#1E3A77', size: 0.3 }
    ];

    console.log('Rendering polygons:', polygonFeatures.length);

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
            {polygonFeatures.length > 0 &&  (
                <Globe
                    ref={globeRef}
                    width={dimensions.width}
                    height={dimensions.height}

                    onGlobeReady={handleGlobeReady}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
                    backgroundColor='white'
                    
                    pointsData={visitedCountries}
                    pointLabel="label"
                    pointColor="color"
                    pointRadius="size"

                    pointsTransitionDuration={1000}
                    
                    polygonsData={polygonFeatures}
                    polygonAltitude={0.01}

                    polygonCapColor={() => '#1E3A77'} 
                    polygonSideColor={() => '#1E3A77'}
                    polygonStrokeColor={() => '#FFFFFF'} 
                    polygonLabel={(d: any) => d.properties?.ADMIN || d.properties?.name || 'Country'}
                    onPolygonClick={(polygon: any, _event, _coords) => {
                        const countryName = polygon.properties?.ADMIN || polygon.properties?.name;
                        console.log(`You clicked on: ${countryName}`);
                    }}

                />
            )};
            </div>
        </div>
    );
}

export default Content;