'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import ScreeningDashboard from '@/components/screening/ScreeningDashboard';

export default function ScreeningPage() {
  return (
    <AppLayout>
      <ScreeningDashboard />
    </AppLayout>
  );
}
