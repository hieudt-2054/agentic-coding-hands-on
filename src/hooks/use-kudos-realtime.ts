'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/libs/supabase/client';
import type { LiveKudoEvent } from '@/types/kudos';

const BUFFER_SIZE = 10;

type EventRow = {
  event_id: string;
  kudo_id: string;
  receiver_id: string;
  receiver_name: string;
  occurred_at: string;
};

function toLiveEvent(row: EventRow): LiveKudoEvent {
  return {
    eventId: row.event_id,
    kudoId: row.kudo_id,
    receiverId: row.receiver_id,
    receiverName: row.receiver_name,
    occurredAt: row.occurred_at,
  };
}

export function useKudosRealtime() {
  const [events, setEvents] = useState<LiveKudoEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const queryClient = useQueryClient();
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('kudos_live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'live_kudo_events' },
        payload => {
          const row = payload.new as EventRow;
          if (seenIds.current.has(row.event_id)) return;
          seenIds.current.add(row.event_id);

          setEvents(prev => {
            const next = [toLiveEvent(row), ...prev].slice(0, BUFFER_SIZE);
            return next;
          });

          queryClient.invalidateQueries({ queryKey: ['kudos-feed'] });
          queryClient.invalidateQueries({ queryKey: ['kudos-highlights'] });
          queryClient.invalidateQueries({ queryKey: ['kudos-spotlight'] });
        }
      )
      .subscribe(status => {
        setConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { events, connected };
}
