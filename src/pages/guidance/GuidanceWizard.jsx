import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseCard from '../../components/courses/CourseCard';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { trackTelemetry } from '../../utils/telemetry';
import { useLanguage } from '../../context/LanguageContext';

// ─── Static Data ───────────────────────────────────────────────────────────────

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

// Personality question keys — labels/subs come from translations
const PERSONALITY_QUESTION_KEYS = [
    {
        key: 'environment',
        tKey: 'wizard.q1',
        options: [
            { value: 'A', tLabel: 'wizard.q1.A.label', tSub: 'wizard.q1.A.sub' },
            { value: 'B', tLabel: 'wizard.q1.B.label', tSub: 'wizard.q1.B.sub' },
            { value: 'C', tLabel: 'wizard.q1.C.label', tSub: 'wizard.q1.C.sub' },
            { value: 'D', tLabel: 'wizard.q1.D.label', tSub: 'wizard.q1.D.sub' },
        ],
    },
    {
        key: 'activity',
        tKey: 'wizard.q2',
        options: [
            { value: 'A', tLabel: 'wizard.q2.A.label', tSub: 'wizard.q2.A.sub' },
            { value: 'B', tLabel: 'wizard.q2.B.label', tSub: 'wizard.q2.B.sub' },
            { value: 'C', tLabel: 'wizard.q2.C.label', tSub: 'wizard.q2.C.sub' },
            { value: 'D', tLabel: 'wizard.q2.D.label', tSub: 'wizard.q2.D.sub' },
        ],
    },
    {
        key: 'impact',
        tKey: 'wizard.q3',
        options: [
            { value: 'A', tLabel: 'wizard.q3.A.label', tSub: 'wizard.q3.A.sub' },
            { value: 'B', tLabel: 'wizard.q3.B.label', tSub: 'wizard.q3.B.sub' },
            { value: 'C', tLabel: 'wizard.q3.C.label', tSub: 'wizard.q3.C.sub' },
            { value: 'D', tLabel: 'wizard.q3.D.label', tSub: 'wizard.q3.D.sub' },
            { value: 'E', tLabel: 'wizard.q3.E.label', tSub: 'wizard.q3.E.sub' },
        ],
    },
    {
        key: 'role',
        tKey: 'wizard.q4',
        options: [
            { value: 'A', tLabel: 'wizard.q4.A.label', tSub: 'wizard.q4.A.sub' },
            { value: 'B', tLabel: 'wizard.q4.B.label', tSub: 'wizard.q4.B.sub' },
            { value: 'C', tLabel: 'wizard.q4.C.label', tSub: 'wizard.q4.C.sub' },
            { value: 'D', tLabel: 'wizard.q4.D.label', tSub: 'wizard.q4.D.sub' },
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
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        pathway: '',
        acsee: { combination: '', grades: {} },
        diploma: { field: '', gpa: '' },
        interests: '',
        personality: { environment: '', activity: '', impact: '', role: '' },
        captureEmail: '',
    });

    const STEPS = [
        t('wizard.stepAcademic'),
        t('wizard.stepInterests'),
        t('wizard.stepWorkingStyle'),
        t('wizard.stepResults'),
    ];

    const advance = () => setStep(s => s + 1);

    const back = () => {
        if (step === 3 && personalityQ > 0) { setPersonalityQ(q => q - 1); return; }
        setStep(s => s - 1);
        if (step === 3) setPersonalityQ(0);
    };

    const handlePersonalitySelect = (key, value) => {
        const updated = { ...formData.personality, [key]: value };
        setFormData(f => ({ ...f, personality: updated }));

        if (personalityQ < PERSONALITY_QUESTION_KEYS.length - 1) {
            setTimeout(() => setPersonalityQ(q => q + 1), 220);
        } else {
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

            const comboLabel = data.pathway === 'ACSEE' ? (COMBINATIONS.find(c => c.value === data.acsee.combination)?.label || data.acsee.combination) : data.diploma.field;
            let psychoLogs = {};
            for (const key of Object.keys(data.personality)) {
                const qObj = PERSONALITY_QUESTION_KEYS.find(q => q.key === key);
                if (qObj) {
                    const option = qObj.options.find(o => o.value === data.personality[key]);
                    if (option) {
                        psychoLogs[t(qObj.tKey)] = `${t(option.tLabel)} - ${t(option.tSub)}`;
                    }
                }
            }

            trackTelemetry('guidance_conversion', {
                pathway: data.pathway,
                academic_inputs: {
                    background: data.pathway,
                    combination: comboLabel,
                    acsee_grades: data.acsee.grades,
                    diploma_gpa: data.diploma.gpa
                },
                psychometric_inputs: psychoLogs,
                ai_synthesis: json.ai_synthesis || '',
                ai_recommendations: Array.isArray(json.matches) ? json.matches.map(m => {
                    if (m.offered_at && m.offered_at.length > 0) {
                        return {
                            programme_name: m.generic_name || m.name,
                            offered_at_count: m.offered_at.length,
                            institutions: m.offered_at.map(offer => ({
                                programme_id: offer.id,
                                university_id: offer.university?.id || offer.university,
                                university_name: offer.university?.name || offer.university_name || offer.university_short_name || 'Unknown University'
                            }))
                        };
                    }
                    return {
                        programme_id: m.id,
                        programme_name: m.generic_name || m.name,
                        university_id: m.university?.id || m.university,
                        university_name: m.university?.name || m.university_name || m.university_short_name || 'Unknown University'
                    };
                }) : [],
                converted_to_lead: false
            });

            if (Array.isArray(json.matches)) { setMatches(json.matches); setSynthesis(json.ai_synthesis || ''); }
            else if (Array.isArray(json)) { setMatches(json); }
            else setMatches([]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const currentQ = PERSONALITY_QUESTION_KEYS[personalityQ];
    const activeGroup = step === 1 ? 0 : step === 2 ? 1 : step === 3 ? 2 : 3;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Progress bar */}
            {step < 4 && (
                <div className="border-b border-slate-200 bg-white">
                    <div className="container mx-auto px-6 py-5 max-w-lg">
                        <div className="flex items-center">
                            {STEPS.map((g, i) => {
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
                            title={t('wizard.step1Title')}
                            sub={t('wizard.step1Sub')}
                        />

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => setFormData(f => ({ ...f, pathway: 'ACSEE' }))}
                                className={`p-4 rounded-xl border transition-all text-left ${formData.pathway === 'ACSEE' ? 'border-accent bg-accent/5' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <h4 className={`font-bold mb-1 ${formData.pathway === 'ACSEE' ? 'text-accent' : 'text-slate-900'}`}>{t('wizard.form6Title')}</h4>
                                <p className="text-xs text-slate-500">{t('wizard.form6Sub')}</p>
                            </button>
                            <button
                                onClick={() => setFormData(f => ({ ...f, pathway: 'DIPLOMA' }))}
                                className={`p-4 rounded-xl border transition-all text-left ${formData.pathway === 'DIPLOMA' ? 'border-accent bg-accent/5' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <h4 className={`font-bold mb-1 ${formData.pathway === 'DIPLOMA' ? 'text-accent' : 'text-slate-900'}`}>{t('wizard.diplomaTitle')}</h4>
                                <p className="text-xs text-slate-500">{t('wizard.diplomaSub')}</p>
                            </button>
                        </div>

                        {formData.pathway === 'ACSEE' && (
                            <div className="space-y-5 mb-6 animate-fade-in border-t border-slate-100 pt-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('wizard.subjectCombination')}</label>
                                    <select
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none text-slate-700 transition-colors"
                                        value={formData.acsee.combination}
                                        onChange={(e) => setFormData(f => ({ ...f, acsee: { combination: e.target.value, grades: {} } }))}
                                    >
                                        <option value="">{t('wizard.selectCombination')}</option>
                                        {COMBINATIONS.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {COMBINATION_SUBJECTS[formData.acsee.combination]?.length > 0 && (
                                    <div className="animate-fade-in bg-white rounded-xl border border-slate-200 p-5">
                                        <p className="text-sm font-semibold text-slate-700 mb-4">{t('wizard.yourGrades')}</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            {COMBINATION_SUBJECTS[formData.acsee.combination].map(sub => (
                                                <div key={sub}>
                                                    <label className="text-xs text-slate-500 block mb-1.5">{sub}</label>
                                                    <select
                                                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                                                        value={formData.acsee.grades[sub] || ''}
                                                        onChange={e => setFormData(f => ({ ...f, acsee: { ...f.acsee, grades: { ...f.acsee.grades, [sub]: e.target.value } } }))}
                                                    >
                                                        <option value="">{t('wizard.grade')}</option>
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
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('wizard.diplomaFieldLabel')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('wizard.diplomaFieldPlaceholder')}
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none text-slate-700 transition-colors"
                                        value={formData.diploma.field}
                                        onChange={(e) => setFormData(f => ({ ...f, diploma: { ...f.diploma, field: e.target.value } }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('wizard.gpaLabel')}</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        placeholder={t('wizard.gpaPlaceholder')}
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none text-slate-700 transition-colors"
                                        value={formData.diploma.gpa}
                                        onChange={(e) => setFormData(f => ({ ...f, diploma: { ...f.diploma, gpa: e.target.value } }))}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">{t('wizard.step')} 1 {t('wizard.of')} {STEPS.length}</span>
                            <button
                                onClick={advance}
                                disabled={
                                    !formData.pathway ||
                                    (formData.pathway === 'ACSEE' && !formData.acsee.combination) ||
                                    (formData.pathway === 'DIPLOMA' && (!formData.diploma.field || !formData.diploma.gpa))
                                }
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                {t('wizard.continue')} <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Interests ── */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <QuizHeader
                            title={t('wizard.step2Title')}
                            sub={t('wizard.step2Sub')}
                        />

                        <textarea
                            autoFocus
                            className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none min-h-[160px] text-slate-700 resize-none text-sm leading-relaxed mb-6"
                            placeholder={t('wizard.interestsPlaceholder')}
                            value={formData.interests}
                            onChange={e => setFormData(f => ({ ...f, interests: e.target.value }))}
                        />

                        <div className="flex justify-between items-center">
                            <button onClick={back} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                                <ArrowLeft size={15} /> {t('wizard.back')}
                            </button>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">{t('wizard.step')} 2 {t('wizard.of')} {STEPS.length}</span>
                                <button
                                    onClick={advance}
                                    disabled={!formData.interests.trim()}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    {t('wizard.continue')} <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Working style (personality) ── */}
                {step === 3 && (
                    <div className="animate-fade-in" key={personalityQ}>
                        <QuizHeader
                            title={t(currentQ.tKey)}
                            sub={null}
                        />

                        {/* Sub-step dots */}
                        <div className="flex gap-1.5 mb-8">
                            {PERSONALITY_QUESTION_KEYS.map((_, i) => (
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
                                        {t(opt.tLabel)}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-snug">{t(opt.tSub)}</p>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center">
                            <button onClick={back} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                                <ArrowLeft size={15} /> {t('wizard.back')}
                            </button>
                            <span className="text-xs text-slate-400">{t('wizard.step')} 3 {t('wizard.of')} {STEPS.length}</span>
                        </div>
                    </div>
                )}

                {/* ── Step 4: Results ── */}
                {step === 4 && (
                    <div className="animate-fade-in">
                        {loading ? (
                            <div className="text-center py-24">
                                <Loader2 className="animate-spin text-accent mx-auto mb-5" size={44} />
                                <h2 className="page-heading text-2xl font-bold text-slate-900 mb-2">{t('wizard.analysingTitle')}</h2>
                                <p className="text-slate-500">{t('wizard.analysingDesc')}</p>
                                <p className="text-slate-400 text-sm mt-1.5">{t('wizard.analysingTime')}</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-lg mx-auto mb-6">
                                    <p className="font-bold mb-1">{t('wizard.errorTitle')}</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                                <button onClick={() => { setStep(3); setError(null); }}
                                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                                    {t('wizard.tryAgain')}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-light text-amber-700 text-sm font-semibold mb-4">
                                        <CheckCircle size={15} /> {matches.length} {t('wizard.matchesFound')}
                                    </div>
                                    <h2 className="page-heading text-3xl font-bold text-slate-900">{t('wizard.resultsTitle')}</h2>

                                    {synthesis && (
                                        <div className="mt-6 text-left p-6 bg-indigo-50 border border-indigo-100 rounded-2xl relative shadow-inner">
                                            <div className="absolute -top-3 -left-3 p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                                                <Sparkles size={16} />
                                            </div>
                                            <strong className="block text-indigo-900 mb-2 text-xs uppercase tracking-wider">{t('wizard.aiSynthesisLabel')}</strong>
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
                                    <h3 className="font-semibold text-slate-900 mb-1">{t('wizard.saveResultsTitle')}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{t('wizard.saveResultsSub')}</p>
                                    <div className="flex gap-2 max-w-md">
                                        <input
                                            type="email"
                                            placeholder={t('wizard.emailPlaceholder')}
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

                                                    trackTelemetry('guidance_conversion', { converted_to_lead: true });

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
                                            {t('wizard.send')}
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
                                        onClick={() => { setStep(1); setMatches([]); setSynthesis(''); setPersonalityQ(0); setFormData({ pathway: '', acsee: { combination: '', grades: {} }, diploma: { field: '', gpa: '' }, interests: '', personality: { environment: '', activity: '', impact: '', role: '' }, captureEmail: '' }); }}
                                        className="text-sm text-slate-400 hover:text-primary transition-colors"
                                    >
                                        {t('wizard.startOver')}
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
