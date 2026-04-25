'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import ApplicantList from '@/components/applicants/ApplicantList';

export default function ApplicantsPage() {
  return (
    <AppLayout>
      <ApplicantList />
    </AppLayout>
  );
}
