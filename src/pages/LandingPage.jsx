import { ArrowRight, GraduationCap, Compass, Briefcase, Search, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-200/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-amber-200/20 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-accent"></span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('landing.badge')}</span>
                    </div>

                    <h1 className="page-heading text-5xl md:text-7xl font-bold text-slate-900 mb-4 leading-tight animate-slide-up">
                        {t('landing.heroTitle1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('landing.heroTitle2')}</span>
                    </h1>

                    <p className="text-base text-slate-500 font-medium mb-3 animate-fade-in">
                        {t('landing.heroSub1')}
                    </p>

                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                        {t('landing.heroSub2')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
                        <Link to="/guidance" className="btn-accent flex items-center gap-2 group">
                            {t('landing.ctaPrimary')}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/courses" className="px-6 py-3 rounded-xl bg-white text-slate-700 font-medium hover:bg-slate-50 border border-slate-200 transition-all shadow-sm hover:shadow-md">
                            {t('landing.ctaSecondary')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="page-heading text-2xl font-bold text-slate-900 text-center mb-10">{t('landing.howItWorksTitle')}</h2>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0">
                        <HowItWorksStep
                            number="1"
                            icon={<GraduationCap size={22} />}
                            title={t('landing.step1Title')}
                            description={t('landing.step1Desc')}
                        />
                        <div className="hidden md:flex items-center self-center pb-6 text-slate-300">
                            <ArrowRight size={24} />
                        </div>
                        <HowItWorksStep
                            number="2"
                            icon={<Search size={22} />}
                            title={t('landing.step2Title')}
                            description={t('landing.step2Desc')}
                        />
                        <div className="hidden md:flex items-center self-center pb-6 text-slate-300">
                            <ArrowRight size={24} />
                        </div>
                        <HowItWorksStep
                            number="3"
                            icon={<CheckCircle size={22} />}
                            title={t('landing.step3Title')}
                            description={t('landing.step3Desc')}
                        />
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/guidance" className="btn-accent inline-flex items-center gap-2 group">
                            {t('landing.getStarted')}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="page-heading text-3xl font-bold text-slate-900 text-center mb-12">{t('landing.featuresTitle')}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<GraduationCap size={32} className="text-indigo-600" />}
                            title={t('landing.feature1Title')}
                            description={t('landing.feature1Desc')}
                        />
                        <FeatureCard
                            icon={<Compass size={32} className="text-purple-600" />}
                            title={t('landing.feature2Title')}
                            description={t('landing.feature2Desc')}
                        />
                        <FeatureCard
                            icon={<Briefcase size={32} className="text-amber-500" />}
                            title={t('landing.feature3Title')}
                            description={t('landing.feature3Desc')}
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const HowItWorksStep = ({ number, icon, title, description }) => (
    <div className="flex-1 flex flex-col items-center text-center px-4">
        <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg mb-3 shadow-md shadow-indigo-500/20">
            {number}
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-accent mb-3">
            {icon}
        </div>
        <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
        <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="page-heading text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">
            {description}
        </p>
    </div>
);

export default LandingPage;
