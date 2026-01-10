import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

    const handleChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <span className="text-lg">{currentLang.flag}</span>
                    <span className="hidden sm:inline font-medium">{currentLang.name}</span>
                    <Globe className="h-4 w-4 sm:hidden" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleChange(lang.code)}
                        className={lang.code === i18n.language ? 'bg-accent' : ''}
                    >
                        <span className="text-lg mr-2">{lang.flag}</span>
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
