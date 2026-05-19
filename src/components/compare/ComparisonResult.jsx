import { useLanguage } from '../../context/LanguageContext';
import { Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';
import DimensionCard from './DimensionCard';
import ComparisonRating from './ComparisonRating';

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

    return (
        <div className="flex flex-col gap-6">

            {/* Programme names header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    <div>
                        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Programme A</p>
                        <p className="text-lg font-bold text-slate-900 leading-snug">{programme_a?.name}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{programme_a?.university}</p>
                        {programme_a?.award_level && (
                            <span className="inline-block mt-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">{programme_a.award_level}</span>
                        )}
                    </div>
                    <div className="text-2xl font-bold text-slate-300 text-center">vs</div>
                    <div className="sm:text-right">
                        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Programme B</p>
                        <p className="text-lg font-bold text-slate-900 leading-snug">{programme_b?.name}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{programme_b?.university}</p>
                        {programme_b?.award_level && (
                            <span className="inline-block mt-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">{programme_b.award_level}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Data quality notices */}
            {(data_quality.a !== 'full' || data_quality.b !== 'full') && (
                <div className="flex flex-col gap-2">
                    <DataQualityNotice name={programme_a?.name} quality={data_quality.a} t={t} />
                    <DataQualityNotice name={programme_b?.name} quality={data_quality.b} t={t} />
                </div>
            )}

            {/* Synthesis — shown first */}
            {synthesis && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={18} className="text-accent shrink-0" />
                        <h2 className="text-base font-bold text-slate-900">{t('compare.synthesis.title')}</h2>
                    </div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                        What this means for you
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed">{synthesis}</p>
                    <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                        Use the breakdown below to dig into the specific differences in course content, how each programme is structured, and where each degree can take you after graduation.
                    </p>
                </div>
            )}

            {/* Recommendation block */}
            {(recommendation.for_a || recommendation.for_b) && (
                <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6">
                    <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-4">
                        Which one is right for you?
                    </p>
                    <div className="flex flex-col gap-3">
                        {recommendation.for_a && (
                            <div className="flex items-start gap-3 bg-white rounded-xl border border-indigo-100 px-4 py-3">
                                <ArrowRight size={15} className="text-accent shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-700 leading-relaxed">{recommendation.for_a}</p>
                            </div>
                        )}
                        {recommendation.for_b && (
                            <div className="flex items-start gap-3 bg-white rounded-xl border border-indigo-100 px-4 py-3">
                                <ArrowRight size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-700 leading-relaxed">{recommendation.for_b}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Dimension cards */}
            <div>
                <h2 className="text-base font-semibold text-slate-700 mb-3">Detailed Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DimensionCard
                        title={t('compare.section.contents')}
                        programmeAName={programme_a?.name}
                        programmeBName={programme_b?.name}
                        similarities={dimensions.contents?.similarities}
                        differences={dimensions.contents?.differences}
                    />
                    <DimensionCard
                        title={t('compare.section.structure')}
                        programmeAName={programme_a?.name}
                        programmeBName={programme_b?.name}
                        similarities={dimensions.structure?.similarities}
                        differences={dimensions.structure?.differences}
                    />
                    <DimensionCard
                        title={t('compare.section.careers')}
                        programmeAName={programme_a?.name}
                        programmeBName={programme_b?.name}
                        similarities={dimensions.careers?.similarities}
                        differences={dimensions.careers?.differences}
                    />
                </div>
            </div>

            {/* Rating */}
            <ComparisonRating
                programmeAId={programme_a?.id}
                programmeBId={programme_b?.id}
            />
        </div>
    );
}
