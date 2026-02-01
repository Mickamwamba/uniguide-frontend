import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, onClear, className = "" }) => {
    const [universities, setUniversities] = useState([]);

    // Award Levels (could be fetched, but standard enough to hardcode for now)
    const awardLevels = [
        "Bachelor",
        "Diploma",
        "Certificate",
        "Masters",
        "Postgraduate Diploma",
        "Doctorate"
    ];

    // Study Modes
    const studyModes = [
        "Full Time",
        "Part Time",
        "Online",
        "Distance Learning"
    ];

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            // Fetch all universities for the dropdown
            const response = await fetch('http://127.0.0.1:8000/api/universities/');
            const data = await response.json();
            // Since we disabled pagination for universities, data is the array itself
            setUniversities(data);
        } catch (err) {
            console.error("Failed to load universities", err);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                <button
                    onClick={onClear}
                    className="text-sm text-slate-500 hover:text-accent underline decoration-slate-300 underline-offset-4"
                >
                    Clear All
                </button>
            </div>

            {/* University Filter */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 uppercase tracking-wider">University</label>
                <select
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    value={filters.university || ""}
                    onChange={(e) => handleFilterChange('university', e.target.value)}
                >
                    <option value="">All Universities</option>
                    {universities.map(uni => (
                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                    ))}
                </select>
            </div>

            {/* Award Level Filter */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Award Level</label>
                <div className="space-y-2">
                    {awardLevels.map(level => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="award_level"
                                className="peer sr-only"
                                checked={filters.award_level === level}
                                onChange={() => handleFilterChange('award_level', level)}
                            />
                            <div className="w-5 h-5 rounded-md border border-slate-300 peer-checked:bg-accent peer-checked:border-accent flex items-center justify-center transition-all">
                                <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{level}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Study Mode Filter */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Study Mode</label>
                <div className="space-y-2">
                    {studyModes.map(mode => (
                        <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="study_mode"
                                className="peer sr-only"
                                checked={filters.study_mode === mode}
                                onChange={() => handleFilterChange('study_mode', mode)}
                            />
                            <div className="w-5 h-5 rounded-full border border-slate-300 peer-checked:bg-accent peer-checked:border-accent flex items-center justify-center transition-all">
                                <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{mode}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
