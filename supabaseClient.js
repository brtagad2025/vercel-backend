import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nueljesezzonhsihycil.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZWxqZXNlenpvbmhzaWh5Y2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDY3NzUsImV4cCI6MjA2NjMyMjc3NX0.XddKSTGe7qy-cQ6BdlRDq4L0x1XlmxONtwlvoPopYPM'
);

export default supabase;
