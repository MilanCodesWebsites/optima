import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const supabaseUrl = 'https://nejdxfsrspyggycvqlen.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lamR4ZnNyc3B5Z2d5Y3ZxbGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTIxMjksImV4cCI6MjA3MjIyODEyOX0.4HzGDUDebD3cx_s6VdNYH06Q_TiTueuT1aGo8Ev-J2o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function to verify Supabase connection
export const testSupabaseConnection = async () => {
  try {
    // Try to fetch a simple query from the admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('Admin users found:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}
