import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Lightbulb, AlertTriangle, HelpCircle, ExternalLink, Star } from 'lucide-react';
import DimensionCard from './DimensionCard';
import ComparisonRating from './ComparisonRating';
import { renderInlineMarkdown } from '../../utils/renderMarkdown.jsx';

function DataQualityNotice({ name, quality, t }) {
    if (quality === 'full') return null;
    const key = quality === 'insufficient'
        ? 'compare.dataQuality.insufficient'
        : 'compare.dataQuality.partial';
    return (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-500" />
            <span><span className="font-semibold">{name}:</span> {t(key)}</span>
        </div>
    );
}

function UniBadge({ short, colour }) {
    const colours = {
        indigo: 'bg-indigo-600 text-white',
        emerald: 'bg-emerald-600 text-white',
    };
    return (
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shrink-0 ${colours[colour]}`}>
            {short ? short.slice(0, 3).toUpperCase() : '?'}
        </span>
    );
}

function MetaChip({ label }) {
    if (!label) return null;
    return (
        <span className="inline-block text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">
            {label}
        </span>
    );
}

function durationLabel(months) {
    if (!months) return null;
    const yrs = Math.round(months / 12 * 10) / 10;
    return yrs === Math.round(yrs) ? `${Math.round(yrs)} yr${Math.round(yrs) !== 1 ? 's' : ''}` : `${yrs} yrs`;
}

function KeyDiffChip({ label, valA, valB }) {
    if (!valA || !valB || valA === valB) return null;
    return (
        <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
            <span className="text-slate-400 font-medium">{label}</span>
            <span className="font-semibold text-indigo-700">{valA}</span>
            <span className="text-slate-300">→</span>
            <span className="font-semibold text-emerald-700">{valB}</span>
        </div>
    );
}

function RecommendationCard({ programme, colour, bullets }) {
    const colours = {
        indigo: {
            dot: 'bg-indigo-500',
            badge: 'bg-indigo-50 border-indigo-200 text-indigo-700',
            eyebrow: 'text-indigo-500',
        },
        emerald: {
            dot: 'bg-emerald-500',
            badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
            eyebrow: 'text-emerald-500',
        },
    };
    const c = colours[colour];
    const items = Array.isArray(bullets) ? bullets : (bullets ? [bullets] : []);
    if (!items.length) return null;

    return (
        <div className="flex flex-col gap-3 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                <p className={`text-xs font-bold uppercase tracking-wider ${c.eyebrow}`}>{programme}</p>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Choose this if…</p>
            <ul className="space-y-2.5">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                        <Star size={12} className={`shrink-0 mt-1 ${colour === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'}`} />
                        <span>{renderInlineMarkdown(item)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function ComparisonResult({ result }) {
    const { t } = useLanguage();
    const { programme_a, programme_b, dimensions = {}, synthesis, recommendation = {}, data_quality = {} } = result;
    const [activeTab, setActiveTab] = useState(0);

    const nameA = programme_a?.name;
    const nameB = programme_b?.name;
    const shortA = programme_a?.university_short;
    const shortB = programme_b?.university_short;
    const durA = durationLabel(programme_a?.duration_months);
    const durB = durationLabel(programme_b?.duration_months);
    const modeA = programme_a?.study_mode;
    const modeB = programme_b?.study_mode;
    const awardA = programme_a?.award_level;
    const awardB = programme_b?.award_level;

    const tabs = [
        {
            label: t('compare.section.contents'),
            similarities: dimensions.contents?.similarities,
            pointsA: dimensions.contents?.programme_a,
            pointsB: dimensions.contents?.programme_b,
        },
        {
            label: t('compare.section.structure'),
            similarities: dimensions.structure?.similarities,
            pointsA: dimensions.structure?.programme_a,
            pointsB: dimensions.structure?.programme_b,
        },
        {
            label: t('compare.section.careers'),
            similarities: dimensions.careers?.similarities,
            pointsA: dimensions.careers?.programme_a,
            pointsB: dimensions.careers?.programme_b,
        },
    ];

    const forA = recommendation.for_a;
    const forB = recommendation.for_b;
    const hasRecommendation = (Array.isArray(forA) ? forA.length : !!forA) || (Array.isArray(forB) ? forB.length : !!forB);

    return (
        <div className="flex flex-col gap-5">

            {/* ── Programme header ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* VS strip */}
                <div className="grid grid-cols-[1fr_auto_1fr]">
                    {/* Programme A */}
                    <div className="p-5 sm:p-6 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <UniBadge short={shortA} colour="indigo" />
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-0.5">Programme A</p>
                                <p className="text-sm text-slate-500 truncate">{programme_a?.university}</p>
                            </div>
                        </div>
                        <p className="text-base font-bold text-slate-900 leading-snug">{nameA}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {awardA && <MetaChip label={awardA} />}
                            {durA && <MetaChip label={durA} />}
                            {modeA && <MetaChip label={modeA} />}
                        </div>
                    </div>

                    {/* VS badge */}
                    <div className="flex items-center justify-center px-4">
                        <span className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white shadow">VS</span>
                    </div>

                    {/* Programme B */}
                    <div className="p-5 sm:p-6 flex flex-col gap-3 items-end text-right">
                        <div className="flex items-center gap-3 flex-row-reverse">
                            <UniBadge short={shortB} colour="emerald" />
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Programme B</p>
                                <p className="text-sm text-slate-500 truncate">{programme_b?.university}</p>
                            </div>
                        </div>
                        <p className="text-base font-bold text-slate-900 leading-snug">{nameB}</p>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                            {awardB && <MetaChip label={awardB} />}
                            {durB && <MetaChip label={durB} />}
                            {modeB && <MetaChip label={modeB} />}
                        </div>
                    </div>
                </div>

                {/* Key differences strip */}
                {(durA !== durB || awardA !== awardB) && (
                    <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/60 flex flex-wrap gap-2">
                        <span className="text-xs text-slate-400 font-medium self-center mr-1">Key differences:</span>
                        <KeyDiffChip label="Duration" valA={durA} valB={durB} />
                        <KeyDiffChip label="Award" valA={awardA} valB={awardB} />
                        <KeyDiffChip label="Mode" valA={modeA} valB={modeB} />
                    </div>
                )}
            </div>

            {/* ── Data quality notices ── */}
            {(data_quality.a !== 'full' || data_quality.b !== 'full') && (
                <div className="flex flex-col gap-2">
                    <DataQualityNotice name={nameA} quality={data_quality.a} t={t} />
                    <DataQualityNotice name={nameB} quality={data_quality.b} t={t} />
                </div>
            )}

            {/* ── Synthesis ── */}
            {synthesis && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={17} className="text-accent shrink-0" />
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('compare.synthesis.title')}</h2>
                    </div>
                    <p className="text-base text-slate-700 leading-relaxed">{renderInlineMarkdown(synthesis)}</p>
                </div>
            )}

            {/* ── Dimension tabs ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200 overflow-x-auto">
                    {tabs.map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                                activeTab === i
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <DimensionCard
                    key={activeTab}
                    nameA={nameA}
                    nameB={nameB}
                    similarities={tabs[activeTab].similarities}
                    pointsA={tabs[activeTab].pointsA}
                    pointsB={tabs[activeTab].pointsB}
                />
            </div>

            {/* ── Which one is right for you ── */}
            {hasRecommendation && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-1">
                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Which one is right for you?</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <RecommendationCard programme={nameA} colour="indigo" bullets={forA} />
                        <RecommendationCard programme={nameB} colour="emerald" bullets={forB} />
                    </div>
                </div>
            )}

            {/* ── Still torn? ── */}
            <div className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                <span className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                    <HelpCircle size={20} className="text-white" />
                </span>
                <div>
                    <p className="text-sm font-bold text-slate-900 mb-1">Still not sure which one to pick?</p>
                    <p className="text-sm text-slate-500 mb-3">Answer a few quick questions and our course finder will suggest the programme that fits your goals and background best.</p>
                    <a
                        href="/guidance"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-indigo-800 transition-colors"
                    >
                        Find my course <ExternalLink size={13} />
                    </a>
                </div>
            </div>

            {/* ── Rating ── */}
            <ComparisonRating
                programmeAId={programme_a?.id}
                programmeBId={programme_b?.id}
            />
        </div>
    );
}
