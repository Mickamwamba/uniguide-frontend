import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseCard from '../../components/courses/CourseCard';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle, Sparkles } from 'lucide-react';

// ─── Data (from claude branch) ────────────────────────────────────────────────

const STEPS = ['Academic', 'Interests', 'Working style', 'Results'];

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

const GRADES = ['A', 'B', 'C', 'D', 'E', 'S', 'F'];

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

const PERSONALITY_QUESTIONS = [
    {
        key: 'environment',
        question: 'When you imagine your dream job, where are you mostly spending your day?',
        options: [
            { value: 'A', label: 'Smart office', sub: 'Computer, documents, analysis.' },
            { value: 'B', label: 'Out in the field', sub: 'Construction, farm, nature.' },
            { value: 'C', label: 'Hospital or clinic', sub: 'Helping patients directly.' },
            { value: 'D', label: 'On the move', sub: 'Meeting groups, running a business.' },
        ],
    },
    {
        key: 'activity',
        question: 'At school, which activity do you actually enjoy most?',
        options: [
            { value: 'A', label: 'Numbers & logic', sub: 'Calculating, exact answers.' },
            { value: 'B', label: 'Writing & debate', sub: 'Essays, presenting ideas.' },
            { value: 'C', label: 'Lab & hands-on', sub: 'Experiments, fixing things.' },
            { value: 'D', label: 'Helping others', sub: 'Organising groups, counselling.' },
        ],
    },
    {
        key: 'impact',
        question: 'If you became rich, what would you do for your hometown first?',
        options: [
            { value: 'A', label: 'Free hospital', sub: 'Modern hospital & ambulances.' },
            { value: 'B', label: 'Factory & jobs', sub: 'Employs thousands of youth.' },
            { value: 'C', label: 'Tech app', sub: 'Clever app solving a deep problem.' },
            { value: 'D', label: 'Big farm', sub: 'Cheap, quality food for all.' },
            { value: 'E', label: 'NGO & rights', sub: 'Fight for fair laws.' },
        ],
    },
    {
        key: 'role',
        question: 'In a difficult group project, what is your natural role?',
        options: [
            { value: 'A', label: 'The Planner', sub: 'Divides work, makes schedules.' },
            { value: 'B', label: 'The Researcher', sub: 'Finds the facts & evidence.' },
            { value: 'C', label: 'The Builder', sub: 'Builds the final product.' },
            { value: 'D', label: 'The Speaker', sub: 'Confidently presents to everyone.' },
        ],
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

const GuidanceWizard = () => {
    const [step, setStep] = useState(1);
    const [personalityQ, setPersonalityQ] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [matches, setMatches] = useState([]);
    const [synthesis, setSynthesis] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailAck, setEmailAck] = useState('');

    const [formData, setFormData] = useState({
        pathway: '',
        acsee: { combination: '', grades: {} },
        diploma: { field: '', gpa: '' },
        interests: '',
        personality: { environment: '', activity: '', impact: '', role: '' },
        captureEmail: '',
    });

    const advance = () => setStep(s => s + 1);

    const back = () => {
        if (step === 3 && personalityQ > 0) { setPersonalityQ(q => q - 1); return; }
        setStep(s => s - 1);
        if (step === 3) setPersonalityQ(0);
    };

    // Auto-advance through personality questions on selection
    const handlePersonalitySelect = (key, value) => {
        const updated = { ...formData.personality, [key]: value };
        setFormData(f => ({ ...f, personality: updated }));

        if (personalityQ < PERSONALITY_QUESTIONS.length - 1) {
            setTimeout(() => setPersonalityQ(q => q + 1), 220);
        } else {
            // Last question — auto-submit
            setTimeout(() => findMatches({ ...formData, personality: updated }), 300);
        }
    };

    const findMatches = async (data = formData) => {
        setStep(4);
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/recommend/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    combination: data.pathway === 'ACSEE' ? data.acsee.combination : data.diploma.field,
                    interests: data.interests,
                    personality: data.personality,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed');
            if (Array.isArray(json.matches)) { setMatches(json.matches); setSynthesis(json.ai_synthesis || ''); }
            else if (Array.isArray(json)) { setMatches(json); }
            else setMatches([]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const subjects = formData.pathway === 'ACSEE' ? (COMBINATION_SUBJECTS[formData.acsee.combination] || []) : [];
    const currentQ = PERSONALITY_QUESTIONS[personalityQ];
    const activeGroup = step === 1 ? 0 : step === 2 ? 1 : step === 3 ? 2 : 3;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Progress bar */}
            {step < 4 && (
                <div className="border-b border-slate-200 bg-white">
                    <div className="container mx-auto px-6 py-5 max-w-lg">
                        <div className="flex items-center">
                            {STEPS.slice(0, -1).concat('Results').map((g, i) => {
                                const done = activeGroup > i;
                                const active = activeGroup === i;
                                return (
                                    <React.Fragment key={g}>
                                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                                ${done ? 'bg-warm text-white shadow-sm shadow-amber-400/30' :
                                                    active ? 'bg-accent text-white shadow-sm shadow-indigo-500/30' :
                                                        'bg-slate-200 text-slate-400'}`}
                                            >
                                                {done ? <CheckCircle size={16} /> : i + 1}
                                            </div>
                                            <span className={`text-xs font-medium hidden sm:block transition-colors
                                                ${active ? 'text-accent' : done ? 'text-warm' : 'text-slate-400'}`}>
                                                {g}
                                            </span>
                                        </div>
                                        {i < STEPS.length - 1 && (
                                            <div className={`flex-1 h-1 mx-3 mb-4 rounded-full transition-all duration-500 ${activeGroup > i ? 'bg-warm' : 'bg-slate-200'}`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[400px]">

                {/* ── Step 1: Academic ── */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <QuizHeader
                            title="What is your academic background?"
                            sub="We'll evaluate your qualifications securely on-the-fly."
                        />

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => setFormData(f => ({ ...f, pathway: 'ACSEE' }))}
                                className={`p-4 rounded-xl border transition-all text-left ${formData.pathway === 'ACSEE' ? 'border-accent bg-accent/5' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <h4 className={`font-bold mb-1 ${formData.pathway === 'ACSEE' ? 'text-accent' : 'text-slate-900'}`}>Form 6 Graduate</h4>
                                <p className="text-xs text-slate-500">I have A-Level principle passes</p>
                            </button>
                            <button
                                onClick={() => setFormData(f => ({ ...f, pathway: 'DIPLOMA' }))}
                                className={`p-4 rounded-xl border transition-all text-left ${formData.pathway === 'DIPLOMA' ? 'border-accent bg-accent/5' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <h4 className={`font-bold mb-1 ${formData.pathway === 'DIPLOMA' ? 'text-accent' : 'text-slate-900'}`}>Diploma Graduate</h4>
                                <p className="text-xs text-slate-500">I have an Ordinary Diploma</p>
                            </button>
                        </div>

                        {formData.pathway === 'ACSEE' && (
                            <div className="space-y-5 mb-6 animate-fade-in border-t border-slate-100 pt-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject Combination</label>
                                    <select
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none text-slate-700 transition-colors"
                                        value={formData.acsee.combination}
                                        onChange={(e) => setFormData(f => ({ ...f, acsee: { combination: e.target.value, grades: {} } }))}
                                    >
                                        <option value="">Select your combination</option>
                                        {COMBINATIONS.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {COMBINATION_SUBJECTS[formData.acsee.combination]?.length > 0 && (
                                    <div className="animate-fade-in bg-white rounded-xl border border-slate-200 p-5">
                                        <p className="text-sm font-semibold text-slate-700 mb-4">Your grades</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            {COMBINATION_SUBJECTS[formData.acsee.combination].map(sub => (
                                                <div key={sub}>
                                                    <label className="text-xs text-slate-500 block mb-1.5">{sub}</label>
                                                    <select
                                                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                                                        value={formData.acsee.grades[sub] || ''}
                                                        onChange={e => setFormData(f => ({ ...f, acsee: { ...f.acsee, grades: { ...f.acsee.grades, [sub]: e.target.value } } }))}
                                                    >
                                                        <option value="">Grade</option>
                                                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {formData.pathway === 'DIPLOMA' && (
                            <div className="space-y-4 mb-6 animate-fade-in border-t border-slate-100 pt-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Exact Diploma Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Diploma in Clinical Medicine"
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none text-slate-700 transition-colors"
                                        value={formData.diploma.field}
                                        onChange={(e) => setFormData(f => ({ ...f, diploma: { ...f.diploma, field: e.target.value } }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Final GPA</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        placeholder="e.g. 3.5"
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none text-slate-700 transition-colors"
                                        value={formData.diploma.gpa}
                                        onChange={(e) => setFormData(f => ({ ...f, diploma: { ...f.diploma, gpa: e.target.value } }))}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Step 1 of {STEPS.length}</span>
                            <button
                                onClick={advance}
                                disabled={
                                    !formData.pathway ||
                                    (formData.pathway === 'ACSEE' && !formData.acsee.combination) ||
                                    (formData.pathway === 'DIPLOMA' && (!formData.diploma.field || !formData.diploma.gpa))
                                }
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Continue <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Interests ── */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <QuizHeader
                            title="What are your interests and goals?"
                            sub="The more detail you give, the better the AI can match you."
                        />

                        <textarea
                            autoFocus
                            className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none min-h-[160px] text-slate-700 resize-none text-sm leading-relaxed mb-6"
                            placeholder="I enjoy solving math problems, building things, and working with computers. I dream of becoming an engineer one day..."
                            value={formData.interests}
                            onChange={e => setFormData(f => ({ ...f, interests: e.target.value }))}
                        />

                        <div className="flex justify-between items-center">
                            <button onClick={back} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                                <ArrowLeft size={15} /> Back
                            </button>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">Step 2 of {STEPS.length}</span>
                                <button
                                    onClick={advance}
                                    disabled={!formData.interests.trim()}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Continue <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Working style (personality) ── */}
                {step === 3 && (
                    <div className="animate-fade-in" key={personalityQ}>
                        <QuizHeader
                            title={currentQ.question}
                            sub={null}
                        />

                        {/* Sub-step dots */}
                        <div className="flex gap-1.5 mb-8">
                            {PERSONALITY_QUESTIONS.map((_, i) => (
                                <div key={i} className={`h-1 rounded-full transition-all duration-300
                                    ${i < personalityQ + 1 ? 'bg-accent' : 'bg-slate-200'}
                                    ${i === personalityQ ? 'w-8' : 'w-4'}`}
                                />
                            ))}
                        </div>

                        <div className={`grid gap-3 mb-8 ${currentQ.options.length > 4 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {currentQ.options.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handlePersonalitySelect(currentQ.key, opt.value)}
                                    className={`text-left p-5 rounded-xl border transition-all
                                        ${formData.personality[currentQ.key] === opt.value
                                            ? 'bg-accent/5 border-accent'
                                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                                >
                                    <h3 className={`font-semibold text-base mb-1 ${formData.personality[currentQ.key] === opt.value ? 'text-accent' : 'text-slate-900'}`}>
                                        {opt.label}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-snug">{opt.sub}</p>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center">
                            <button onClick={back} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                                <ArrowLeft size={15} /> Back
                            </button>
                            <span className="text-xs text-slate-400">Step 3 of {STEPS.length}</span>
                        </div>
                    </div>
                )}

                {/* ── Step 4: Results ── */}
                {step === 4 && (
                    <div className="animate-fade-in">
                        {loading ? (
                            <div className="text-center py-24">
                                <Loader2 className="animate-spin text-accent mx-auto mb-5" size={44} />
                                <h2 className="page-heading text-2xl font-bold text-slate-900 mb-2">Analysing your profile…</h2>
                                <p className="text-slate-500">Matching you against every programme in our database.</p>
                                <p className="text-slate-400 text-sm mt-1.5">This usually takes 10–15 seconds.</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-lg mx-auto mb-6">
                                    <p className="font-bold mb-1">Something went wrong</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                                <button onClick={() => { setStep(3); setError(null); }}
                                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                                    Try again
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-light text-amber-700 text-sm font-semibold mb-4">
                                        <CheckCircle size={15} /> {matches.length} matches found
                                    </div>
                                    <h2 className="page-heading text-3xl font-bold text-slate-900">Your Top Recommendations</h2>

                                    {synthesis && (
                                        <div className="mt-6 text-left p-6 bg-indigo-50 border border-indigo-100 rounded-2xl relative shadow-inner">
                                            <div className="absolute -top-3 -left-3 p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                                                <Sparkles size={16} />
                                            </div>
                                            <strong className="block text-indigo-900 mb-2 text-xs uppercase tracking-wider">AI Profile Synthesis</strong>
                                            <p className="text-slate-700 text-base italic">"{synthesis}"</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    {matches.map((prog, i) => (
                                        <CourseCard key={prog.id || i} programme={prog} academicProfile={formData} />
                                    ))}
                                </div>

                                {/* Email capture */}
                                <div className="border-t border-slate-100 pt-8">
                                    <h3 className="font-semibold text-slate-900 mb-1">Save your results</h3>
                                    <p className="text-sm text-slate-500 mb-4">Enter your email and we'll send you a copy of these matches.</p>
                                    <div className="flex gap-2 max-w-md">
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.captureEmail || ''}
                                            onChange={e => setFormData(f => ({ ...f, captureEmail: e.target.value }))}
                                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-accent/20 text-sm"
                                        />
                                        <button
                                            disabled={!formData.captureEmail || isSendingEmail}
                                            onClick={async () => {
                                                setIsSendingEmail(true);
                                                setEmailAck('');
                                                try {
                                                    const res = await fetch('/api/capture-lead/', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            email: formData.captureEmail,
                                                            combination: formData.combination,
                                                            interests: formData.interests,
                                                            personality: formData.personality,
                                                            synthesis,
                                                            matches: matches.map(m => m.generic_name).join(', '),
                                                        })
                                                    });
                                                    const data = await res.json();
                                                    if (!res.ok) throw new Error(data.error || 'Failed');
                                                    const sentTo = formData.captureEmail;
                                                    setFormData(f => ({ ...f, captureEmail: '' }));
                                                    setEmailAck(`Sent to ${sentTo}`);
                                                    setTimeout(() => setEmailAck(''), 5000);
                                                } catch (e) {
                                                    setEmailAck(`Error: ${e.message}`);
                                                    setTimeout(() => setEmailAck(''), 5000);
                                                } finally {
                                                    setIsSendingEmail(false);
                                                }
                                            }}
                                            className="px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-colors text-sm whitespace-nowrap flex items-center gap-2"
                                        >
                                            {isSendingEmail ? <Loader2 className="animate-spin" size={15} /> : null}
                                            Send
                                        </button>
                                    </div>
                                    {emailAck && (
                                        <p className={`mt-3 text-sm font-medium ${emailAck.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                                            {emailAck}
                                        </p>
                                    )}
                                </div>

                                <div className="text-center pb-4">
                                    <button
                                        onClick={() => { setStep(1); setMatches([]); setSynthesis(''); setPersonalityQ(0); setFormData({ combination: '', grades: {}, interests: '', personality: { environment: '', activity: '', impact: '', role: '' }, captureEmail: '' }); }}
                                        className="text-sm text-slate-400 hover:text-primary transition-colors"
                                    >
                                        Start over
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const QuizHeader = ({ title, sub }) => (
    <div className="mb-8">
        <h1 className="page-heading text-2xl md:text-3xl font-bold text-slate-900 mb-2">{title}</h1>
        {sub && <p className="text-slate-500 text-sm">{sub}</p>}
    </div>
);

export default GuidanceWizard;
