import React from 'react';
import { BadgeCheck, MapPin, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const UniversityCard = ({ university }) => {
    return (
        <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-accent/30 transition-all duration-300 flex flex-col h-full">
            {/* Header / Logo Area */}
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    {/* Placeholder for Logo if not present */}
                    {university.logo_url ? (
                        <img src={university.logo_url} alt={university.name} className="w-full h-full object-contain p-2" />
                    ) : (
                        <Building2 size={24} />
                    )}
                </div>
                <div className="flex gap-2">
                    {university.status === 'Accredited' || university.status === 'Chartered' || university.status.includes('Accredited') ? (
                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                            <BadgeCheck size={12} />
                            {university.status}
                        </span>
                    ) : (
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
                            {university.status}
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    <Link to={`/universities/${university.id}`}>
                        {university.name}
                    </Link>
                </h3>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <MapPin size={14} />
                    <span>{university.head_office || university.location || "Tanzania"}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                    <span>{university.university_type}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 mt-auto flex justify-between items-center">
                <Link
                    to={`/universities/${university.id}`}
                    className="text-sm font-semibold text-slate-900 group-hover:text-accent flex items-center gap-1 transition-colors"
                >
                    View Profile
                </Link>
                {university.website && (
                    <a
                        href={university.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-accent transition-colors"
                        title="Visit Website"
                    >
                        <ExternalLink size={16} />
                    </a>
                )}
            </div>
        </div>
    );
};

export default UniversityCard;
