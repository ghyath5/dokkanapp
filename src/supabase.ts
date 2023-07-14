import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://crkrfubycchydiwccztq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNya3JmdWJ5Y2NoeWRpd2NjenRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk0NjcyMzIsImV4cCI6MTk3NTA0MzIzMn0.2Oc1lWgDQDBiX_G2Eu3KnvXj_BqQoiMlHjO9DQObVWM';
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
