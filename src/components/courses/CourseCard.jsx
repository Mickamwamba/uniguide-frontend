import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Clock, School, Award, ArrowRight, Building2, ChevronDown, ChevronUp } from 'lucide-react';

const CourseCard = ({ programme }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // If it's a grouped cluster from Agentic Search
    if (programme.offered_at) {
        const hasManyOffers = programme.offered_at.length > 5;
        const visibleOffers = isExpanded ? programme.offered_at : programme.offered_at.slice(0, 5);
        return (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-0">
                    <div>
                        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
                            <Award size={14} />
                            <span>{programme.award_level || 'Degree Program'}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-0">
                            {programme.generic_name}
                        </h3>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Offered At {programme.offered_at.length} Institutions:</p>
                    <div className="flex flex-col gap-2">
                        {visibleOffers.map((offer) => (
                            <Link 
                                key={offer.id} 
                                to={`/programmes/${offer.id}`}
                                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm text-indigo-600">
                                        <Building2 size={14} />
                                    </div>
                                    <span className="font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                                        {offer.university?.name || offer.university_name || 'Unknown University'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {offer.duration && (
                                        <span className="text-xs text-slate-500 hidden sm:block">
                                            {offer.duration} Months
                                        </span>
                                    )}
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                        
                        {hasManyOffers && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-xl transition-all"
                            >
                                {isExpanded ? (
                                    <>Show Less <ChevronUp size={16} /></>
                                ) : (
                                    <>Show {programme.offered_at.length - 5} More Institutions <ChevronDown size={16} /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Fallback for regular un-grouped search results
    return (
        <Link to={`/programmes/${programme.id}`} className="block group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-accent -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>

            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                        <School size={14} />
                        <span>{programme.university?.name || programme.university_name}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-accent transition-colors">
                        {programme.name}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Award size={16} className="text-indigo-500" />
                    <span>{programme.award_level}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={16} className="text-indigo-500" />
                    <span>{programme.duration_months} Months</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                    {programme.study_mode}
                </span>
                {programme.qualification_framework && (
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                        {programme.qualification_framework}
                    </span>
                )}
            </div>
        </Link>
    );
};

export default CourseCard;
