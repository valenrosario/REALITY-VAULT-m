import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { Series, AppConfig } from '../../types';
import { SERIES_DATA, MARQUEE_TEXT, SOCIAL_LINKS } from '../../constants';

interface AppContextType {
  seriesData: Series[];
  appConfig: AppConfig;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seriesData, setSeriesData] = useState<Series[]>(SERIES_DATA);
  const [appConfig, setAppConfig] = useState<AppConfig>({ marqueeText: MARQUEE_TEXT, socialLinks: SOCIAL_LINKS });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let seriesLoaded = false;
    let configLoaded = false;
    
    const checkLoading = () => {
      if (seriesLoaded && configLoaded) setIsLoading(false);
    };

    const unsubscribeSeries = onSnapshot(collection(db, 'series'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Series));
      data.sort((a, b) => (a.order || 0) - (b.order || 0));
      if (data.length > 0) {
        setSeriesData(data);
      } else {
        setSeriesData(SERIES_DATA);
      }
      seriesLoaded = true;
      checkLoading();
    });

    const unsubscribeConfig = onSnapshot(doc(db, 'appConfig', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setAppConfig(docSnap.data() as AppConfig);
      } else {
        setAppConfig({ marqueeText: MARQUEE_TEXT, socialLinks: SOCIAL_LINKS });
      }
      configLoaded = true;
      checkLoading();
    });

    return () => {
      unsubscribeSeries();
      unsubscribeConfig();
    };
  }, []);

  return (
    <AppContext.Provider value={{ seriesData, appConfig, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
