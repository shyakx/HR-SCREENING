'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import JobForm from '@/components/jobs/JobForm';
import { useRouter } from 'next/navigation';

export default function CreateJobPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <JobForm onClose={() => router.push('/jobs')} />
      </div>
    </AppLayout>
  );
}
