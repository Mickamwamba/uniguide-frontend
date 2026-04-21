import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseCard from '../../components/courses/CourseCard';
import {
    Sparkles, Loader2, CheckCircle, ArrowLeft, ChevronRight,
    Zap, Activity, TrendingUp, BookOpen, HelpCircle,
    Hash, Layers, MessageCircle, Users, List,
    Monitor, Pen, FileText, Mic, Code,
    Lightbulb, Shield, Heart, Briefcase, Compass,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const COMBO_CARDS = [
    {
        code: 'PCM',
        title: 'PCM',
        desc: 'Physics, Chemistry, Mathematics — engineering, tech, data & physical sciences.',
        icon: <Zap size={22} />,
        key: '1',
    },
    {
        code: 'PCB',
        title: 'PCB',
        desc: 'Physics, Chemistry, Biology — medicine, nursing, pharmacy & life sciences.',
        icon: <Activity size={22} />,
        key: '2',
    },
    {
        code: 'EGM',
        title: 'EGM',
        desc: 'Economics, Geography, Mathematics — business, finance, planning & analytics.',
        icon: <TrendingUp size={22} />,
        key: '3',
    },
    {
        code: 'HGL',
        title: 'HGL / HGE',
        desc: 'Humanities & languages — law, education, journalism & public admin.',
        icon: <BookOpen size={22} />,
        key: '4',
    },
];

const ALL_COMBINATIONS = [
    { value: 'PCM',  label: 'PCM',  full: 'Physics, Chemistry, Mathematics' },
    { value: 'PCB',  label: 'PCB',  full: 'Physics, Chemistry, Biology' },
    { value: 'PGM',  label: 'PGM',  full: 'Physics, Geography, Mathematics' },
    { value: 'PMC',  label: 'PMC',  full: 'Physics, Mathematics, Computer Science' },
    { value: 'EGM',  label: 'EGM',  full: 'Economics, Geography, Mathematics' },
    { value: 'CBG',  label: 'CBG',  full: 'Chemistry, Biology, Geography' },
    { value: 'CBA',  label: 'CBA',  full: 'Chemistry, Biology, Agriculture' },
    { value: 'CBN',  label: 'CBN',  full: 'Chemistry, Biology, Food & Nutrition' },
    { value: 'HGL',  label: 'HGL',  full: 'History, Geography, English Language' },
    { value: 'HGK',  label: 'HGK',  full: 'History, Geography, Kiswahili' },
    { value: 'HKL',  label: 'HKL',  full: 'History, Kiswahili, English Language' },
    { value: 'KLF',  label: 'KLF',  full: 'Kiswahili, English Language, French' },
    { value: 'ECA',  label: 'ECA',  full: 'Economics, Commerce, Accountancy' },
    { value: 'HGE',  label: 'HGE',  full: 'History, Geography, Economics' },
    { value: 'KEC',  label: 'KEC',  full: 'Kiswahili, English, Chinese' },
];

const PERSONALITY_QUESTIONS = [
    {
        key: 'school_moment',
        kick: 'PERSONALITY · QUESTION 1 OF 4',
        headingParts: ['Looking back at school, what was your', 'favourite moment', '?'],
        sub: "The thing that made you feel most alive.",
        options: [
            { value: 'Cracking hard Math/Physics problems',           label: 'Cracking a hard Math or Physics problem',   icon: <Hash size={22} /> },
            { value: 'Doing lab practicals and experiments',           label: 'Doing practicals in the laboratory',        icon: <Layers size={22} /> },
            { value: 'Leading discussions or debating',                label: 'Leading discussions or debates',            icon: <MessageCircle size={22} /> },
            { value: 'Helping students understand difficult topics',   label: 'Helping friends understand topics',         icon: <Users size={22} /> },
            { value: 'Organizing school events or mini-businesses',    label: 'Organising events or business ideas',       icon: <List size={22} /> },
        ],
    },
    {
        key: 'hobby',
        kick: 'PERSONALITY · QUESTION 2 OF 4',
        headingParts: ['On a free Saturday, what are you', 'most likely doing', '?'],
        sub: "Be honest — nobody is watching.",
        options: [
            { value: 'Tinkering with phones/computers',        label: 'Tinkering with phones or computers',          icon: <Monitor size={22} /> },
            { value: 'Reading or watching documentaries',      label: 'Reading or watching documentaries',           icon: <BookOpen size={22} /> },
            { value: 'Socializing and meeting new people',     label: 'Socialising and meeting new people',          icon: <Users size={22} /> },
            { value: 'Drawing, writing, or editing media',     label: 'Creating — drawing, writing or editing',      icon: <Pen size={22} /> },
        ],
    },
    {
        key: 'dealbreaker',
        kick: 'PERSONALITY · QUESTION 3 OF 4',
        headingParts: ['The', 'one thing', "you never want to do?"],
        sub: "Your dealbreaker. Be ruthless.",
        options: [
            { value: 'Memorizing essays or theories',              label: 'Memorising long essays or theories',           icon: <FileText size={22} /> },
            { value: 'Doing complex Math or Physics equations',    label: 'Looking at complex Math or Physics equations', icon: <Hash size={22} /> },
            { value: 'Public speaking in front of crowds',         label: 'Speaking in front of crowds',                  icon: <Mic size={22} /> },
            { value: 'Working alone in a lab or coding all day',   label: 'Stuck in a lab or coding all day',             icon: <Code size={22} /> },
        ],
    },
    {
        key: 'endgame',
        kick: 'PERSONALITY · QUESTION 4 OF 4',
        headingParts: ['Ten years from now —', "what's your", 'endgame?'],
        sub: "The version of yourself you're building towards.",
        options: [
            { value: 'Innovator (Building/Inventing tech)',              label: 'The Innovator — build or invent new tech & systems', icon: <Lightbulb size={22} /> },
            { value: 'Pillar of Stability (Government/Teaching)',        label: 'The Pillar — secure, respected career',               icon: <Shield size={22} /> },
            { value: 'Caregiver (Saving lives or helping people)',       label: 'The Caregiver — save lives or defend people',         icon: <Heart size={22} /> },
            { value: 'The Boss (Entrepreneur/Manager)',                  label: 'The Boss — start companies and lead teams',           icon: <Briefcase size={22} /> },
            { value: 'The Explorer (Working out in the field)',          label: 'The Explorer — adventurous field career',             icon: <Compass size={22} /> },
        ],
    },
];

// ─── Progress group mapping ───────────────────────────────────────────────────
// screens: 1=combination, 2=interests, 3-6=personality q1-q4, 7=results
const GROUPS = ['Academic', 'Interests', 'Personality', 'Results'];
function getActiveGroup(screen) {
    if (screen === 1) return 0;
    if (screen === 2) return 1;
    if (screen <= 6) return 2;
    return 3;
}

// ─── Component ───────────────────────────────────────────────────────────────

const GuidanceWizard = () => {
    const [screen, setScreen] = useState(1);
    const [showAllCombos, setShowAllCombos] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);
    const [matches, setMatches]   = useState([]);
    const [synthesis, setSynthesis] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailAck, setEmailAck] = useState('');

    const [formData, setFormData] = useState({
        combination: '',
        interests: '',
        personality: { school_moment: '', hobby: '', dealbreaker: '', endgame: '' },
        captureEmail: '',
    });

    const activeGroup = getActiveGroup(screen);

    const goBack = () => {
        if (screen === 1) return;
        // If we were in showAllCombos mode, going back closes it first
        if (screen === 1 && showAllCombos) { setShowAllCombos(false); return; }
        setScreen(s => s - 1);
    };

    const goNext = () => setScreen(s => s + 1);

    const handleFindMatches = async () => {
        setScreen(7);
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/recommend/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    combination: formData.combination,
                    interests:   formData.interests,
                    personality: formData.personality,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch recommendations');
            if (data?.matches && Array.isArray(data.matches)) {
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

    // Which personality question is active (0-indexed)
    const pqIndex = screen >= 3 && screen <= 6 ? screen - 3 : null;
    const pq = pqIndex !== null ? PERSONALITY_QUESTIONS[pqIndex] : null;

    // Is the current screen ready to proceed?
    const canContinue = (() => {
        if (screen === 1) return !!formData.combination;
        if (screen === 2) return formData.interests.trim().length > 0;
        if (pqIndex !== null) return !!formData.personality[pq.key];
        return true;
    })();

    const screenCount = 6; // 6 input screens before results

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Quiz progress nav bar */}
            {screen < 7 && (
                <div className="border-b border-slate-200 bg-white">
                    <div className="container mx-auto px-6 py-5 max-w-lg">
                        <div className="flex items-center">
                            {GROUPS.map((g, i) => {
                                const done   = activeGroup > i;
                                const active = activeGroup === i;
                                return (
                                    <React.Fragment key={g}>
                                        {/* Step */}
                                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                                ${done   ? 'bg-warm text-white shadow-sm shadow-amber-400/30' :
                                                  active ? 'bg-accent text-white shadow-sm shadow-indigo-500/30' :
                                                           'bg-slate-200 text-slate-400'}`}
                                            >
                                                {done ? <CheckCircle size={16} /> : i + 1}
                                            </div>
                                            <span className={`text-xs font-medium transition-colors hidden sm:block
                                                ${active ? 'text-accent' : done ? 'text-warm' : 'text-slate-400'}`}>
                                                {g}
                                            </span>
                                        </div>

                                        {/* Connector line */}
                                        {i < GROUPS.length - 1 && (
                                            <div className={`flex-1 h-1 mx-3 mb-4 rounded-full transition-all duration-500 ${activeGroup > i ? 'bg-warm' : 'bg-slate-200'}`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Main quiz area */}
            <div className="container mx-auto px-6 py-12 max-w-4xl">

                {/* ── Screen 1: Combination ── */}
                {screen === 1 && (
                    <div className="animate-fade-in">
                        <QuizKick>ACADEMIC · QUESTION 1 OF 1</QuizKick>
                        <QuizHeading parts={['What was your Form 6', 'combination', '?']} />
                        <QuizSub>We'll only show programmes that accept it.</QuizSub>

                        {!showAllCombos ? (
                            <>
                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    {COMBO_CARDS.map((c) => (
                                        <OptCard
                                            key={c.code}
                                            keyBadge={c.key}
                                            icon={c.icon}
                                            title={c.title}
                                            desc={c.desc}
                                            selected={formData.combination === c.code}
                                            onClick={() => setFormData({ ...formData, combination: c.code })}
                                        />
                                    ))}
                                </div>

                                {/* "Another combination" — full width */}
                                <button
                                    onClick={() => setShowAllCombos(true)}
                                    className={`w-full flex items-start gap-4 p-5 rounded-xl border text-left transition-all relative
                                        ${!COMBO_CARDS.find(c => c.code === formData.combination) && formData.combination
                                            ? 'bg-accent/5 border-accent'
                                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                                >
                                    <span className="absolute top-3 right-3 w-5 h-5 rounded-md bg-slate-100 text-[11px] text-slate-400 font-bold flex items-center justify-center">5</span>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <HelpCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base text-slate-900 leading-tight mb-1">Another combination, or not sure</h3>
                                        <p className="text-sm text-slate-500">Pick a specific combination — CBG, HKL, PMC… or check your results slip.</p>
                                    </div>
                                </button>
                            </>
                        ) : (
                            <div className="animate-fade-in">
                                <button
                                    onClick={() => setShowAllCombos(false)}
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors"
                                >
                                    <ArrowLeft size={15} /> Back to main options
                                </button>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {ALL_COMBINATIONS.map((c) => (
                                        <button
                                            key={c.value}
                                            onClick={() => setFormData({ ...formData, combination: c.value })}
                                            className={`p-4 rounded-xl border text-left transition-all
                                                ${formData.combination === c.value
                                                    ? 'bg-accent/5 border-accent'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                        >
                                            <div className={`font-bold text-base ${formData.combination === c.value ? 'text-accent' : 'text-slate-800'}`}>{c.label}</div>
                                            <div className="text-[11px] mt-0.5 leading-snug text-slate-400">{c.full}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <QuizNav
                            onBack={null}
                            onContinue={goNext}
                            canContinue={canContinue}
                            counter={`${screen} of ${screenCount}`}
                        />
                    </div>
                )}

                {/* ── Screen 2: Interests ── */}
                {screen === 2 && (
                    <div className="animate-fade-in">
                        <QuizKick>INTERESTS · QUESTION 1 OF 1</QuizKick>
                        <QuizHeading parts={['What are you', 'passionate about', '?']} />
                        <QuizSub>Tell us your interests and career goals — the more detail, the better the match.</QuizSub>

                        <div className="mt-8 max-w-2xl mx-auto">
                            <textarea
                                autoFocus
                                className="w-full p-5 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none min-h-[180px] text-slate-700 resize-none text-base leading-relaxed shadow-sm"
                                placeholder="e.g. I enjoy solving problems and working with computers. I dream of becoming a software engineer or data scientist one day…"
                                value={formData.interests}
                                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                            />
                            <p className="text-xs text-slate-400 mt-2 ml-1">Aim for 2–3 sentences. The AI reads this carefully.</p>
                        </div>

                        <QuizNav
                            onBack={goBack}
                            onContinue={goNext}
                            canContinue={canContinue}
                            counter={`${screen} of ${screenCount}`}
                        />
                    </div>
                )}

                {/* ── Screens 3–6: Personality questions ── */}
                {pq && (
                    <div className="animate-fade-in" key={screen}>
                        <QuizKick>{pq.kick}</QuizKick>
                        <QuizHeading parts={pq.headingParts} />
                        <QuizSub>{pq.sub}</QuizSub>

                        <div className={`grid gap-4 mt-8 ${pq.options.length === 5 ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
                            {pq.options.map((opt, idx) => (
                                <OptCard
                                    key={opt.value}
                                    keyBadge={String(idx + 1)}
                                    icon={opt.icon}
                                    title={opt.label}
                                    selected={formData.personality[pq.key] === opt.value}
                                    onClick={() => setFormData({
                                        ...formData,
                                        personality: { ...formData.personality, [pq.key]: opt.value }
                                    })}
                                    // Last option full-width when there are 5 options
                                    fullWidth={pq.options.length === 5 && idx === 4}
                                />
                            ))}
                        </div>

                        <QuizNav
                            onBack={goBack}
                            onContinue={screen === 6 ? handleFindMatches : goNext}
                            canContinue={canContinue}
                            counter={`${screen} of ${screenCount}`}
                            ctaLabel={screen === 6 ? <>Find my courses <Sparkles size={16} /></> : undefined}
                            ctaAccent={screen === 6}
                        />
                    </div>
                )}

                {/* ── Screen 7: Results ── */}
                {screen === 7 && (
                    <div className="animate-fade-in max-w-3xl mx-auto">
                        {loading ? (
                            <div className="text-center py-24">
                                <Loader2 className="animate-spin text-accent mx-auto mb-6" size={44} />
                                <h2 className="page-heading text-2xl font-bold text-slate-900 mb-3">
                                    Analysing your profile…
                                </h2>
                                <p className="text-slate-500">Matching you against every programme in our database.</p>
                                <p className="text-slate-400 text-sm mt-2">Usually takes 10–15 seconds.</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-lg mx-auto mb-6">
                                    <p className="font-bold mb-1">Something went wrong</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                                <button
                                    onClick={() => { setScreen(3); setError(null); }}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {/* Heading */}
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-light text-amber-700 text-sm font-semibold mb-4">
                                        <CheckCircle size={15} /> {matches.length} matches found
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

                                {/* Results grid */}
                                <div className="grid md:grid-cols-2 gap-5">
                                    {matches.map((prog, idx) => (
                                        <CourseCard key={prog.id || prog.generic_name || idx} programme={prog} />
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
                                            onChange={(e) => setFormData({ ...formData, captureEmail: e.target.value })}
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
                                                            matches: matches.map(m => m.generic_name).join(', ')
                                                        })
                                                    });
                                                    const data = await res.json();
                                                    if (!res.ok) throw new Error(data.error || 'Failed');
                                                    const sentTo = formData.captureEmail;
                                                    setFormData({ ...formData, captureEmail: '' });
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

                                {/* Restart */}
                                <div className="text-center pb-4">
                                    <button
                                        onClick={() => {
                                            setScreen(1);
                                            setMatches([]);
                                            setSynthesis('');
                                            setShowAllCombos(false);
                                            setFormData({ combination: '', interests: '', personality: { school_moment: '', hobby: '', dealbreaker: '', endgame: '' }, captureEmail: '' });
                                        }}
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

            <Footer />
        </div>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const QuizKick = ({ children }) => (
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
        {children}
    </p>
);

const QuizHeading = ({ parts }) => {
    const [before, highlight, after] = parts;
    return (
        <h1 className="page-heading text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
            {before}{' '}
            <span className="text-accent">{highlight}</span>
            {after ? after : ''}
        </h1>
    );
};

const QuizSub = ({ children }) => (
    <p className="text-center text-slate-500 text-sm mb-8">{children}</p>
);

const OptCard = ({ keyBadge, icon, title, desc, selected, onClick, fullWidth }) => (
    <button
        onClick={onClick}
        className={`relative flex flex-col gap-3 p-5 rounded-xl border text-left transition-all
            ${fullWidth ? 'sm:col-span-2' : ''}
            ${selected
                ? 'bg-accent/5 border-accent shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
    >
        {/* Keyboard badge */}
        <span className={`absolute top-3 right-3 w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center
            ${selected ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-400'}`}>
            {keyBadge}
        </span>

        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            ${selected ? 'bg-accent/10 text-accent' : 'bg-indigo-50 text-indigo-600'}`}>
            {icon}
        </div>

        {/* Text */}
        <div>
            <h3 className={`font-semibold text-base leading-snug ${selected ? 'text-accent' : 'text-slate-900'}`}>
                {title}
            </h3>
            {desc && (
                <p className="text-sm mt-1 leading-relaxed text-slate-500">
                    {desc}
                </p>
            )}
        </div>
    </button>
);

const QuizNav = ({ onBack, onContinue, canContinue, ctaLabel, ctaAccent }) => (
    <div className="flex items-center justify-between mt-8">
        {onBack ? (
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
            >
                <ArrowLeft size={15} /> Back
            </button>
        ) : <div />}

        <button
            onClick={onContinue}
            disabled={!canContinue}
            className={`flex items-center gap-2 py-2.5 px-6 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed
                ${ctaAccent
                    ? 'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-indigo-500/20'
                    : 'bg-accent text-white hover:bg-accent-hover'}`}
        >
            {ctaLabel || <>Continue <ChevronRight size={16} /></>}
        </button>
    </div>
);

export default GuidanceWizard;
