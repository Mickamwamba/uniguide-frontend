import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
    AlertTriangle, ChevronDown, ChevronUp,
    Share2, Printer, ExternalLink, RotateCcw, Sparkles
} from 'lucide-react';
import ComparisonRating from './ComparisonRating';
import { renderInlineMarkdown } from '../../utils/renderMarkdown.jsx';

/* ─── helpers ─── */
function durationLabel(months) {
    if (!months) return null;
    const yrs = months / 12;
    return Number.isInteger(yrs) ? `${yrs} yr${yrs !== 1 ? 's' : ''}` : `${yrs.toFixed(1)} yrs`;
}

function DataQualityNotice({ name, quality, t }) {
    if (quality === 'full') return null;
    const key = quality === 'insufficient' ? 'compare.dataQuality.insufficient' : 'compare.dataQuality.partial';
    return (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-500" />
            <span><span className="font-semibold">{name}:</span> {t(key)}</span>
        </div>
    );
}

/* ─── Section wrapper ─── */
function Section({ eyebrow, title, children }) {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400">{eyebrow}</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{title}</h3>
            </div>
            {children}
        </div>
    );
}

/* ─── Shared 2-column table header ─── */
function ColHeader({ nameA, nameB }) {
    return (
        <div className="grid grid-cols-2 border-b border-slate-100">
            <div className="px-4 py-2.5 border-r border-slate-100">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider truncate">{nameA}</span>
                </div>
            </div>
            <div className="px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider truncate">{nameB}</span>
                </div>
            </div>
        </div>
    );
}

