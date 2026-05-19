import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Lightbulb, AlertTriangle } from 'lucide-react';
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

export default function ComparisonResult({ result }) {
    const { t } = useLanguage();
    const { programme_a, programme_b, dimensions = {}, synthesis, recommendation = {}, data_quality = {} } = result;
    const [activeTab, setActiveTab] = useState(0);

    const nameA = programme_a?.name;
    const nameB = programme_b?.name;

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

    return (
        <div className="flex flex-col gap-6">

            {/* Programme header — colour coded */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-slate-100">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Programme A</p>
                        </div>
                        <p className="text-base font-bold text-slate-900 leading-snug">{nameA}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{programme_a?.university}</p>
                        {programme_a?.award_level && (
                            <span className="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full px-2.5 py-1">{programme_a.award_level}</span>
                        )}
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Programme B</p>
                        </div>
                        <p className="text-base font-bold text-slate-900 leading-snug">{nameB}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{programme_b?.university}</p>
                        {programme_b?.award_level && (
                            <span className="inline-block mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1">{programme_b.award_level}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Data quality notices */}
            {(data_quality.a !== 'full' || data_quality.b !== 'full') && (
                <div className="flex flex-col gap-2">
                    <DataQualityNotice name={nameA} quality={data_quality.a} t={t} />
                    <DataQualityNotice name={nameB} quality={data_quality.b} t={t} />
                </div>
            )}

            {/* Synthesis */}
            {synthesis && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={17} className="text-accent shrink-0" />
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('compare.synthesis.title')}</h2>
                    </div>
                    <p className="text-base text-slate-700 leading-relaxed">{renderInlineMarkdown(synthesis)}</p>
                </div>
            )}

            {/* Dimension tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Tab bar */}
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

                {/* Active panel */}
                <DimensionCard
                    key={activeTab}
                    nameA={nameA}
                    nameB={nameB}
                    similarities={tabs[activeTab].similarities}
                    pointsA={tabs[activeTab].pointsA}
                    pointsB={tabs[activeTab].pointsB}
                />
            </div>

            {/* Recommendation — after details so student has context */}
            {(recommendation.for_a || recommendation.for_b) && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 pt-5 pb-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Which one is right for you?</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recommendation.for_a && (
                            <div className="flex items-start gap-4 px-6 py-4">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                                <p className="text-sm text-slate-700 leading-relaxed">{renderInlineMarkdown(recommendation.for_a)}</p>
                            </div>
                        )}
                        {recommendation.for_b && (
                            <div className="flex items-start gap-4 px-6 py-4">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                <p className="text-sm text-slate-700 leading-relaxed">{renderInlineMarkdown(recommendation.for_b)}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Rating */}
            <ComparisonRating
                programmeAId={programme_a?.id}
                programmeBId={programme_b?.id}
            />
        </div>
    );
}
