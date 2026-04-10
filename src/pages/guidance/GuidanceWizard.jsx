import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseCard from '../../components/courses/CourseCard';
import { ChevronRight, GraduationCap, Sparkles, BookOpen, Loader2, CheckCircle } from 'lucide-react';

const STEPS = [
    { label: 'Academic',    icon: <GraduationCap size={20} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Interests',   icon: <Sparkles size={20} />,      color: 'bg-purple-50 text-purple-600' },
    { label: 'Personality', icon: <BookOpen size={20} />,      color: 'bg-blue-50 text-blue-600' },
    { label: 'Results',     icon: <CheckCircle size={20} />,   color: 'bg-amber-50 text-amber-600' },
];

const COMBINATIONS = [
    { value: 'PCM', label: 'PCM — Physics, Chemistry, Math' },
    { value: 'PCB', label: 'PCB — Physics, Chemistry, Biology' },
    { value: 'PGM', label: 'PGM — Physics, Geography, Math' },
    { value: 'EGM', label: 'EGM — Economics, Geography, Math' },
    { value: 'HGL', label: 'HGL — History, Geography, Language' },
    { value: 'HGE', label: 'HGE — History, Geography, Economics' },
    { value: 'ECA', label: 'ECA — Economics, Commerce, Accountancy' },
];

const GRADE_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'S', 'F'];

// Map combination codes to their subject names
const COMBINATION_SUBJECTS = {
    PCM: ['Physics', 'Chemistry', 'Math'],
    PCB: ['Physics', 'Chemistry', 'Biology'],
    PGM: ['Physics', 'Geography', 'Math'],
    EGM: ['Economics', 'Geography', 'Math'],
    HGL: ['History', 'Geography', 'Language'],
    HGE: ['History', 'Geography', 'Economics'],
    ECA: ['Economics', 'Commerce', 'Accountancy'],
};

