import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseCard from '../../components/courses/CourseCard';
import FilterSidebar from '../../components/courses/FilterSidebar';
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { trackTelemetry } from '../../utils/telemetry';
import { useLanguage } from '../../context/LanguageContext';


const CourseBrowser = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [programmes, setProgrammes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    // State
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filters State
    const [filters, setFilters] = useState({
        university: searchParams.get('university') || '',
        award_level: searchParams.get('award_level') || '',
        study_mode: searchParams.get('study_mode') || ''
    });

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Fetch when dependencies change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProgrammes();
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [searchTerm, page, filters]);

    // Reset to page 1 when filters change (except page itself)
    useEffect(() => {
        setPage(1);
    }, [searchTerm, filters]);

    const fetchProgrammes = async () => {
        setLoading(true);
        try {
            // Build Query Params
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (page > 1) params.append('page', page);
            if (filters.university) params.append('university', filters.university);
            if (filters.award_level) params.append('award_level', filters.award_level);
            if (filters.study_mode) params.append('study_mode', filters.study_mode);

            setSearchParams(params);

            const response = await fetch(`/api/programmes/?${params.toString()}`);
            const data = await response.json();

            if (data.results) {
                setProgrammes(data.results);
                setTotalCount(data.count);
                setTotalPages(Math.ceil(data.count / 10));

                trackTelemetry('search', {
                    query: searchTerm,
                    filters: filters,
                    results_count: data.count
                });
            } else {
                setProgrammes([]);
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setFilters({
            university: '',
            award_level: '',
            study_mode: ''
        });
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Header / Search Section */}
            <div className="bg-white border-b border-slate-200 py-8 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <h1 className="text-3xl font-display font-bold text-slate-900">{t('courseBrowser.title')}</h1>
                        <span className="text-slate-500 text-sm font-medium">
                            {totalCount} {t('courseBrowser.programmesFound')}
                        </span>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder={t('courseBrowser.searchPlaceholder')}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className="md:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                        >
                            <Filter size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden md:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-32">
                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                                onClear={handleClearFilters}
                            />
                        </div>
                    </aside>

                    {/* Mobile Filter Modal */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setShowMobileFilters(false)}>
                            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold">{t('courseBrowser.filters')}</h3>
                                    <button onClick={() => setShowMobileFilters(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <FilterSidebar
                                    filters={filters}
                                    setFilters={setFilters}
                                    onClear={handleClearFilters}
                                />
                            </div>
                        </div>
                    )}

                    {/* Course Grid */}
                    <div className="flex-1">
                        {loading && programmes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin text-accent mb-4" size={40} />
                                <p className="text-slate-500">{t('courseBrowser.loading')}</p>
                            </div>
                        ) : (
                            <>
                                {programmes.length > 0 ? (
                                    <div className="grid gap-6">
                                        {programmes.map((prog) => (
                                            <CourseCard key={prog.id} programme={prog} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <Search className="text-slate-400" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t('courseBrowser.noCoursesTitle')}</h3>
                                        <p className="text-slate-500 mb-6">{t('courseBrowser.noCoursesSub')}</p>
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-accent font-medium hover:underline"
                                        >
                                            {t('courseBrowser.clearAllFilters')}
                                        </button>
                                    </div>
                                )}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-12">
                                        <button
                                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                                            disabled={page === 1}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <span className="text-sm font-medium text-slate-600 px-4">
                                            {t('courseBrowser.page')} {page} {t('courseBrowser.of')} {totalPages}
                                        </span>

                                        <button
                                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CourseBrowser;
