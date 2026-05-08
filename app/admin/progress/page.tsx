import AdminSectionPage from '@/components/admin/AdminSectionPage';

export const dynamic = 'force-dynamic';

export default function AdminProgressPage() {
  return (
    <AdminSectionPage
      eyebrow="Admin / Progress"
      title="Progress"
      description="Review learner progress and keep a clean overview of how content is performing."
      highlights={[
        { label: 'Active learners', value: '—' },
        { label: 'Completion rate', value: '—' },
        { label: 'Pending reviews', value: '—' },
      ]}
    />
  );
}