const GuidanceWizard = () => {
    const [step, setStep] = useState(1);
    const [stepAck, setStepAck] = useState(''); // micro-acknowledgement message
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [synthesis, setSynthesis] = useState('');
    const [formData, setFormData] = useState({
        completedYear: '',
        combination: '',
        grades: {},
        interests: '',
        aspirations: [],
        personality: {
            environment: '',
            activity: '',
            impact: '',
            role: ''
        }
    });

    const advanceStep = (ack) => {
        setStepAck(ack);
        setTimeout(() => setStepAck(''), 1800);
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleGradeChange = (subject, grade) => {
        setFormData(prev => ({ ...prev, grades: { ...prev.grades, [subject]: grade } }));
    };

    const handleFindMatches = async () => {
        advanceStep('');
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/recommend/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interests: formData.interests,
                    combination: formData.combination,
                    grades: formData.grades,
                    personality: formData.personality
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch recommendations');

            if (data && Array.isArray(data.matches)) {
                setMatches(data.matches);
                setSynthesis(data.ai_synthesis || '');
            } else if (Array.isArray(data)) {
                setMatches(data);
            } else {
                setMatches([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const subjects = COMBINATION_SUBJECTS[formData.combination] || [];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />

            <div className="container mx-auto px-6 py-12 max-w-4xl">

                {/* Step Progress — numbered circles */}
                <div className="mb-12 max-w-lg mx-auto">
                    <div className="flex items-center justify-between">
                        {STEPS.map((s, i) => {
                            const stepNum = i + 1;
                            const isCompleted = step > stepNum;
                            const isActive = step === stepNum;
                            return (
                                <React.Fragment key={s.label}>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm
                                            ${isCompleted ? 'bg-warm text-white shadow-amber-400/30' :
                                              isActive    ? 'bg-accent text-white shadow-indigo-500/30' :
                                                            'bg-slate-200 text-slate-400'}`}
                                        >
                                            {isCompleted ? <CheckCircle size={18} /> : stepNum}
                                        </div>
                                        <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-accent' : isCompleted ? 'text-warm' : 'text-slate-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${step > stepNum ? 'bg-warm' : 'bg-slate-200'}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Step content card */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[400px]">

                    {/* ── Step 1: Academic ── */}
                    {step === 1 && (
                        <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
                            <StepHeader
                                icon={<GraduationCap size={32} />}
                                iconClass="bg-indigo-50 text-indigo-600"
                                title="Your Academic Profile"
                                subtitle="Let's start with your A-Level background."
                            />

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject Combination</label>
                                    <select
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none text-slate-700"
                                        value={formData.combination}
                                        onChange={(e) => setFormData({ ...formData, combination: e.target.value, grades: {} })}
                                    >
                                        <option value="">Select your combination</option>
                                        {COMBINATIONS.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Grades — shown only after combination is selected */}
                                {subjects.length > 0 && (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Your A-Level Grades</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {subjects.map(subject => (
                                                <div key={subject} className="flex flex-col gap-1.5">
                                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{subject}</span>
                                                    <select
                                                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none text-slate-700 text-sm"
                                                        value={formData.grades[subject] || ''}
                                                        onChange={(e) => handleGradeChange(subject, e.target.value)}
                                                    >
                                                        <option value="">Grade</option>
                                                        {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => advanceStep('Academic profile saved')}
                                    disabled={!formData.combination || subjects.some(s => !formData.grades[s])}
                                    className="w-full py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Continue <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Interests ── */}
                    {step === 2 && (
                        <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
                            {stepAck && <StepAck message={stepAck} />}
                            <StepHeader
                                icon={<Sparkles size={32} />}
                                iconClass="bg-purple-50 text-purple-600"
                                title="Interests & Passions"
                                subtitle="What do you love doing? What are your career goals?"
                            />

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tell us about yourself</label>
                                <textarea
                                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none min-h-[140px] text-slate-700 resize-none"
                                    placeholder="I enjoy solving math problems, building things, and working with computers. I dream of becoming an engineer one day..."
                                    value={formData.interests}
                                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                />
                                <p className="text-xs text-slate-400 mt-1.5">The more detail you give, the better the AI can match you.</p>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={() => advanceStep('Interests saved')}
                                    disabled={!formData.interests.trim()}
                                    className="flex-1 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Continue <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Personality ── */}
                    {step === 3 && (
                        <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
                            {stepAck && <StepAck message={stepAck} />}
                            <StepHeader
                                icon={<BookOpen size={32} />}
                                iconClass="bg-blue-50 text-blue-600"
                                title="Your Working Style"
                                subtitle="4 quick questions to help us find your best-fit degrees."
                            />

                            <div className="space-y-5">
                                <PersonalitySelect
                                    label="1. When you imagine your dream job, where are you mostly spending your day?"
                                    value={formData.personality.environment}
                                    onChange={(v) => setFormData({ ...formData, personality: { ...formData.personality, environment: v } })}
                                    placeholder="Choose your preferred environment"
                                    options={[
                                        { value: 'A', label: 'In a smart office with a computer and documents.' },
                                        { value: 'B', label: 'Outside in the field (construction, farm, nature).' },
                                        { value: 'C', label: 'In a hospital or clinic helping patients directly.' },
                                        { value: 'D', label: 'Moving around, meeting groups, or running a business.' },
                                    ]}
                                />
                                <PersonalitySelect
                                    label="2. At school, which of these activities do you actually enjoy most?"
                                    value={formData.personality.activity}
                                    onChange={(v) => setFormData({ ...formData, personality: { ...formData.personality, activity: v } })}
                                    placeholder="Choose an activity"
                                    options={[
                                        { value: 'A', label: 'Calculating numbers, logic, getting exact answers.' },
                                        { value: 'B', label: 'Debating ideas, writing essays, or presenting.' },
                                        { value: 'C', label: 'Doing practical experiments in the lab or fixing things.' },
                                        { value: 'D', label: 'Helping friends when stressed or organising groups.' },
                                    ]}
                                />
                                <PersonalitySelect
                                    label="3. If you became rich, what would you do for your hometown first?"
                                    value={formData.personality.impact}
                                    onChange={(v) => setFormData({ ...formData, personality: { ...formData.personality, impact: v } })}
                                    placeholder="Choose an impact"
                                    options={[
                                        { value: 'A', label: 'Build a free modern hospital and buy ambulances.' },
                                        { value: 'B', label: 'Build a factory that employs thousands of youth.' },
                                        { value: 'C', label: 'Create a clever mobile app that solves a deep problem.' },
                                        { value: 'D', label: 'Start a big farm to ensure cheap, quality food.' },
                                        { value: 'E', label: 'Start an NGO to fight for rights and fair laws.' },
                                    ]}
                                />
                                <PersonalitySelect
                                    label="4. In a difficult group project, what is your natural role?"
                                    value={formData.personality.role}
                                    onChange={(v) => setFormData({ ...formData, personality: { ...formData.personality, role: v } })}
                                    placeholder="Choose your natural role"
                                    options={[
                                        { value: 'A', label: 'The Planner: I divide work, make schedules, organise everyone.' },
                                        { value: 'B', label: 'The Researcher: I go straight to the library or Google for facts.' },
                                        { value: 'C', label: 'The Builder: I physically build the final presentation or model.' },
                                        { value: 'D', label: 'The Speaker: I confidently stand up and present to the teacher.' },
                                    ]}
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={handleFindMatches}
                                    className="flex-1 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    Find My Best Courses <Sparkles size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 4: Results ── */}
                    {step === 4 && (
                        <div className="space-y-8 animate-fade-in">
                            {loading ? (
                                <div className="text-center py-20">
                                    <Loader2 className="animate-spin text-accent mx-auto mb-4" size={48} />
                                    <h2 className="page-heading text-2xl font-bold mb-2">Analysing your profile...</h2>
                                    <p className="text-slate-500">Matching you against every programme in our database.</p>
                                    <p className="text-slate-400 text-sm mt-2">This usually takes 10–15 seconds.</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-lg mx-auto mb-6">
                                        <p className="font-bold">Something went wrong</p>
                                        <p className="text-sm mt-2">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => { setStep(3); setError(null); }}
                                        className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center max-w-2xl mx-auto">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-light text-amber-700 text-sm font-semibold mb-4">
                                            <CheckCircle size={15} /> Matches found
                                        </div>
                                        <h2 className="page-heading text-3xl font-bold text-slate-900 mb-2">Your Top Recommendations</h2>

                                        {synthesis && (
                                            <div className="mt-6 text-left p-6 bg-indigo-50 border border-indigo-100 rounded-2xl leading-relaxed relative shadow-inner">
                                                <div className="absolute -top-3 -left-3 p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                                                    <Sparkles size={16} />
                                                </div>
                                                <strong className="block text-indigo-900 mb-2 text-xs uppercase tracking-wider">AI Profile Synthesis</strong>
                                                <p className="text-slate-700 text-base italic">"{synthesis}"</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {matches.map(prog => (
                                            <CourseCard key={prog.id} programme={prog} />
                                        ))}
                                    </div>

                                    <div className="text-center pt-4 border-t border-slate-100">
                                        <p className="text-slate-500 text-sm mb-4">Want to explore more or have questions?</p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <button
                                                onClick={() => { setStep(1); setMatches([]); setSynthesis(''); }}
                                                className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                            >
                                                Start Over
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

// ── Sub-components ──

const StepHeader = ({ icon, iconClass, title, subtitle }) => (
    <div className="text-center mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${iconClass}`}>
            {icon}
        </div>
        <h1 className="page-heading text-2xl font-bold">{title}</h1>
        <p className="text-slate-500 mt-1">{subtitle}</p>
    </div>
);

const StepAck = ({ message }) => (
    <div className="flex items-center gap-2 text-warm font-semibold text-sm animate-fade-in mb-2">
        <CheckCircle size={16} />
        {message}
    </div>
);

const PersonalitySelect = ({ label, value, onChange, placeholder, options }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <select
            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none text-slate-700"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">{placeholder}</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

export default GuidanceWizard;
