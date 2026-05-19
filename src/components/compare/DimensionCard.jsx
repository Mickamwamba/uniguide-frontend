import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { renderInlineMarkdown } from '../../utils/renderMarkdown.jsx';

function BulletList({ items, dotColor }) {
    if (!items || items.length === 0) {
        return <p className="text-sm text-slate-400 italic">No specific data available.</p>;
    }
    return (
        <ul className="space-y-3">
            {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className={`shrink-0 mt-2 w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <span>{renderInlineMarkdown(item)}</span>
                </li>
            ))}
        </ul>
    );
}

export default function DimensionCard({ nameA, nameB, similarities = [], pointsA = [], pointsB = [] }) {
    const [showSimilarities, setShowSimilarities] = useState(false);

    return (
        <div className="flex flex-col">
            {/* Side-by-side columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                {/* Programme A */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider truncate">{nameA}</p>
                    </div>
                    <BulletList items={pointsA} dotColor="bg-indigo-300" />
                </div>

                {/* Programme B */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider truncate">{nameB}</p>
                    </div>
                    <BulletList items={pointsB} dotColor="bg-emerald-300" />
                </div>
            </div>

            {/* Similarities toggle */}
            {similarities.length > 0 && (
                <div className="border-t border-slate-100">
                    <button
                        onClick={() => setShowSimilarities(s => !s)}
                        className="w-full flex items-center justify-between px-6 py-3 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <span>{similarities.length} thing{similarities.length !== 1 ? 's' : ''} in common</span>
                        {showSimilarities ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    {showSimilarities && (
                        <div className="px-6 pb-5 pt-1 border-t border-slate-100 bg-slate-50/60">
                            <BulletList items={similarities} dotColor="bg-slate-300" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
