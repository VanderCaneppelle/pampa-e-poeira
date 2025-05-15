import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpyblxwkiiougygcmjlu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweWJseHdraWlvdWd5Z2Ntamx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzQyNTQsImV4cCI6MjA2MjkxMDI1NH0.r7VdugTjubcREUET90YeoV6YAmrM7yLgwAUoyCLFNGg';
export const supabase = createClient(supabaseUrl, supabaseKey);