import { Link } from 'react-router-dom';
import { BookOpen, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-white border-t border-slate-100 mt-auto">
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center text-white">
                                <BookOpen size={16} strokeWidth={2.5} />
                            </div>
                            <span className="page-heading text-xl font-bold text-primary">Pathfinder</span>
                        </Link>
                        <p className="text-sm text-slate-500 max-w-xs text-center md:text-left">
                            {t('footer.tagline')}
                        </p>
                    </div>

                    {/* Nav links */}
                    <div className="flex flex-col items-center md:items-start gap-2 text-sm text-slate-600">
                        <span className="font-semibold text-slate-800 mb-1">{t('footer.explore')}</span>
                        <Link to="/universities" className="hover:text-accent transition-colors">{t('nav.universities')}</Link>
                        <Link to="/courses" className="hover:text-accent transition-colors">{t('nav.courses')}</Link>
                        <Link to="/guidance" className="hover:text-accent transition-colors">{t('nav.findMyCourse')}</Link>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col items-center md:items-start gap-2 text-sm text-slate-600">
                        <span className="font-semibold text-slate-800 mb-1">{t('footer.contact')}</span>
                        <Link to="/contact" className="hover:text-accent transition-colors">
                            {t('footer.contactUs')}
                        </Link>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3 text-center text-xs text-slate-400">
                    <p className="max-w-2xl px-4 text-slate-400/80 leading-relaxed">
                        <strong>Disclaimer:</strong> {t('footer.disclaimer')}
                    </p>
                    <p className="font-medium">
                        © {new Date().getFullYear()} {t('footer.rights')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
