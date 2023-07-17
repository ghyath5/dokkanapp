import {User} from '@supabase/supabase-js';
import React, {createContext, useState, useContext, useEffect} from 'react';
import {Profile, Props} from '../types';
import {supabase} from '../supabase';
import {useApp} from './AppContext';
import {Alert} from 'react-native';

interface AuthContextType {
  user: Profile | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: '',
  signIn: (email: string, password: string): any => {},
  signOut: (): any => {},
  loading: false,
});

export const AuthProvider: React.FC<Props> = ({children}) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {checkSession} = useApp();
  const {setIsLoggedIn} = useApp();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const {data, error} = await supabase.auth.signInWithPassword({
        email: `${email.trim()}@gmial.com`,
        password,
      });
      if (error || !data.session) {
        // Handle error
        return Alert.alert('فشل تسجيل الدخول، تأكد من المعلومات');
      } else {
        // Update user state
        // This will return nothing while the user is logged out
        const response = await supabase
          .from('users')
          .select('id, name, username, address');

        if (!response.data?.length || response.error) {
          return Alert.alert('حسابك معطل، راسل المشرف');
        }
        setUser(response.data[0]);
        // // Update token state
        setToken(data.session.access_token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      return Alert.alert('فشل تسجيل الدخول');
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut({scope: 'global'});
    setIsLoggedIn(false);
    // Call Supabase to sign out the user
    // Handle success and error scenarios
  };
  useEffect(() => {
    checkSession().then(profile => {
      if (profile) return setUser(profile);
      signOut();
    });
  }, []);

  const authContextValue: AuthContextType = {
    user,
    signIn,
    signOut,
    token,
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
