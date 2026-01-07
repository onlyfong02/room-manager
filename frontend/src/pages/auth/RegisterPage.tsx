import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';

export default function RegisterPage() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
    });
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (data) => {
            setAuth(data.data.user, data.data.accessToken);
            navigate('/');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || t('auth.registerError'));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">{t('auth.registerTitle')}</h1>
                <p className="text-center text-gray-600 mb-8">{t('auth.registerSubtitle')}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.fullName')}</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')}</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.phone')}</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.password')}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {registerMutation.isPending ? t('auth.registering') : t('auth.register')}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                        {t('auth.loginNow')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
