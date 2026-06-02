import './ContentStyle.css'
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';

function Content() {
    const globeRef = useRef<any>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [countries, setCountries] = useState({ features: []});
    const [dimensions, setDimensions] = useState({ width: 1200, height: 550 });

    useEffect(() => {
      fetch('https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson').then(res => res.json())
        .then(countries=> {
          setCountries(countries);
        });
    }, []);

    const handleGlobeReady = useCallback(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.8;
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

        updateDimensions();

        const observer = new ResizeObserver(updateDimensions);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const visitedCountries = [
        { lat: 52.5200, lng: 13.4050, label: 'Berlin, Germany', color: '#1E3A77', size: 0.3 },
        { lat: 48.8566, lng: 2.3522, label: 'Paris, France', color: '#1E3A77', size: 0.3 },
        { lat: 41.9028, lng: 12.4964, label: 'Rome, Italy', color: '#1E3A77', size: 0.3 }
    ];

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
                <Globe
                    ref={globeRef}
                    width={1200}
                    height={dimensions.height}

                    onGlobeReady={handleGlobeReady}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
                    backgroundColor="white"
                    
                    pointsData={visitedCountries}
                    pointLabel="label"
                    pointColor="color"
                    pointRadius="size"

                    pointsTransitionDuration={1000}
                    
                        polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
                    polygonAltitude={0.01} 
                    polygonCapColor={() => '#1E3A77'} 
                    polygonSideColor={() => '#1E3A77}'}
                    polygonStrokeColor={() => '#FFFFFF'} 
                    polygonLabel={(d:any) => d.properties?.ADMIN || d.properties?.name || 'Country'}                        
                    onPolygonClick={(polygon: any, _event, _coords) => {
                        const countryName = polygon.properties?.ADMIN || polygon.properties?.name;
                        console.log(`You clicked on: ${countryName}`);
                    }}
                />
            </div>
        </div>
    );
}

export default Content;