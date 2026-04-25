'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import JobForm from '@/components/jobs/JobForm';
import { useParams, useRouter } from 'next/navigation';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <JobForm jobId={jobId} onClose={() => router.push('/jobs')} />
      </div>
    </AppLayout>
  );
}
