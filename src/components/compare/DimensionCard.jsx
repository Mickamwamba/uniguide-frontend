import { useLanguage } from '../../context/LanguageContext';

export default function DimensionCard({ title, similarities = [], differences = [] }) {
    const { t } = useLanguage();

    return (
        <div className="bg-slate-800 rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="text-base font-bold text-indigo-400">{title}</h3>

            <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    {t('compare.label.similarities')}
                </p>
                {similarities.length > 0 ? (
                    <ul className="space-y-1">
                        {similarities.map((item, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-300">
                                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500 italic">—</p>
                )}
            </div>

            <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                    {t('compare.label.differences')}
                </p>
                {differences.length > 0 ? (
                    <ul className="space-y-1">
                        {differences.map((item, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-300">
                                <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500 italic">—</p>
                )}
            </div>
        </div>
    );
}
