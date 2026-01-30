import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: number;
  season_id: number;
  parent_user_id: string;
  child_user_id: string;
  message: string;
  message_type: string | null;
  is_read: boolean | null;
  read_at: string | null;
  created_at: string | null;
}

// Demo user IDs for simplified mode
const DEMO_PARENT_ID = 'demo-parent-001';
const DEMO_CHILD_ID = 'demo-user-001';

export function useMessages(seasonId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!seasonId || seasonId === 0) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('motivational_messages')
        .select('*')
        .eq('season_id', seasonId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMessages(data as Message[]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [seasonId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (
    message: string,
    messageType: string = 'general',
    childUserId?: string
  ) => {
    const { data, error } = await supabase
      .from('motivational_messages')
      .insert({
        season_id: seasonId,
        parent_user_id: DEMO_PARENT_ID,
        child_user_id: childUserId || DEMO_CHILD_ID,
        message,
        message_type: messageType,
      })
      .select()
      .single();

    if (error) throw error;
    
    setMessages(prev => [data as Message, ...prev]);
    return data;
  }, [seasonId]);

  const markAsRead = useCallback(async (messageId: number) => {
    const { error } = await supabase.rpc('mark_message_as_read', { message_id: messageId });

    if (error) throw error;
    
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, is_read: true, read_at: new Date().toISOString() } : m
    ));
  }, []);

  return { messages, loading, sendMessage, markAsRead, refreshMessages: fetchMessages };
}
