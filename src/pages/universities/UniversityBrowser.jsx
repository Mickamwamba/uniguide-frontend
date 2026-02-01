import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import UniversityCard from '../../components/universities/UniversityCard';
import { Search, MapPin, Building, Loader2, Filter, X } from 'lucide-react';

const UniversityBrowser = () => {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filters
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedType, setSelectedType] = useState('');

    // Derived Options for Filters
    const [regions, setRegions] = useState([]);
    const [types, setTypes] = useState([]);

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/universities/');
            const data = await response.json();
            // Assuming pagination is disabled for unis as per previous task
            setUniversities(data);

            // Extract unique regions and types for filter dropdowns
            const uniqueRegions = [...new Set(data.map(u => u.head_office).filter(Boolean))].sort();
            const uniqueTypes = [...new Set(data.map(u => u.university_type).filter(Boolean))].sort();

            setRegions(uniqueRegions);
            setTypes(uniqueTypes);
        } catch (error) {
            console.error("Failed to fetch universities:", error);
        } finally {
            setLoading(false);
        }
    };

    // Client-side filtering (since dataset is small ~60 items)
    // We could use backend filtering, but for <100 items client-side is faster and smoother
    const filteredUniversities = universities.filter(uni => {
        const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (uni.head_office && uni.head_office.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRegion = selectedRegion ? uni.head_office === selectedRegion : true;
        const matchesType = selectedType ? uni.university_type === selectedType : true;

        return matchesSearch && matchesRegion && matchesType;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedRegion('');
        setSelectedType('');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero / Header */}
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Universities in Tanzania</h1>
                    <p className="text-slate-600 max-w-2xl mb-8">
                        Explore accredited universities and colleges across Tanzania. Find the perfect campus for your studies based on location, type, and status.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search university name..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters (Desktop) */}
                        <div className="hidden md:flex gap-4">
                            <div className="relative">
                                <select
                                    className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer"
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                >
                                    <option value="">All Regions</option>
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>

                            <div className="relative">
                                <select
                                    className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            className="md:hidden px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 flex items-center justify-center gap-2"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="container mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-accent" size={40} />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {filteredUniversities.length} Institutions Found
                            </h2>
                            {(searchTerm || selectedRegion || selectedType) && (
                                <button onClick={clearFilters} className="text-accent hover:underline text-sm font-medium">
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {filteredUniversities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredUniversities.map(uni => (
                                    <UniversityCard key={uni.id} university={uni} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Building className="text-slate-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No universities found</h3>
                                <p className="text-slate-500">Try adjusting your search filters.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setShowMobileFilters(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Filters</h3>
                            <button onClick={() => setShowMobileFilters(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900">Region</label>
                                <select
                                    className="w-full p-3 rounded-lg border border-slate-200"
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                >
                                    <option value="">All Regions</option>
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900">Type</label>
                                <select
                                    className="w-full p-3 rounded-lg border border-slate-200"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <button
                                className="w-full py-3 bg-accent text-white rounded-xl font-bold mt-8"
                                onClick={() => setShowMobileFilters(false)}
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversityBrowser;
