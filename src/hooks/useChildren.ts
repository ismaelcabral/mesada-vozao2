import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChildInfo {
  user_id: string;
  athlete_name: string;
  email?: string;
}

// Demo children for simplified mode
const DEMO_CHILDREN: ChildInfo[] = [
  { user_id: 'demo-user-001', athlete_name: 'Jogador Demo' }
];

export function useChildren() {
  const [children, setChildren] = useState<ChildInfo[]>(DEMO_CHILDREN);
  const [loading, setLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildInfo | null>(DEMO_CHILDREN[0]);

  const fetchChildren = useCallback(async () => {
    // In simplified mode, just use demo children
    setChildren(DEMO_CHILDREN);
    if (!selectedChild) {
      setSelectedChild(DEMO_CHILDREN[0]);
    }
  }, [selectedChild]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return {
    children,
    selectedChild,
    setSelectedChild,
    loading,
    refreshChildren: fetchChildren,
  };
}
