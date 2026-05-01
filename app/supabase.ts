import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqucfngjngmkcgxggvyf.supabase.co'
const supabaseKey = 'sb_publishable_OUkL6Ghf1j2odVpQAEuHOA_2mzgwLBo'

export const supabase = createClient(supabaseUrl, supabaseKey)