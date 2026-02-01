import React from 'react';
import { ArrowRight, GraduationCap, Compass, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-200/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-200/20 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Discover Your Future</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 mb-6 leading-tight animate-slide-up">
                        Find the Perfect <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">University Course</span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-100">
                        Don't make blind decisions. Explore programmes, understand career outlooks, and get personalized AI guidance for universities in Tanzania.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-200">
                        <a href="/courses" className="btn-primary flex items-center gap-2 group">
                            Browse Courses
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <button className="px-6 py-3 rounded-xl bg-white text-slate-700 font-medium hover:bg-slate-50 border border-slate-200 transition-all shadow-sm hover:shadow-md">
                            Ask AI Guide
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<GraduationCap size={32} className="text-blue-600" />}
                            title="Explore Programmes"
                            description="Browse thousands of courses offered by top universities in Tanzania with detailed curriculum breakdown."
                        />
                        <FeatureCard
                            icon={<Compass size={32} className="text-indigo-600" />}
                            title="Personalized Guidance"
                            description="Our AI agent analyzes your interests and grades to suggest the perfect match for you."
                        />
                        <FeatureCard
                            icon={<Briefcase size={32} className="text-purple-600" />}
                            title="Career Outlook"
                            description="Understand what you can actually do with your degree before you start studying."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
        <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">
            {description}
        </p>
    </div>
);

export default LandingPage;
