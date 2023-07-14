import React, {createContext, useEffect, useState, useContext} from 'react';
import {Props} from '../types';
import {supabase} from '../supabase';
import {ActivityIndicator} from 'react-native';

// Define the type for the context value
interface AppContextValue {
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
}

// Create the initial context value
const initialContextValue: AppContextValue = {
  isLoggedIn: false,
  setIsLoggedIn: (state: boolean) => {},
};

// Create the context
export const AppContext = createContext<AppContextValue>(initialContextValue);

// Create a provider component
export const AppProvider: React.FC<Props> = ({children}) => {
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const checkSession = async () => {
    const {data} = await supabase.auth.getSession();
    if (data?.session?.access_token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setIsloading(false);
  };
  useEffect(() => {
    checkSession();
  }, []);
  return (
    <AppContext.Provider value={{setIsLoggedIn, isLoggedIn}}>
      {isLoading ? (
        <ActivityIndicator
          color={'blue'}
          size={50}
          style={{backgroundColor: 'white', flex: 1}}
        />
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};
export function useApp(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
