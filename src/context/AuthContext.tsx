import {User} from '@supabase/supabase-js';
import React, {createContext, useState, useContext} from 'react';
import {Props} from '../types';
import {supabase} from '../supabase';
import {useApp} from './AppContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: '',
  signIn: (email: string, password: string): any => {},
  signOut: (): any => {},
});

export const AuthProvider: React.FC<Props> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const {isLoggedIn, setIsLoggedIn} = useApp();

  const signIn = async (email: string, password: string) => {
    console.log(`${email}@gmila.com`);

    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email: `${email}@gmial.com`,
        password,
      });
      console.log(data);

      if (error) {
        // Handle error
      } else {
        // Update user state
        setUser(data.user);
        // // Update token state
        setToken(data.session.access_token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      // Handle error
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut({scope: 'global'});
    setIsLoggedIn(false);
    // Call Supabase to sign out the user
    // Handle success and error scenarios
  };

  const authContextValue: AuthContextType = {
    user,
    signIn,
    signOut,
    token,
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
