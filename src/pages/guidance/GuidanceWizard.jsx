import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseCard from '../../components/courses/CourseCard';
import { ChevronRight, GraduationCap, Sparkles, BookOpen, Loader2, CheckCircle } from 'lucide-react';

const STEPS = [
    { label: 'Academic',    icon: <GraduationCap size={20} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Interests',   icon: <Sparkles size={20} />,      color: 'bg-purple-50 text-purple-600' },
    { label: 'Archetype',   icon: <BookOpen size={20} />,      color: 'bg-blue-50 text-blue-600' },
    { label: 'Results',     icon: <CheckCircle size={20} />,   color: 'bg-amber-50 text-amber-600' },
];

const COMBINATIONS = [
    { value: 'PCM', label: 'PCM — Physics, Chemistry, Mathematics' },
    { value: 'PCB', label: 'PCB — Physics, Chemistry, Biology' },
    { value: 'PGM', label: 'PGM — Physics, Geography, Mathematics' },
    { value: 'PMC', label: 'PMC — Physics, Mathematics, Computer Science' },
    { value: 'EGM', label: 'EGM — Economics, Geography, Mathematics' },
    { value: 'CBG', label: 'CBG — Chemistry, Biology, Geography' },
    { value: 'CBA', label: 'CBA — Chemistry, Biology, Agriculture' },
    { value: 'CBN', label: 'CBN — Chemistry, Biology, Food and Human Nutrition' },
    { value: 'HGL', label: 'HGL — History, Geography, English Language' },
    { value: 'HGK', label: 'HGK — History, Geography, Kiswahili' },
    { value: 'HKL', label: 'HKL — History, Kiswahili, English Language' },
    { value: 'KLF', label: 'KLF — Kiswahili, English Language, French' },
    { value: 'ECA', label: 'ECA — Economics, Commerce, Accountancy' },
    { value: 'HGE', label: 'HGE — History, Geography, Economics' },
    { value: 'KEC', label: 'KEC — Kiswahili, English, Chinese' },
];

// Map combination codes to their subject names
const COMBINATION_SUBJECTS = {
    PCM: ['Physics', 'Chemistry', 'Mathematics'],
    PCB: ['Physics', 'Chemistry', 'Biology'],
    PGM: ['Physics', 'Geography', 'Mathematics'],
    PMC: ['Physics', 'Mathematics', 'Computer Science'],
    EGM: ['Economics', 'Geography', 'Mathematics'],
    CBG: ['Chemistry', 'Biology', 'Geography'],
    CBA: ['Chemistry', 'Biology', 'Agriculture'],
    CBN: ['Chemistry', 'Biology', 'Food and Human Nutrition'],
    HGL: ['History', 'Geography', 'English Language'],
    HGK: ['History', 'Geography', 'Kiswahili'],
    HKL: ['History', 'Kiswahili', 'English Language'],
    KLF: ['Kiswahili', 'English Language', 'French'],
    ECA: ['Economics', 'Commerce', 'Accountancy'],
    HGE: ['History', 'Geography', 'Economics'],
    KEC: ['Kiswahili', 'English', 'Chinese'],
};

const GuidanceWizard = () => {
    const [step, setStep] = useState(1);
    const [stepAck, setStepAck] = useState(''); // micro-acknowledgement message
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [synthesis, setSynthesis] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [formData, setFormData] = useState({
        combination: '',
        interests: '',
        personality: {
            school_moment: '',
            hobby: '',
            dealbreaker: '',
            endgame: ''
        }
    });

    const advanceStep = (ack) => {
        setStepAck(ack);
        setTimeout(() => setStepAck(''), 1800);
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleFindMatches = async () => {
        advanceStep('');
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/recommend/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    combination: formData.combination,
                    interests: formData.interests,
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
                                        onChange={(e) => setFormData({ ...formData, combination: e.target.value })}
                                    >
                                        <option value="">Select your combination</option>
                                        {COMBINATIONS.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => advanceStep('Academic profile saved')}
                                    disabled={!formData.combination}
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

                    {/* ── Step 3: The Archetype Quiz ── */}
                    {step === 3 && (
                        <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
                            {stepAck && <StepAck message={stepAck} />}
                            <StepHeader
                                icon={<Sparkles size={32} />}
                                iconClass="bg-purple-50 text-purple-600"
                                title="Your Career DNA"
                                subtitle="Answer 4 quick questions to discover your natural archetype."
                            />

                            <div className="space-y-5">
                                <PersonalitySelect
                                    label="1. Looking back at school, what was your favorite moment?"
                                    value={formData.personality.school_moment}
                                    onChange={(v) => setFormData({ ...formData, personality: { ...formData.personality, school_moment: v } })}
                                    placeholder="Choose your favorite moment"
                                    options={[
                                        { value: 'Cracking hard Math/Physics problems', label: 'Cracking a really hard Math/Physics problem' },
                                        { value: 'Doing lab practicals and experiments', label: 'Doing practicals in the laboratory' },
                                        { value: 'Leading discussions or debating', label: 'Leading group discussions or debates' },
                                        { value: 'Helping students understand difficult topics', label: 'Helping friends understand difficult topics' },
                                        { value: 'Organizing school events or mini-businesses', label: 'Organizing school events or business ideas' },
                                    ]}
                                />
                                <PersonalitySelect
                                    label="2. On a completely free Saturday, what are you most likely doing?"
                                    value={formData.personality.hobby}
                                    onChange={(v) => setFormData({ ...formData, personality: { ...formData.personality, hobby: v } })}
                                    placeholder="Choose an activity"
                                    options={[
                                        { value: 'Tinkering with phones/computers', label: 'Tinkering with phones, computers, or learning tech' },
                                        { value: 'Reading or watching documentaries', label: 'Reading books or watching documentaries/news' },
                                        { value: 'Socializing and meeting new people', label: 'Going out to socialize and meet new people' },
                                        { value: 'Drawing, writing, or editing media', label: 'Creating things—drawing, writing, editing videos' },
                                    ]}
                                />
                                <PersonalitySelect
                                    label="3. What is the ONE thing you NEVER want to do?"
                                    value={formData.personality.dealbreaker}
                                    onChange={(v) => setFormData({ ...formData, personality: { ...formData.personality, dealbreaker: v } })}
                                    placeholder="Choose your dealbreaker"
                                    options={[
                                        { value: 'Memorizing essays or theories', label: 'Memorizing long historical essays or theories' },
                                        { value: 'Doing complex Math or Physics equations', label: 'Looking at complex Math or Physics equations' },
                                        { value: 'Public speaking in front of crowds', label: 'Speaking or presenting in front of crowds' },
                                        { value: 'Working alone in a lab or coding all day', label: 'Stuck in a laboratory or staring at code all day' },
                                    ]}
                                />
                                <PersonalitySelect
                                    label="4. Looking 10 years ahead, what is your endgame?"
                                    value={formData.personality.endgame}
                                    onChange={(v) => setFormData({ ...formData, personality: { ...formData.personality, endgame: v } })}
                                    placeholder="Choose your career goal"
                                    options={[
                                        { value: 'Innovator (Building/Inventing tech)', label: 'The Innovator: I want to build or invent new tech/systems' },
                                        { value: 'Pillar of Stability (Government/Teaching)', label: 'The Pillar: I want a secure, respected job to provide for my family' },
                                        { value: 'Caregiver (Saving lives or helping people)', label: 'The Caregiver: I want to actively save lives or defend people' },
                                        { value: 'The Boss (Entrepreneur/Manager)', label: 'The Boss: I want to start my own companies and lead teams' },
                                        { value: 'The Explorer (Working out in the field)', label: 'The Explorer: I want an adventurous career out in the field' },
                                    ]}
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={handleFindMatches}
                                    disabled={!formData.personality.school_moment || !formData.personality.hobby || !formData.personality.dealbreaker || !formData.personality.endgame}
                                    className="flex-1 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
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
                                        {matches.map((prog, idx) => (
                                            <CourseCard key={prog.id || prog.generic_name || idx} programme={prog} />
                                        ))}
                                    </div>

                                    <div className="text-center pt-8 border-t border-slate-100 max-w-lg mx-auto">
                                        <div className="bg-warm-light/30 rounded-2xl p-6 border border-amber-100 mb-6 relative">
                                            <div className="absolute -top-3 -right-3 p-1.5 bg-green-500 rounded-full text-white shadow-md">
                                                <CheckCircle size={16} />
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-1">Send these exact AI recommendations!</h3>
                                            <p className="text-sm text-slate-600 mb-4">Enter your email address and we'll officially send you a copy of these perfect matches so you don't lose them.</p>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="email" 
                                                    placeholder="Enter your email address" 
                                                    onChange={(e) => setFormData({...formData, captureEmail: e.target.value})}
                                                    value={formData.captureEmail || ''}
                                                    className="flex-1 p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-accent/20"
                                                />
                                                <button 
                                                    disabled={!formData.captureEmail || isSendingEmail}
                                                    onClick={async () => {
                                                        setIsSendingEmail(true);
                                                        setStepAck('');
                                                        try {
                                                            const response = await fetch('/api/capture-lead/', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    email: formData.captureEmail,
                                                                    combination: formData.combination,
                                                                    interests: formData.interests,
                                                                    personality: formData.personality,
                                                                    synthesis: synthesis,
                                                                    matches: matches.map(m => m.generic_name).join(', ')
                                                                })
                                                            });
                                                            
                                                            const data = await response.json();
                                                            if (!response.ok) {
                                                                throw new Error(data.error || 'Failed to send email');
                                                            }
                                                            
                                                            const sentEmail = formData.captureEmail;
                                                            setFormData({...formData, captureEmail: ''});
                                                            setStepAck(`Success! Your results have been securely sent to ${sentEmail}.`);
                                                            setTimeout(() => setStepAck(''), 6000);
                                                        } catch (e) {
                                                            console.error('Failed to capture lead:', e);
                                                            setStepAck(`Error: ${e.message}`);
                                                            setTimeout(() => setStepAck(''), 5000);
                                                        } finally {
                                                            setIsSendingEmail(false);
                                                        }
                                                    }}
                                                    className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap flex items-center justify-center gap-2 min-w-[120px]"
                                                >
                                                    {isSendingEmail ? (
                                                        <><Loader2 className="animate-spin" size={16} /> Sending...</>
                                                    ) : (
                                                        'Send Now'
                                                    )}
                                                </button>
                                            </div>
                                            {stepAck && (
                                                <div className={`mt-4 p-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${stepAck.startsWith('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                                    {stepAck.startsWith('Error') ? null : <CheckCircle size={16} />}
                                                    {stepAck}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-slate-500 text-sm mb-4">Want to explore more paths?</p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <button
                                                onClick={() => { setStep(1); setMatches([]); setSynthesis(''); setFormData({...formData, captureEmail: ''}); }}
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
