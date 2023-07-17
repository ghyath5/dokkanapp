import React, {createContext, useEffect, useState, useContext} from 'react';
import {Profile, Props} from '../types';
import {supabase} from '../supabase';
import {ActivityIndicator, Alert} from 'react-native';

// Define the type for the context value
interface AppContextValue {
  activeScreen: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
  setActiveScreen: (screen: string) => void;
  checkSession: () => Promise<Profile | undefined>;
}

// Create the initial context value
const initialContextValue: AppContextValue = {
  activeScreen: '',
  isLoggedIn: false,
  setIsLoggedIn: (state: boolean) => {},
  setActiveScreen: (screen: string) => {},
  checkSession: () => new Promise(r => {}),
};

// Create the context
export const AppContext = createContext<AppContextValue>(initialContextValue);

// Create a provider component
export const AppProvider: React.FC<Props> = ({children}) => {
  const [activeScreen, setActiveScreen] = useState<string>('');
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const checkSession = async (): Promise<Profile | undefined> => {
    const {data} = await supabase.auth.getSession();
    const response = await supabase
      .from('users')
      .select('id, name, username, address');

    setIsloading(false);
    if (data?.session?.access_token && response.data?.length) {
      setIsLoggedIn(true);
      return response.data[0];
    }
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    if (
      (data?.session?.access_token && !response.data?.length) ||
      response.error
    ) {
      Alert.alert('حسابك معطل، راسل المشرف');
    }
  };
  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AppContext.Provider
      value={{
        setIsLoggedIn,
        isLoggedIn,
        setActiveScreen,
        activeScreen,
        checkSession,
      }}>
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
