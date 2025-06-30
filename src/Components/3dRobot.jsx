import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

const SplineViewer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const splineRef = useRef(null);

  const handleLoad = (spline) => {
    splineRef.current = spline;
    setIsLoading(false);
    
    // Configure camera controls with strict limits
    if (spline && spline.camera) {
      const camera = spline.camera;
      
      // Store initial camera position and target
      const initialPosition = { ...camera.position };
      const initialTarget = camera.target ? { ...camera.target } : { x: 0, y: 0, z: 0 };
      const initialDistance = Math.sqrt(
        Math.pow(initialPosition.x - initialTarget.x, 2) +
        Math.pow(initialPosition.y - initialTarget.y, 2) +
        Math.pow(initialPosition.z - initialTarget.z, 2)
      );
      
      if (camera.controls) {
        // Disable all movement except rotation
        camera.controls.enableZoom = false;
        camera.controls.enablePan = false;
        camera.controls.enableRotate = true;
        
        // Set strict distance limits
        camera.controls.minDistance = initialDistance * 0.9; // Only 10% closer
        camera.controls.maxDistance = initialDistance * 1.1; // Only 10% further
        
        // Set rotation limits to prevent going too far
        camera.controls.maxPolarAngle = Math.PI * 0.75; // Don't go too far up
        camera.controls.minPolarAngle = Math.PI * 0.25; // Don't go too far down
        
        // Limit horizontal rotation
        camera.controls.maxAzimuthAngle = Math.PI * 2; // Full rotation allowed
        camera.controls.minAzimuthAngle = -Math.PI * 2;
        
        // Set smooth rotation
        camera.controls.rotateSpeed = 0.3;
        camera.controls.dampingFactor = 0.1;
        camera.controls.enableDamping = true;
        
        // Disable auto-rotate
        camera.controls.autoRotate = false;
        
        // Add event listener to enforce bounds
        camera.controls.addEventListener('change', () => {
          // Keep camera at fixed distance
          const currentDistance = Math.sqrt(
            Math.pow(camera.position.x - initialTarget.x, 2) +
            Math.pow(camera.position.y - initialTarget.y, 2) +
            Math.pow(camera.position.z - initialTarget.z, 2)
          );
          
          if (currentDistance !== initialDistance) {
            // Normalize position to maintain distance
            const direction = {
              x: (camera.position.x - initialTarget.x) / currentDistance,
              y: (camera.position.y - initialTarget.y) / currentDistance,
              z: (camera.position.z - initialTarget.z) / currentDistance
            };
            
            camera.position.x = initialTarget.x + direction.x * initialDistance;
            camera.position.y = initialTarget.y + direction.y * initialDistance;
            camera.position.z = initialTarget.z + direction.z * initialDistance;
          }
        });
      }
    }
  };

  const handleError = (error) => {
    console.error('Spline scene failed to load:', error);
    setError('Failed to load 3D scene');
    setIsLoading(false);
  };

  useEffect(() => {
    // More aggressive control restrictions
    const handleWheel = (e) => {
      // Completely prevent any wheel interactions
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    const handleKeyDown = (e) => {
      // Prevent all navigation keys
      const restrictedKeys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
        '+', '-', '=', 'PageUp', 'PageDown', 'Home', 'End',
        'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'
      ];
      if (restrictedKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleMouseMove = (e) => {
      // Ensure camera stays within bounds during movement
      if (splineRef.current && splineRef.current.camera && e.buttons === 1) {
        const camera = splineRef.current.camera;
        // Additional bounds checking can be added here if needed
      }
    };

    // Add event listeners with capture to catch events early
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      // Cleanup
      document.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black flex flex-col">
     
<h1>Hello World !</h1>
      {/* Spline Viewer Container */}
      <div className="flex-1 relative bg-black overflow-hidden">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
            <div className="text-white text-center fade-in">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6 loading-spinner"></div>
              <p className="text-xl font-semibold mb-2">Loading 3D Scene...</p>

              <div className="mt-4 w-64 bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
            <div className="text-white text-center error-container max-w-md mx-4">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-xl text-red-400 mb-2">{error}</p>
              <p className="text-sm text-gray-400 mb-4">
                Please check your internet connection and try refreshing the page
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Spline Scene */}
        <div className="w-full h-full relative">
          <Spline
            scene="https://prod.spline.design/Shpw3hRcRBM09j4B/scene.splinecode"
            onLoad={handleLoad}
            onError={handleError}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              cursor: 'grab'
            }}
          />
          
          {/* Interaction overlay to control mouse behavior */}
          <div 
            className="absolute inset-0 pointer-events-auto"
            style={{ zIndex: 10 }}
            onMouseDown={(e) => {
              e.currentTarget.style.cursor = 'grabbing';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.cursor = 'grab';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.cursor = 'grab';
            }}
            onWheel={(e) => {
              // Completely prevent zoom
              e.preventDefault();
              e.stopPropagation();
              return false;
            }}
            onContextMenu={(e) => {
              // Prevent right-click menu
              e.preventDefault();
              return false;
            }}
            onDragStart={(e) => {
              // Prevent drag behavior
              e.preventDefault();
              return false;
            }}
          />
        </div>
      </div>

  
    </div>
  );
};

export default SplineViewer;