import { redirect } from 'next/navigation';
import { createClient } from '@/libs/supabase/server';
import { fetchProfileById } from '@/services/kudos-compose-service';
import ComposeKudoModal from '@/components/kudos/compose/ComposeKudoModal';
import type { SunnerRef } from '@/types/kudos';

interface ComposePageProps {
  searchParams: Promise<{ to?: string }>;
}

export default async function ComposeKudoPage({ searchParams }: ComposePageProps) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect('/auth/login?redirect=/kudos/compose');
  }

  const params = await searchParams;
  const toId = params.to;

  let initialReceiver: SunnerRef | null = null;
  if (toId) {
    try {
      initialReceiver = await fetchProfileById(toId);
    } catch {
      // ignore — just don't pre-fill
    }
  }

  return <ComposeKudoModal variant="fullpage" initialReceiver={initialReceiver} />;
}
