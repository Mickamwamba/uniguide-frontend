import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { lang, setLang, t } = useLanguage();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-surface/80 border-b border-slate-200/60 shadow-sm">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
                        <BookOpen size={20} strokeWidth={2.5} />
                    </div>
                    <span className="page-heading text-2xl font-bold text-primary">Pathfinder</span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium text-sm">
                    <Link to="/universities" className="hover:text-accent transition-colors">{t('nav.universities')}</Link>
                    <Link to="/courses" className="hover:text-accent transition-colors">{t('nav.courses')}</Link>
                    <Link to="/guidance" className="hover:text-accent transition-colors">{t('nav.findMyCourse')}</Link>
                </div>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-3">
                    {searchOpen ? (
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('nav.searchPlaceholder')}
                                className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-accent/20 w-48"
                            />
                            <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-sm font-medium"
                        >
                            <Search size={16} />
                            <span>{t('nav.search')}</span>
                        </button>
                    )}

                    {/* Language Toggle */}
                    <div className="flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
                        <button
                            onClick={() => setLang('en')}
                            className={`px-3 py-1.5 rounded-full transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLang('sw')}
                            className={`px-3 py-1.5 rounded-full transition-all ${lang === 'sw' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            SW
                        </button>
                    </div>
                </div>

                {/* Mobile: language toggle + hamburger */}
                <div className="flex md:hidden items-center gap-2">
                    {/* Mobile Language Toggle */}
                    <div className="flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
                        <button
                            onClick={() => setLang('en')}
                            className={`px-2.5 py-1 rounded-full transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLang('sw')}
                            className={`px-2.5 py-1 rounded-full transition-all ${lang === 'sw' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                        >
                            SW
                        </button>
                    </div>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-lg animate-fade-in">
                    <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-3">
                            <div className="relative flex-1">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('nav.searchPlaceholder')}
                                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                                />
                            </div>
                            <button type="submit" className="px-3 py-2 bg-accent text-white rounded-xl text-sm font-medium">{t('nav.searchGo')}</button>
                        </form>
                        <MobileNavLink to="/universities" onClick={() => setMobileOpen(false)}>{t('nav.universities')}</MobileNavLink>
                        <MobileNavLink to="/courses" onClick={() => setMobileOpen(false)}>{t('nav.courses')}</MobileNavLink>
                        <MobileNavLink to="/guidance" onClick={() => setMobileOpen(false)}>{t('nav.findMyCourse')}</MobileNavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

const MobileNavLink = ({ to, onClick, children }) => (
    <Link
        to={to}
        onClick={onClick}
        className="px-3 py-2.5 rounded-xl text-slate-700 font-medium text-sm hover:bg-indigo-50 hover:text-accent transition-colors"
    >
        {children}
    </Link>
);

export default Navbar;
