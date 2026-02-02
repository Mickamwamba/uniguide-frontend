import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Clock, School, Award, ArrowRight } from 'lucide-react';

const CourseCard = ({ programme }) => {
    return (
        <Link to={`/programmes/${programme.id}`} className="block group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-accent -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>

            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                        <School size={14} />
                        <span>{programme.university_name}</span>
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
