
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvukjmqgivreixeiihrg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dWtqbXFnaXZyZWl4ZWlpaHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNjAwMTcsImV4cCI6MjA2MzYzNjAxN30.zMkMyJ0RQuSFVUbfnf0wYj0oMlLbn26REAx756wPdUY'

export const supabase = createClient(supabaseUrl, supabaseKey)
