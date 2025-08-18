import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { authService } from '@/services/authService';

export default function IndexGate() {
  const [ready, setReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    authService.fetchProfile()
      .then((p) => setIsAuthed(!!p))
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <Redirect href={isAuthed ? '/(tabs)' : '/auth/login'} />;
}

