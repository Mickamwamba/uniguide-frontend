import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { renderInlineMarkdown } from '../../utils/renderMarkdown.jsx';

function BulletList({ items, color }) {
    if (!items || items.length === 0) {
        return <p className="text-sm text-slate-400 italic">No specific data available.</p>;
    }
    return (
        <ul className="space-y-2.5">
            {items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 leading-relaxed">
                    <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${color}`} />
                    <span>{renderInlineMarkdown(item)}</span>
                </li>
            ))}
        </ul>
    );
}

export default function DimensionCard({ title, nameA, nameB, similarities = [], pointsA = [], pointsB = [] }) {
    const [showSimilarities, setShowSimilarities] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

            {/* Section title */}
            <div className="px-5 py-3.5 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
            </div>

            {/* Programme column headers */}
            <div className="grid grid-cols-2 border-b border-slate-100 divide-x divide-slate-100">
                <div className="flex items-center gap-2 px-4 py-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-xs font-semibold text-indigo-600 leading-tight line-clamp-1">{nameA}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-emerald-600 leading-tight line-clamp-1">{nameB}</span>
                </div>
            </div>

            {/* Side-by-side bullet columns */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 flex-1">
                <div className="p-4">
                    <BulletList items={pointsA} color="bg-indigo-400" />
                </div>
                <div className="p-4">
                    <BulletList items={pointsB} color="bg-emerald-400" />
                </div>
            </div>

            {/* Similarities — collapsed by default */}
            {similarities.length > 0 && (
                <div className="border-t border-slate-100">
                    <button
                        onClick={() => setShowSimilarities(s => !s)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <span>{similarities.length} thing{similarities.length !== 1 ? 's' : ''} in common</span>
                        {showSimilarities ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    {showSimilarities && (
                        <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                            <BulletList items={similarities} color="bg-slate-300" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
