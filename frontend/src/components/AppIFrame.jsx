// src/components/AppIFrame.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import LoadingScreen from './LoadingScreen';

export default function AppIFrame({ app, token }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle iframe loading
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle iframe error
  const handleIframeError = () => {
    setError('Failed to load the application');
    setIsLoading(false);
  };

  // Setup postMessage communication with the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Validate the origin of the message
      // In production, you'd check against your app domains

      // Handle different message types
      if (event.data && event.data.type) {
        switch (event.data.type) {
          case 'APP_LOADED':
            console.log('App signaled it loaded successfully');
            break;
          case 'APP_ERROR':
            console.error('App reported an error:', event.data.error);
            setError(`App error: ${event.data.error}`);
            break;
          // Add more message types as needed
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Clean up event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Post auth token to iframe after it loads
  useEffect(() => {
    if (!isLoading && iframeRef.current) {
      // Short delay to ensure iframe is fully loaded
      const timer = setTimeout(() => {
        try {
          iframeRef.current.contentWindow.postMessage(
            { type: 'AUTH_TOKEN', token },
            '*' // In production, specify exact target origin
          );
        } catch (err) {
          console.error('Error posting message to iframe:', err);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, token]);

  const iframeUrl = `${app.url}?token=${encodeURIComponent(token)}`;

  return (
    <div className="iframe-container">
      {isLoading && <LoadingScreen message={`Loading ${app.name}...`} />}

      {error && (
        <div className="p-4 m-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={iframeUrl}
        title={app.name}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ display: isLoading ? 'none' : 'block' }}
        allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
        loading="lazy"
      />
    </div>
  );
}