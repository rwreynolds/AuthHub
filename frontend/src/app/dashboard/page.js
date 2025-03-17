// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import AppIFrame from '@/components/AppIFrame';
import AppSwitcher from '@/components/AppSwitcher';

export default function Dashboard() {
  const { user, loading, getToken } = useAuth();
  const [userPreferences, setUserPreferences] = useState(null);
  const [availableApps, setAvailableApps] = useState([]);
  const [currentApp, setCurrentApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user preferences and available apps
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const token = getToken();
      if (!token) return;

      try {
        // Fetch user preferences
        const prefsResponse = await fetch('/api/preferences/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!prefsResponse.ok) {
          throw new Error('Failed to fetch preferences');
        }

        const prefsData = await prefsResponse.json();
        setUserPreferences(prefsData);

        // Fetch available apps
        const appsResponse = await fetch('/api/apps', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!appsResponse.ok) {
          throw new Error('Failed to fetch apps');
        }

        const appsData = await appsResponse.json();
        setAvailableApps(appsData);

        // Set current app based on user preferences
        const preferredApp = appsData.find(app => app.id === prefsData.preferred_app);
        setCurrentApp(preferredApp || (appsData.length > 0 ? appsData[0] : null));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user, getToken]);

  // Update user preferences when changing app
  const handleAppChange = async (app) => {
    setCurrentApp(app);

    const token = getToken();
    if (!token) return;

    try {
      // Update user preferences in the backend
      await fetch('/api/preferences/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          preferred_app: app.id
        })
      });

      // Update local state
      setUserPreferences({
        ...userPreferences,
        preferred_app: app.id
      });
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  };

  if (loading || isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">App Platform</h1>
          </div>

          <div className="flex items-center gap-4">
            {currentApp && (
              <span className="text-sm font-medium text-gray-700">
                Current App: {currentApp.name}
              </span>
            )}

            <AppSwitcher
              apps={availableApps}
              currentApp={currentApp}
              onAppChange={handleAppChange}
            />

            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                {user?.display_name || user?.username}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {(user?.display_name || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        {currentApp ? (
          <AppIFrame app={currentApp} token={getToken()} />
        ) : (
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">No apps available</h2>
              <p>Please contact your administrator to get access to applications.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}