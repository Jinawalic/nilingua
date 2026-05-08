import AdminSectionPage from '@/components/admin/AdminSectionPage';

export const dynamic = 'force-dynamic';

export default function AdminVocabularyPage() {
  return (
    <AdminSectionPage
      eyebrow="Admin / Vocabulary"
      title="Vocabulary"
      description="Organize word lists, meanings, and translations for every supported language."
      highlights={[
        { label: 'Languages', value: '3' },
        { label: 'Word sets', value: '—' },
        { label: 'Entries', value: '—' },
      ]}
    />
  );
}
