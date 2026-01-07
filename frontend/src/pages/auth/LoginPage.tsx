import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';

export default function LoginPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setAuth(data.data.user, data.data.accessToken);
            navigate('/');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || t('auth.loginError'));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">{t('auth.loginTitle')}</h1>
                <p className="text-center text-gray-600 mb-8">{t('auth.loginSubtitle')}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loginMutation.isPending ? t('auth.loggingIn') : t('auth.login')}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {t('auth.dontHaveAccount')}{' '}
                    <Link to="/register" className="text-primary font-medium hover:underline">
                        {t('auth.registerNow')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
