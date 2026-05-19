import { useLanguage } from '../../context/LanguageContext';
import DimensionCard from './DimensionCard';
import ComparisonRating from './ComparisonRating';

function DataQualityNotice({ side, quality, t }) {
    if (quality === 'full') return null;
    const key = quality === 'insufficient'
        ? 'compare.dataQuality.insufficient'
        : 'compare.dataQuality.partial';
    return (
        <div className="bg-amber-900/30 border border-amber-500/50 rounded-xl px-4 py-2 text-xs text-amber-300">
            <span className="font-semibold">{side?.name}:</span> {t(key)}
        </div>
    );
}

export default function ComparisonResult({ result }) {
    const { t } = useLanguage();
    const { programme_a, programme_b, dimensions = {}, synthesis, data_quality = {} } = result;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Programme A</p>
                    <p className="text-base font-bold text-slate-100">{programme_a?.name}</p>
                    <p className="text-xs text-indigo-400">{programme_a?.university}</p>
                </div>
                <span className="text-indigo-500 font-bold text-xl self-center">vs</span>
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Programme B</p>
                    <p className="text-base font-bold text-slate-100">{programme_b?.name}</p>
                    <p className="text-xs text-indigo-400">{programme_b?.university}</p>
                </div>
            </div>

            {(data_quality.a !== 'full' || data_quality.b !== 'full') && (
                <div className="flex flex-col gap-2">
                    <DataQualityNotice side={programme_a} quality={data_quality.a} t={t} />
                    <DataQualityNotice side={programme_b} quality={data_quality.b} t={t} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DimensionCard
                    title={t('compare.section.contents')}
                    similarities={dimensions.contents?.similarities}
                    differences={dimensions.contents?.differences}
                />
                <DimensionCard
                    title={t('compare.section.structure')}
                    similarities={dimensions.structure?.similarities}
                    differences={dimensions.structure?.differences}
                />
                <DimensionCard
                    title={t('compare.section.careers')}
                    similarities={dimensions.careers?.similarities}
                    differences={dimensions.careers?.differences}
                />
            </div>

            {synthesis && (
                <div className="bg-slate-800 rounded-2xl p-5">
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                        {t('compare.synthesis.title')}
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">{synthesis}</p>
                </div>
            )}

            <ComparisonRating
                programmeAId={programme_a?.id}
                programmeBId={programme_b?.id}
            />
        </div>
    );
}
