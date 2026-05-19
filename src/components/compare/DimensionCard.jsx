import { useLanguage } from '../../context/LanguageContext';

function renderInlineMarkdown(text) {
    // Split on **bold** and *italic* patterns, return mixed JSX
    const parts = [];
    // Regex: **bold** takes priority over *italic*
    const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        if (match[0].startsWith('**')) {
            parts.push(<strong key={match.index}>{match[2]}</strong>);
        } else {
            parts.push(<em key={match.index}>{match[3]}</em>);
        }
        lastIndex = pattern.lastIndex;
    }
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }
    return parts;
}

export default function DimensionCard({ title, similarities = [], differences = [] }) {
    const { t } = useLanguage();

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h3>

            <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2.5">
                    {t('compare.label.similarities')}
                </p>
                {similarities.length > 0 ? (
                    <ul className="space-y-2">
                        {similarities.map((item, i) => (
                            <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                                <span className="text-emerald-500 mt-1 shrink-0 text-xs">●</span>
                                <span>{renderInlineMarkdown(item)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-400 italic">No common points identified.</p>
                )}
            </div>

            <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2.5">
                    {t('compare.label.differences')}
                </p>
                {differences.length > 0 ? (
                    <ul className="space-y-2">
                        {differences.map((item, i) => (
                            <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                                <span className="text-amber-500 mt-1 shrink-0 text-xs">●</span>
                                <span>{renderInlineMarkdown(item)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-400 italic">No notable differences identified.</p>
                )}
            </div>
        </div>
    );
}
