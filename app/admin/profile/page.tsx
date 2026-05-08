import AdminSectionPage from '@/components/admin/AdminSectionPage';

export const dynamic = 'force-dynamic';

export default function AdminProfilePage() {
  return (
    <AdminSectionPage
      eyebrow="Admin / Profile"
      title="Profile"
      description="View or update the administrative profile area in a dedicated, focused space."
      highlights={[
        { label: 'Account', value: 'Admin' },
        { label: 'Status', value: 'Active' },
        { label: 'Access', value: 'Full' },
      ]}
    />
  );
}
