import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getTelemetrySessionId, trackTelemetry } from '../../utils/telemetry';

export default function ComparisonRating({ programmeAId, programmeBId }) {
    const { t } = useLanguage();
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState('idle');

    async function handleSubmit() {
        if (!rating) return;
        setStatus('loading');
        const sessionId = getTelemetrySessionId();
        try {
            const res = await fetch('/api/analytics/comparison-rating/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    programme_a_id: programmeAId,
                    programme_b_id: programmeBId,
                    rating,
                    comment,
                    session_id: sessionId
                })
            });
            if (!res.ok) throw new Error('failed');
            await trackTelemetry('comparison_rating', {
                programme_a_id: programmeAId,
                programme_b_id: programmeBId,
                rating
            });
            setStatus('success');
        } catch {
            setStatus('error');
        }
    }

    if (status === 'success') {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                <p className="text-emerald-600 font-semibold text-base">{t('compare.rating.thanks')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-base font-semibold text-slate-800 mb-4">{t('compare.rating.title')}</p>

            <div className="flex gap-2 mb-4" onMouseLeave={() => setHovered(0)}>
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        className={`text-3xl transition-colors leading-none ${(hovered || rating) >= star ? 'text-amber-400' : 'text-slate-200'}`}
                        onMouseEnter={() => setHovered(star)}
                        onClick={() => setRating(star)}
                        aria-label={`${star} star`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <textarea
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm resize-none placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                rows={2}
                placeholder={t('compare.rating.placeholder')}
                value={comment}
                onChange={e => setComment(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                disabled={!rating || status === 'loading'}
                className="mt-4 bg-accent hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-6 py-2.5 transition-colors"
            >
                {t('compare.rating.submit')}
            </button>
        </div>
    );
}
