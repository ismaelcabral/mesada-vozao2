-- Fix RLS policy for user_settings to allow new users to insert their own settings
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;

-- Allow users to insert their own settings right after signup
CREATE POLICY "Users can insert their own settings" 
ON public.user_settings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Ensure users can view their own settings
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update their own settings
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Parents can view settings of their linked children
DROP POLICY IF EXISTS "Parents can view children settings" ON public.user_settings;
CREATE POLICY "Parents can view children settings" 
ON public.user_settings 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id 
  OR auth.uid() = parent_user_id
);