import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseCard from '../../components/courses/CourseCard';
import { MapPin, Mail, Globe, Award, BookOpen, Loader2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const UniversityProfile = () => {
    const { id } = useParams();
    const [university, setUniversity] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const uniRes = await fetch(`/api/universities/${id}/`);
                const uniData = await uniRes.json();
                setUniversity(uniData);

                const coursesRes = await fetch(`/api/programmes/?university=${id}&page_size=3`);
                const coursesData = await coursesRes.json();

                setCourses(coursesData.results || coursesData);
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={40} />
            </div>
        );
    }

    if (!university) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('uniProfile.notFound')}</h2>
                <Link to="/universities" className="text-accent hover:underline">{t('uniProfile.returnToList')}</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Header Banner */}
            <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <Link to="/universities" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> {t('uniProfile.backToUnis')}
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-4">
                            {university.logo_url ? (
                                <img src={university.logo_url} alt={university.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-3xl font-bold text-slate-900">{university.name[0]}</span>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/20">
                                    {university.university_type}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-medium border border-green-500/30">
                                    {university.status}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">
                                {university.short_name ? `${university.name} (${university.short_name})` : university.name}
                            </h1>
                            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-slate-300 text-sm">
                                {university.head_office && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-accent" />
                                        {university.head_office}
                                    </div>
                                )}
                                {university.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-accent" />
                                        <a href={`mailto:${university.email}`} className="hover:text-white transition-colors">{university.email}</a>
                                    </div>
                                )}
                                {university.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe size={16} className="text-accent" />
                                        <a href={university.website} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{t('uniCard.visitWebsite')}</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                {/* Top Section: Details & About */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {/* About Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <BookOpen size={120} className="text-accent" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-3 relative z-10">
                            <Sparkles size={24} className="text-accent" />
                            {t('uniProfile.about')} {university.name}
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-lg relative z-10">
                            {university.overview || t('uniProfile.noOverview')}
                        </p>
                    </div>

                    {/* Stats & Info Column */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Award size={20} className="text-accent" />
                                {t('uniProfile.accreditationTitle')}
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-slate-500">{t('uniProfile.statusLabel')}</span>
                                    <span className="font-medium text-slate-700 bg-green-50 text-green-700 px-2 py-1 rounded-lg">
                                        {university.accreditation_status || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-500">{t('uniProfile.registrationLabel')}</span>
                                    <span className="font-medium text-slate-700">{university.registration_no || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-fit">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-accent" />
                                {t('uniProfile.locationTitle')}
                            </h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {university.address || university.location || t('uniProfile.noAddress')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Courses */}
                <div className="border-t border-slate-200 pt-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                                <BookOpen className="text-accent" />
                                {t('uniProfile.offeredCourses')}
                            </h2>
                            <p className="text-slate-500">{t('uniProfile.offeredCoursesSub')}</p>
                        </div>

                        <Link
                            to={`/courses?university=${university.id}`}
                            className="hidden md:flex items-center gap-2 px-6 py-3 bg-accent/10 text-accent font-semibold rounded-xl hover:bg-accent/20 transition-all"
                        >
                            {t('uniProfile.viewAllCourses')}
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    {courses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <CourseCard key={course.id} programme={course} />
                            ))}

                            {/* Mobile "View All" Button */}
                            <div className="md:hidden col-span-full mt-6">
                                <Link
                                    to={`/courses?university=${university.id}`}
                                    className="block w-full text-center px-6 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    {t('uniProfile.viewAllCourses')}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                            <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('uniProfile.noCoursesTitle')}</h3>
                            <p className="text-slate-500">{t('uniProfile.noCoursesSub')}</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UniversityProfile;
