'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import JobList from '@/components/jobs/JobList';

export default function JobsPage() {
  return (
    <AppLayout>
      <JobList />
    </AppLayout>
  );
}
