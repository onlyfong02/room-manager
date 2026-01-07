import { useTranslation } from 'react-i18next';

export default function ContractsPage() {
    const { t } = useTranslation();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">{t('contracts.title')}</h1>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-gray-600">{t('contracts.list')}</p>
            </div>
        </div>
    );
}