/* ─── Quick-facts table (genuine label | A | B data) ─── */
function FactRow({ label, valA, valB }) {
    const differs = valA && valB && String(valA) !== String(valB);
    return (
        <div className={`grid border-t border-slate-100 ${differs ? 'bg-red-50' : ''}`}
            style={{ gridTemplateColumns: '110px 1fr 1fr' }}>
            <div className="px-3 py-3 text-xs font-mono uppercase tracking-wide text-slate-400 bg-slate-50 border-r border-slate-100 self-center">
                {label}
            </div>
            <div className={`px-4 py-3 text-sm border-r border-slate-100 ${differs ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                {differs && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-2 mb-0.5 align-middle" />}
                {valA || '—'}
            </div>
            <div className={`px-4 py-3 text-sm ${differs ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                {differs && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-2 mb-0.5 align-middle" />}
                {valB || '—'}
            </div>
        </div>
    );
}

function FactsTable({ nameA, nameB, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="relative">
                <div className="overflow-x-auto">
                    <div style={{ minWidth: '420px' }}>
                        <div className="grid border-b border-slate-100" style={{ gridTemplateColumns: '110px 1fr 1fr' }}>
                            <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-100" />
                            <div className="px-4 py-2.5 border-r border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider truncate">{nameA}</span>
                                </div>
                            </div>
                            <div className="px-4 py-2.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider truncate">{nameB}</span>
                                </div>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
                {/* Scroll hint gradient — mobile only */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent sm:hidden" />
            </div>
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Red dot = values differ between the two programmes</span>
                <span className="sm:hidden text-slate-300">← swipe</span>
            </div>
        </div>
    );
}

/* ─── Shared mobile A/B tab bar ─── */
function MobileTabBar({ nameA, nameB, activeTab, setActiveTab }) {
    return (
        <div className="flex sm:hidden border-b border-slate-100">
            <button
                onClick={() => setActiveTab('a')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors border-b-2 ${
                    activeTab === 'a'
                        ? 'text-indigo-600 border-indigo-500 bg-indigo-50/40'
                        : 'text-slate-400 border-transparent'
                }`}
            >
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <span className="truncate max-w-[120px]">{nameA}</span>
            </button>
            <button
                onClick={() => setActiveTab('b')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors border-b-2 ${
                    activeTab === 'b'
                        ? 'text-emerald-600 border-emerald-500 bg-emerald-50/40'
                        : 'text-slate-400 border-transparent'
                }`}
            >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate max-w-[120px]">{nameB}</span>
            </button>
        </div>
    );
}

/* ─── Bullet list table (independent columns, no implied row pairing) ─── */
function BulletTable({ nameA, nameB, pointsA = [], pointsB = [], similarities = [] }) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('a');
    if (!pointsA.length && !pointsB.length && !similarities.length) return null;

    const bulletList = (points, dot) => points.length === 0
        ? <p className="text-sm text-slate-300 italic">No specific data available.</p>
        : points.map((item, i) => (
            <div key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                <span className={`shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full ${dot}`} />
                <span>{renderInlineMarkdown(item)}</span>
            </div>
        ));

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Desktop header */}
            <div className="hidden sm:block"><ColHeader nameA={nameA} nameB={nameB} /></div>

            {/* Mobile: tab switcher */}
            <MobileTabBar nameA={nameA} nameB={nameB} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Mobile: single active column */}
            <div className="sm:hidden p-4 flex flex-col gap-3">
                {activeTab === 'a' ? bulletList(pointsA, 'bg-indigo-300') : bulletList(pointsB, 'bg-emerald-300')}
            </div>

            {/* Desktop: side by side */}
            <div className="hidden sm:grid grid-cols-2 divide-x divide-slate-100">
                <div className="p-4 flex flex-col gap-3">{bulletList(pointsA, 'bg-indigo-300')}</div>
                <div className="p-4 flex flex-col gap-3">{bulletList(pointsB, 'bg-emerald-300')}</div>
            </div>

            {similarities.length > 0 && (
                <div className="border-t border-slate-100">
                    <button
                        onClick={() => setOpen(s => !s)}
                        className="w-full flex items-center justify-between px-5 py-3 text-xs font-mono text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <span>◆ {similarities.length} shared between both programmes</span>
                        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    {open && (
                        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 flex flex-col gap-3">
                            {similarities.map((item, i) => (
                                <div key={i} className="flex gap-2.5 text-sm text-slate-500 leading-relaxed">
                                    <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    <span>{renderInlineMarkdown(item)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── Career pathways — employers + job titles, two independent columns ─── */
function CareersSection({ nameA, nameB, careersData }) {
    const {
        similarities = [],
        programme_a: notesA = [],
        programme_b: notesB = [],
        employers_a = [],
        employers_b = [],
        pathways_a = [],
        pathways_b = [],
    } = careersData || {};
    const [open, setOpen] = useState(false);

    const hasContent = employers_a.length || employers_b.length || pathways_a.length || pathways_b.length;
    if (!hasContent && !notesA.length && !notesB.length) return null;

    const [activeTab, setActiveTab] = useState('a');

    const colA = (
        <div className="px-4 py-5 flex flex-col gap-5">
            {employers_a.length > 0 && (
                <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">Typical employers</p>
                    <div className="flex flex-wrap gap-1.5">
                        {employers_a.map((e, i) => (
                            <span key={i} className="text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-2.5 py-1">{e}</span>
                        ))}
                    </div>
                </div>
            )}
            {pathways_a.length > 0 && (
                <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">Career pathways</p>
                    <ul className="flex flex-col gap-2">
                        {pathways_a.map((p, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />{p}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {notesA.length > 0 && (
                <div className="flex flex-col gap-2">
                    {notesA.map((item, i) => (
                        <div key={i} className="flex gap-2.5 text-sm text-slate-500 leading-relaxed">
                            <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-indigo-200" />
                            <span>{renderInlineMarkdown(item)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const colB = (
        <div className="px-4 py-5 flex flex-col gap-5">
            {employers_b.length > 0 && (
                <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">Typical employers</p>
                    <div className="flex flex-wrap gap-1.5">
                        {employers_b.map((e, i) => (
                            <span key={i} className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-1">{e}</span>
                        ))}
                    </div>
                </div>
            )}
            {pathways_b.length > 0 && (
                <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">Career pathways</p>
                    <ul className="flex flex-col gap-2">
                        {pathways_b.map((p, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />{p}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {notesB.length > 0 && (
                <div className="flex flex-col gap-2">
                    {notesB.map((item, i) => (
                        <div key={i} className="flex gap-2.5 text-sm text-slate-500 leading-relaxed">
                            <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-emerald-200" />
                            <span>{renderInlineMarkdown(item)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Desktop header */}
                <div className="hidden sm:block"><ColHeader nameA={nameA} nameB={nameB} /></div>

                {/* Mobile: tab switcher */}
                <MobileTabBar nameA={nameA} nameB={nameB} activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Mobile: single active column */}
                <div className="sm:hidden">{activeTab === 'a' ? colA : colB}</div>

                {/* Desktop: side by side */}
                <div className="hidden sm:grid grid-cols-2 divide-x divide-slate-100">
                    {colA}
                    {colB}
                </div>

                {similarities.length > 0 && (
                    <div className="border-t border-slate-100">
                        <button
                            onClick={() => setOpen(s => !s)}
                            className="w-full flex items-center justify-between px-5 py-3 text-xs font-mono text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <span>◆ {similarities.length} shared career outcomes</span>
                            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                        {open && (
                            <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 flex flex-col gap-3">
                                {similarities.map((item, i) => (
                                    <div key={i} className="flex gap-2.5 text-sm text-slate-500 leading-relaxed">
                                        <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        <span>{renderInlineMarkdown(item)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Entry requirements — merge rows by pathway name (fix 4) ─── */
function mergeByPathway(reqsA = [], reqsB = []) {
    const pathways = new Set([...reqsA.map(r => r.pathway), ...reqsB.map(r => r.pathway)]);
    return [...pathways].sort().map(pathway => ({
        pathway,
        a: reqsA.find(r => r.pathway === pathway) || null,
        b: reqsB.find(r => r.pathway === pathway) || null,
    }));
}

function EntryReqTable({ nameA, nameB, reqsA = [], reqsB = [] }) {
    const rows = mergeByPathway(reqsA, reqsB);
    if (!rows.length) return null;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="relative">
                <div className="overflow-x-auto">
                    <div style={{ minWidth: '420px' }}>
                        <div className="grid border-b border-slate-100" style={{ gridTemplateColumns: '100px 1fr 1fr' }}>
                            <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-100" />
                            <div className="px-4 py-2.5 border-r border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider truncate">{nameA}</span>
                                </div>
                            </div>
                            <div className="px-4 py-2.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider truncate">{nameB}</span>
                                </div>
                            </div>
                        </div>
                        {rows.map(({ pathway, a, b }) => (
                            <div key={pathway} className="grid border-t border-slate-100" style={{ gridTemplateColumns: '100px 1fr 1fr' }}>
                                <div className="px-3 py-4 text-xs font-mono uppercase tracking-wide text-slate-400 bg-slate-50 border-r border-slate-100 self-start">
                                    {pathway}
                                </div>
                                <div className="px-4 py-4 text-sm text-slate-700 leading-relaxed border-r border-slate-100">
                                    {a?.description || <span className="text-slate-300">—</span>}
                                </div>
                                <div className="px-4 py-4 text-sm text-slate-700 leading-relaxed">
                                    {b?.description || <span className="text-slate-300">—</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Scroll hint gradient — mobile only */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent sm:hidden" />
            </div>
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs font-mono text-slate-300 sm:hidden text-right">
                ← swipe to see both
            </div>
        </div>
    );
}

/* ─── Recommendation table — 2 independent columns, no label column ─── */
function RecoTable({ nameA, nameB, forA = [], forB = [], progA, progB }) {
    const bulletsA = Array.isArray(forA) ? forA : (forA ? [forA] : []);
    const bulletsB = Array.isArray(forB) ? forB : (forB ? [forB] : []);
    const [activeTab, setActiveTab] = useState('a');
    if (!bulletsA.length && !bulletsB.length) return null;

    const bulletList = (bullets) => bullets.map((item, i) => (
        <div key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
            <span className="shrink-0 mt-[7px] w-[5px] h-[5px] rounded-full bg-slate-800" />
            <span>{renderInlineMarkdown(item)}</span>
        </div>
    ));

    const linksA = (
        <div className="px-4 py-3 flex flex-wrap gap-2">
            {progA?.id && (
                <Link to={`/programmes/${progA.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded-lg px-3 py-1.5 transition-colors bg-white">
                    View programme <ExternalLink size={10} />
                </Link>
            )}
            {progA?.university_id && (
                <Link to={`/universities/${progA.university_id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded-lg px-3 py-1.5 transition-colors bg-white">
                    University <ExternalLink size={10} />
                </Link>
            )}
        </div>
    );

    const linksB = (
        <div className="px-4 py-3 flex flex-wrap gap-2">
            {progB?.id && (
                <Link to={`/programmes/${progB.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded-lg px-3 py-1.5 transition-colors bg-white">
                    View programme <ExternalLink size={10} />
                </Link>
            )}
            {progB?.university_id && (
                <Link to={`/universities/${progB.university_id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded-lg px-3 py-1.5 transition-colors bg-white">
                    University <ExternalLink size={10} />
                </Link>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Desktop header */}
            <div className="hidden sm:block"><ColHeader nameA={nameA} nameB={nameB} /></div>

            {/* Mobile: tab switcher */}
            <MobileTabBar nameA={nameA} nameB={nameB} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* "Consider this if…" sub-header */}
            <div className="border-b border-slate-100 bg-slate-50/50">
                {/* Desktop: two columns */}
                <div className="hidden sm:grid grid-cols-2">
                    <div className="px-4 py-2 text-xs font-mono text-indigo-400 border-r border-slate-100">Consider this if…</div>
                    <div className="px-4 py-2 text-xs font-mono text-emerald-400">Consider this if…</div>
                </div>
                {/* Mobile: single label coloured to active tab */}
                <div className={`sm:hidden px-4 py-2 text-xs font-mono ${activeTab === 'a' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                    Consider this if…
                </div>
            </div>

            {/* Mobile: single active column */}
            <div className="sm:hidden p-4 flex flex-col gap-3">
                {activeTab === 'a' ? bulletList(bulletsA) : bulletList(bulletsB)}
            </div>

            {/* Desktop: side by side */}
            <div className="hidden sm:grid grid-cols-2 divide-x divide-slate-100">
                <div className="p-4 flex flex-col gap-3">{bulletList(bulletsA)}</div>
                <div className="p-4 flex flex-col gap-3">{bulletList(bulletsB)}</div>
            </div>

            {/* Links row */}
            <div className="border-t border-slate-200 bg-slate-50">
                {/* Mobile: only active tab's links */}
                <div className="sm:hidden">{activeTab === 'a' ? linksA : linksB}</div>
                {/* Desktop: both */}
                <div className="hidden sm:grid grid-cols-2 divide-x divide-slate-100">
                    {linksA}
                    {linksB}
                </div>
            </div>
        </div>
    );
}

/* ─── Dark CTA strip ─── */
function CtaStrip({ progA, progB, onReset }) {
    const [copied, setCopied] = useState(false);

    function share() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Ready to decide?</p>
                <p className="text-lg font-bold text-slate-900 mt-1">What do you want to do next?</p>
            </div>
            <div className="flex flex-wrap gap-2">
                <button onClick={share} className="inline-flex items-center gap-1.5 text-xs font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors text-slate-600">
                    <Share2 size={13} /> {copied ? 'Copied!' : 'Share link'}
                </button>
                <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 text-xs font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors text-slate-600">
                    <Printer size={13} /> Print / PDF
                </button>
                {progA?.id && (
                    <Link to={`/programmes/${progA.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        {progA.university_short || 'Programme A'} <ExternalLink size={11} />
                    </Link>
                )}
                {progB?.id && (
                    <Link to={`/programmes/${progB.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        {progB.university_short || 'Programme B'} <ExternalLink size={11} />
                    </Link>
                )}
                {onReset && (
                    <button onClick={onReset} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent hover:bg-indigo-700 text-white rounded-lg px-3 py-2 transition-colors">
                        <RotateCcw size={13} /> Start new comparison
                    </button>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════════ */
export default function ComparisonResult({ result, onReset }) {
    const { t } = useLanguage();
    const {
        programme_a,
        programme_b,
        dimensions = {},
        synthesis,
        recommendation = {},
        data_quality = {},
    } = result;

    const nameA = programme_a?.name;
    const nameB = programme_b?.name;
    const shortA = programme_a?.university_short;
    const shortB = programme_b?.university_short;
    const durA = durationLabel(programme_a?.duration_months);
    const durB = durationLabel(programme_b?.duration_months);

    const forA = recommendation.for_a;
    const forB = recommendation.for_b;
    const hasRecommendation = (Array.isArray(forA) ? forA.length : !!forA) || (Array.isArray(forB) ? forB.length : !!forB);

    return (
        <div className="flex flex-col gap-8">

            {/* ── Data quality notices ── */}
            {(data_quality.a !== 'full' || data_quality.b !== 'full') && (
                <div className="flex flex-col gap-2">
                    <DataQualityNotice name={nameA} quality={data_quality.a} t={t} />
                    <DataQualityNotice name={nameB} quality={data_quality.b} t={t} />
                </div>
            )}

            {/* ── Programme header — two separate cards with VS between ── */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
                {/* Card A */}
                <div className="flex-1 bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-5 flex gap-4 items-start">
                    <div className="shrink-0 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold font-mono leading-none text-center px-2.5 py-2.5 min-w-[2.5rem]">
                        {shortA || 'A'}
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                        <p className="text-xs font-mono uppercase tracking-wider text-indigo-400">Programme A</p>
                        <p className="text-base font-bold text-slate-900 leading-snug">{nameA}</p>
                        <p className="text-sm text-slate-500">{programme_a?.university}</p>
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {programme_a?.award_level && <span className="text-xs font-mono bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">{programme_a.award_level}</span>}
                            {durA && <span className="text-xs font-mono bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">{durA}</span>}
                            {programme_a?.study_mode && <span className="text-xs font-mono bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">{programme_a.study_mode}</span>}
                        </div>
                    </div>
                </div>

                {/* VS badge */}
                <div className="flex items-center justify-center py-1 sm:py-0 sm:px-1">
                    <span className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white font-mono shrink-0">VS</span>
                </div>

                {/* Card B */}
                <div className="flex-1 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm p-5 flex gap-4 items-start">
                    <div className="shrink-0 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold font-mono leading-none text-center px-2.5 py-2.5 min-w-[2.5rem]">
                        {shortB || 'B'}
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                        <p className="text-xs font-mono uppercase tracking-wider text-emerald-500">Programme B</p>
                        <p className="text-base font-bold text-slate-900 leading-snug">{nameB}</p>
                        <p className="text-sm text-slate-500">{programme_b?.university}</p>
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {programme_b?.award_level && <span className="text-xs font-mono bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">{programme_b.award_level}</span>}
                            {durB && <span className="text-xs font-mono bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">{durB}</span>}
                            {programme_b?.study_mode && <span className="text-xs font-mono bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">{programme_b.study_mode}</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── AI Overview (fix 3: no redundant "at a glance" section title) ── */}
            {synthesis && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Sparkles size={15} className="text-accent shrink-0" />
                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">AI Overview</p>
                    </div>
                    <p className="text-base text-slate-700 leading-relaxed">{renderInlineMarkdown(synthesis)}</p>

                    {(durA !== durB || programme_a?.award_level !== programme_b?.award_level || programme_a?.study_mode !== programme_b?.study_mode) && (
                        <div className="flex flex-wrap gap-2">
                            {durA !== durB && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-mono border border-red-200 bg-red-50 text-slate-700 rounded-full px-3 py-1.5">
                                    <span className="text-red-500 font-semibold">Duration</span>
                                    {durA} → {durB}
                                </span>
                            )}
                            {programme_a?.award_level !== programme_b?.award_level && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-mono border border-red-200 bg-red-50 text-slate-700 rounded-full px-3 py-1.5">
                                    <span className="text-red-500 font-semibold">Award</span>
                                    {programme_a?.award_level} → {programme_b?.award_level}
                                </span>
                            )}
                            {programme_a?.study_mode !== programme_b?.study_mode && programme_a?.study_mode && programme_b?.study_mode && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-mono border border-red-200 bg-red-50 text-slate-700 rounded-full px-3 py-1.5">
                                    <span className="text-red-500 font-semibold">Mode</span>
                                    {programme_a.study_mode} → {programme_b.study_mode}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── Quick facts ── */}
            <Section eyebrow="01 · Quick facts" title="At a glance">
                <FactsTable nameA={nameA} nameB={nameB}>
                    <FactRow label="Duration" valA={durA} valB={durB} />
                    <FactRow label="Award" valA={programme_a?.award_level} valB={programme_b?.award_level} />
                    <FactRow label="Study mode" valA={programme_a?.study_mode} valB={programme_b?.study_mode} />
                    <FactRow label="University" valA={programme_a?.university} valB={programme_b?.university} />
                </FactsTable>
            </Section>

            {/* ── Entry requirements ── */}
            {(programme_a?.admission_requirements?.length > 0 || programme_b?.admission_requirements?.length > 0) && (
                <Section eyebrow="02 · Can you apply?" title="Entry requirements">
                    <EntryReqTable
                        nameA={nameA}
                        nameB={nameB}
                        reqsA={programme_a?.admission_requirements}
                        reqsB={programme_b?.admission_requirements}
                    />
                </Section>
            )}

            {/* ── Course contents ── */}
            {(dimensions.contents?.programme_a?.length > 0 || dimensions.contents?.programme_b?.length > 0) && (
                <Section eyebrow="03 · What you'll study" title="Course contents">
                    <BulletTable
                        nameA={nameA}
                        nameB={nameB}
                        pointsA={dimensions.contents?.programme_a}
                        pointsB={dimensions.contents?.programme_b}
                        similarities={dimensions.contents?.similarities}
                    />
                </Section>
            )}

            {/* ── Programme structure ── */}
            {(dimensions.structure?.programme_a?.length > 0 || dimensions.structure?.programme_b?.length > 0) && (
                <Section eyebrow="04 · How the degree is built" title="Programme structure">
                    <BulletTable
                        nameA={nameA}
                        nameB={nameB}
                        pointsA={dimensions.structure?.programme_a}
                        pointsB={dimensions.structure?.programme_b}
                        similarities={dimensions.structure?.similarities}
                    />
                </Section>
            )}

            {/* ── Career pathways ── */}
            {dimensions.careers && (
                <Section eyebrow="05 · Where graduates go" title="Career pathways">
                    <CareersSection
                        nameA={nameA}
                        nameB={nameB}
                        careersData={dimensions.careers}
                    />
                </Section>
            )}

            {/* ── Which one is for you? ── */}
            {hasRecommendation && (
                <Section eyebrow="06 · Which one is for you?" title="Your decision guide">
                    <RecoTable
                        nameA={nameA}
                        nameB={nameB}
                        forA={forA}
                        forB={forB}
                        progA={programme_a}
                        progB={programme_b}
                    />

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5">?</span>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 mb-1">Still torn?</p>
                            <p className="text-sm text-slate-500 mb-3">Answer a few quick questions and our course finder will match you to the programme that fits your goals and background best.</p>
                            <Link to="/guidance" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-indigo-800 transition-colors">
                                Find my course <ExternalLink size={13} />
                            </Link>
                        </div>
                    </div>
                </Section>
            )}

            {/* ── Rating (fix 5: section wrapper gives it equal visual weight) ── */}
            <Section eyebrow="07 · Your feedback" title="Was this comparison helpful?">
                <ComparisonRating
                    programmeAId={programme_a?.id}
                    programmeBId={programme_b?.id}
                />
            </Section>

            {/* ── CTA strip ── */}
            <CtaStrip progA={programme_a} progB={programme_b} onReset={onReset} />
        </div>
    );
}
