import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import CourseCard from '../../components/courses/CourseCard';
import { ChevronRight, ChevronLeft, GraduationCap, Sparkles, BookOpen, Loader2 } from 'lucide-react';

const GuidanceWizard = () => {
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [formData, setFormData] = useState({
        completedYear: '',
        combination: '',
        grades: {},
        interests: '',
        aspirations: []
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleFindMatches = async () => {
        setStep(3);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/recommend/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    interests: formData.interests,
                    combination: formData.combination,
                    grades: formData.grades
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch recommendations');
            }

            if (Array.isArray(data)) {
                setMatches(data);
            } else {
                setMatches([]);
                console.error("API returned non-array:", data);
            }

        } catch (error) {
            console.error("Match error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />

            <div className="container mx-auto px-6 py-12 max-w-4xl">
                {/* Progress Bar */}
                <div className="mb-12 max-w-3xl mx-auto">
                    <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                        <span className={step >= 1 ? 'text-accent' : ''}>Academic Profile</span>
                        <span className={step >= 2 ? 'text-accent' : ''}>Interests</span>
                        <span className={step >= 3 ? 'text-accent' : ''}>Results</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}% ` }}
                        ></div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[400px]">
                    {step === 1 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                    <GraduationCap size={32} />
                                </div>
                                <h1 className="text-2xl font-bold">Your Academic Profile</h1>
                                <p className="text-slate-500">Let's start with your A-Level background.</p>
                            </div>

                            {/* Form Fields Placeholder */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject Combination</label>
                                    <select
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none"
                                        value={formData.combination}
                                        onChange={(e) => setFormData({ ...formData, combination: e.target.value })}
                                    >
                                        <option value="">Select Combination (e.g. PCM)</option>
                                        <option value="PCM">PCM - Physics, Chemistry, Math</option>
                                        <option value="PCB">PCB - Physics, Chemistry, Biology</option>
                                        <option value="PGM">PGM - Physics, Geography, Math</option>
                                        <option value="EGM">EGM - Economics, Geography, Math</option>
                                        <option value="HGL">HGL - History, Geography, Language</option>
                                        <option value="HGE">HGE - History, Geography, Economics</option>
                                        <option value="ECA">ECA - Economics, Commerce, Accountancy</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    Continue <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                                    <Sparkles size={32} />
                                </div>
                                <h1 className="text-2xl font-bold">Interests & Passions</h1>
                                <p className="text-slate-500">What do you love doing? What are your career goals?</p>
                            </div>

                            {/* Form Fields Placeholder */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">My Interests</label>
                                    <textarea
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none min-h-[120px]"
                                        placeholder="I enjoy solving math problems, building things, and working with computers..."
                                        value={formData.interests}
                                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleFindMatches}
                                    className="flex-1 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    Find Matches <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8">
                            {loading ? (
                                <div className="text-center py-20">
                                    <Loader2 className="animate-spin text-accent mx-auto mb-4" size={48} />
                                    <h2 className="text-2xl font-bold mb-2">Analyzing your profile...</h2>
                                    <p className="text-slate-500">We are finding courses that match your unique interests.</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-lg mx-auto mb-6">
                                        <p className="font-bold">Something went wrong</p>
                                        <p className="text-sm mt-2">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Top Recommendations for You</h2>
                                        <p className="text-slate-500">Based on your interest in "{formData.interests}"</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {matches.map(prog => (
                                            <CourseCard key={prog.id} programme={prog} />
                                        ))}
                                    </div>

                                    <div className="text-center pt-8">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                        >
                                            Start Over
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuidanceWizard;
