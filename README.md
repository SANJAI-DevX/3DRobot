Complete Guide: Implementing Spline 3D Scene in React
Table of Contents
Prerequisites
Project Setup
Installing Dependencies
Creating Your Spline Scene
Setting Up the React Component
Adding CSS Styles
Implementing Camera Controls
Testing and Troubleshooting
Deployment
Prerequisites
Before starting, ensure you have:

Node.js (version 14 or higher)
npm or yarn package manager
A Spline account (free at spline.design)
Basic knowledge of React and JavaScript
1. Project Setup
Step 1.1: Create a New React Project
bash
# Using Create React App
npx create-react-app spline-3d-viewer
cd spline-3d-viewer

# OR using Vite (recommended)
npm create vite@latest spline-3d-viewer -- --template react
cd spline-3d-viewer
npm install
Step 1.2: Clean Up Default Files
Delete or clear these files:

src/App.css (we'll replace with custom styles)
src/logo.svg
Remove default content from src/App.js
2. Installing Dependencies
Step 2.1: Install Spline React Package
bash
npm install @splinetool/react-spline
Step 2.2: Install Tailwind CSS (for styling)
bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Generate config files
npx tailwindcss init -p
Step 2.3: Configure Tailwind CSS
Update tailwind.config.js:

javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
3. Creating Your Spline Scene
Step 3.1: Design in Spline Editor
Go to spline.design
Create a new account or log in
Create a new project
Design your 3D scene:
Add 3D objects
Set up materials and lighting
Position your camera
Add animations if needed
Step 3.2: Export Your Scene
Click "Export" in the top-right corner
Select "Code Export"
Choose "React"
Copy the scene URL (looks like: https://prod.spline.design/XXXXXXX/scene.splinecode)
Step 3.3: Test Your Scene URL
Verify your scene URL works by visiting it directly in a browser.

4. Setting Up the React Component
Step 4.1: Create the Spline Component
Create src/components/SplineViewer.js:

javascript
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
        camera.controls.minDistance = initialDistance * 0.9;
        camera.controls.maxDistance = initialDistance * 1.1;
        
        // Set rotation limits
        camera.controls.maxPolarAngle = Math.PI * 0.75;
        camera.controls.minPolarAngle = Math.PI * 0.25;
        
        // Set smooth rotation
        camera.controls.rotateSpeed = 0.3;
        camera.controls.dampingFactor = 0.1;
        camera.controls.enableDamping = true;
        camera.controls.autoRotate = false;
        
        // Add event listener to enforce bounds
        camera.controls.addEventListener('change', () => {
          const currentDistance = Math.sqrt(
            Math.pow(camera.position.x - initialTarget.x, 2) +
            Math.pow(camera.position.y - initialTarget.y, 2) +
            Math.pow(camera.position.z - initialTarget.z, 2)
          );
          
          if (currentDistance !== initialDistance) {
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
    // Aggressive control restrictions
    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    const handleKeyDown = (e) => {
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

    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 shadow-lg">
        <h1 className="text-white text-2xl font-bold text-center text-shadow">
          Your 3D Scene
        </h1>
        <p className="text-purple-200 text-center mt-1">
          Interactive 3D Experience
        </p>
      </div>

      {/* Spline Viewer Container */}
      <div className="flex-1 relative bg-black overflow-hidden spline-container-locked">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
            <div className="text-white text-center fade-in">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6 loading-spinner"></div>
              <p className="text-xl font-semibold mb-2">Loading 3D Scene...</p>
              <p className="text-sm text-gray-400">Powered by Spline</p>
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
            scene="YOUR_SPLINE_SCENE_URL_HERE"
            onLoad={handleLoad}
            onError={handleError}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              cursor: 'grab'
            }}
          />
          
          {/* Interaction overlay */}
          <div 
            className="absolute inset-0 pointer-events-auto"
            style={{ zIndex: 10 }}
            onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
            onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
            onMouseLeave={(e) => e.currentTarget.style.cursor = 'grab'}
            onWheel={(e) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              return false;
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 p-3 text-center">
        <p className="text-gray-400 text-sm">
          Interactive 3D scene created with{' '}
          <a 
            href="https://spline.design" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors underline"
          >
            Spline
          </a>
        </p>
      </div>
    </div>
  );
};

export default SplineViewer;
Step 4.2: Update App.js
Replace content in src/App.js:

javascript
import React from 'react';
import SplineViewer from './components/SplineViewer';
import './App.css';

function App() {
  return (
    <div className="App">
      <SplineViewer />
    </div>
  );
}

export default App;
Step 4.3: Create Components Directory
bash
mkdir src/components
5. Adding CSS Styles
Step 5.1: Create App.css
Replace src/App.css with:

css
/* App.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  background-color: #000;
  color: #fff;
}

#root {
  height: 100%;
}

/* Spline viewer specific fixes - STRICT CAMERA CONTROL */
spline-viewer canvas {
  outline: none !important;
  -webkit-user-drag: none !important;
  -khtml-user-drag: none !important;
  -moz-user-drag: none !important;
  -o-user-drag: none !important;
  user-drag: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
  touch-action: none !important;
  -webkit-context-menu: none !important;
  -moz-context-menu: none !important;
  context-menu: none !important;
}

/* Desktop-specific controls */
@media (min-width: 768px) {
  spline-viewer canvas {
    -ms-content-zooming: none !important;
    -webkit-touch-callout: none !important;
    cursor: grab !important;
  }
  
  spline-viewer canvas:active {
    cursor: grabbing !important;
  }
  
  spline-viewer {
    overflow: hidden !important;
    position: relative !important;
  }
}

/* Loading animation */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(147, 51, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.8);
  }
}

.loading-spinner {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Utility classes */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-container {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.spline-container-locked {
  overflow: hidden !important;
  position: relative !important;
}

.spline-container-locked * {
  max-width: 100% !important;
  max-height: 100% !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1F2937;
}

::-webkit-scrollbar-thumb {
  background: #6B46C1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #7C3AED;
}

/* Focus states for accessibility */
button:focus,
a:focus {
  outline: 2px solid #A855F7;
  outline-offset: 2px;
}

/* Smooth transitions */
* {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}
6. Implementing Camera Controls
Step 6.1: Replace Scene URL
In SplineViewer.js, replace this line:

javascript
scene="YOUR_SPLINE_SCENE_URL_HERE"
With your actual Spline scene URL:

javascript
scene="https://prod.spline.design/XXXXXXX/scene.splinecode"
Step 6.2: Customize Camera Settings (Optional)
You can adjust these values in the handleLoad function:

javascript
// Rotation speed (0.1 = slow, 1.0 = fast)
camera.controls.rotateSpeed = 0.3;

// Vertical rotation limits (in radians)
camera.controls.maxPolarAngle = Math.PI * 0.75; // Don't go too far up
camera.controls.minPolarAngle = Math.PI * 0.25; // Don't go too far down

// Distance limits (percentage of original distance)
camera.controls.minDistance = initialDistance * 0.9; // 90% of original
camera.controls.maxDistance = initialDistance * 1.1; // 110% of original
7. Testing and Troubleshooting
Step 7.1: Start Development Server
bash
npm start
Step 7.2: Common Issues and Fixes
Issue: Scene doesn't load

✅ Check if your Spline scene URL is correct
✅ Ensure your Spline scene is published (public)
✅ Check browser console for errors
Issue: Camera controls not working

✅ Verify the onLoad function is being called
✅ Check if spline.camera.controls exists
✅ Try logging camera properties in console
Issue: Scene loads but appears black

✅ Check lighting in your Spline scene
✅ Verify camera position in Spline editor
✅ Try different background colors
Issue: Performance problems

✅ Optimize your Spline scene (reduce polygons)
✅ Compress textures in Spline
✅ Test on different devices
Step 7.3: Debug Mode
Add this to temporarily debug camera issues:

javascript
const handleLoad = (spline) => {
  console.log('Spline loaded:', spline);
  console.log('Camera:', spline.camera);
  console.log('Controls:', spline.camera?.controls);
  
  // Rest of your handleLoad code...
};
8. Deployment
Step 8.1: Build for Production
bash
npm run build
Step 8.2: Deploy to Netlify
Create account at netlify.com
Drag and drop your build folder
Or connect your GitHub repository
Step 8.3: Deploy to Vercel
bash
npm install -g vercel
vercel --prod
Step 8.4: Deploy to GitHub Pages
bash
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
Final Checklist
✅ React project created
✅ Spline package installed
✅ Tailwind CSS configured
✅ Spline scene created and published
✅ Scene URL added to component
✅ Camera controls implemented
✅ CSS styles applied
✅ Error handling added
✅ Loading states implemented
✅ Local testing completed
✅ Production build successful
✅ Deployed to hosting platform
Additional Resources
Spline Documentation: spline.design/docs
React Documentation: reactjs.org/docs
Tailwind CSS: tailwindcss.com/docs
Spline React Package: npmjs.com/package/@splinetool/react-spline
Support
If you encounter issues:

Check the browser console for errors
Verify your Spline scene URL is accessible
Test with a simple Spline scene first
Check network connectivity
Try different browsers
Happy coding! 🚀

