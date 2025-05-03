import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpyblxwkiiougygcmjlu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweWJseHdraWlvdWd5Z2Ntamx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODA5NjMsImV4cCI6MjA2MTg1Njk2M30.1l3Ha2onnMzq171bdECghlZINEiDsmWZizXvcFGE6T0';

export const supabase = createClient(supabaseUrl, supabaseKey);