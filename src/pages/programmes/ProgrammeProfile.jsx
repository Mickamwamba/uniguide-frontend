import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { BookOpen, Clock, Award, School, ChevronDown, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const ProgrammeProfile = () => {
    const { id } = useParams();
    const [programme, setProgramme] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgramme = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/programmes/${id}/`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setProgramme(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProgramme();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={40} />
            </div>
        );
    }

    if (!programme) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col">
                <h2 className="text-xl font-bold mb-4">Programme not found</h2>
                <Link to="/courses" className="text-accent underline">Back to Courses</Link>
            </div>
        );
    }

    // Group courses by Year -> Semester
    const structure = {};
    if (programme.courses) {
        programme.courses.forEach(course => {
            // Use the database 'year' field directly
            const year = course.year || Math.ceil(course.semester / 2); // Fallback for safety
            if (!structure[year]) structure[year] = {};

            if (!structure[year][course.semester]) structure[year][course.semester] = [];
            structure[year][course.semester].push(course);
        });
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />

            {/* Header Banner */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-12 max-w-4xl">
                    <Link to="/courses" className="inline-flex items-center text-slate-500 hover:text-accent mb-6 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Courses
                    </Link>

                    <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2 text-accent font-semibold uppercase tracking-wider text-sm">
                            <School size={16} />
                            <span>{programme.university_name}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                            {programme.name}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-8 mt-6 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Award size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Award</p>
                                <p className="font-medium">{programme.award_level}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Duration</p>
                                <p className="font-medium">{programme.duration_months} Months</p>
                            </div>
                        </div>

                        {programme.study_mode && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Mode</p>
                                    <p className="font-medium">{programme.study_mode}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <div className="space-y-12">
                    {/* Description */}
                    {programme.description && (
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                Programme Overview
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                <p>{programme.description}</p>
                            </div>
                        </section>
                    )}

                    {/* Course Structure */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            Course Structure
                        </h2>

                        <div className="space-y-8">
                            {Object.keys(structure).length > 0 ? (
                                Object.keys(structure).sort((a, b) => a - b).map(year => (
                                    <div key={year} className="space-y-4">
                                        {/* Year Header */}
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-xl font-bold text-slate-800 bg-white border border-slate-200 px-6 py-2 rounded-full inline-block shadow-sm">
                                                Year {year}
                                            </h3>
                                            <div className="h-px bg-slate-200 flex-1"></div>
                                        </div>

                                        {/* Semesters */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {Object.keys(structure[year]).sort((a, b) => a - b).map(sem => (
                                                <div key={sem} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 font-bold text-slate-800 flex justify-between items-center">
                                                        <span>Semester {sem}</span>
                                                        <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs font-medium">{structure[year][sem].length} Courses</span>
                                                    </div>
                                                    <ul className="divide-y divide-slate-50">
                                                        {structure[year][sem].map(course => (
                                                            <li key={course.id} className="px-5 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 group">
                                                                <div className="mt-1 shrink-0">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-accent transition-colors"></div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-slate-700 group-hover:text-slate-900">{course.name}</div>
                                                                    <div className="text-xs text-slate-400 flex gap-2 mt-1">
                                                                        <span className="font-mono">{course.code}</span>
                                                                        {course.credits > 0 && <span>• {course.credits} Credits</span>}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                    <p className="text-slate-500">Course structure not available yet.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* CTAs / Interested Section (Moved to Bottom) */}
                    <section className="pt-8 border-t border-slate-200">
                        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h3 className="font-bold text-2xl md:text-3xl mb-4">Interested in this programme?</h3>
                                <p className="text-slate-300 text-lg mb-8">
                                    Visit the university website for detailed admission requirements, fee structures, and application deadlines.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href={`http://${programme.university_name.toLowerCase().replace(/\s+/g, '')}.ac.tz`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all hover:scale-105"
                                    >
                                        Visit Official Website
                                        <ArrowRight size={18} className="ml-2" />
                                    </a>
                                    <Link
                                        to={`/universities?search=${programme.university_name}`}
                                        className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/10"
                                    >
                                        View University Profile
                                    </Link>
                                </div>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                                <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProgrammeProfile;
