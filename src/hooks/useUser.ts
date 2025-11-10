
// src/app/hooks/useUser.ts
import { useEffect, useState } from 'react';
import { supabase } from '../app/lib/supabase';

export function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Busca o usuário logado
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Escuta mudanças de login/logout
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user };
}
