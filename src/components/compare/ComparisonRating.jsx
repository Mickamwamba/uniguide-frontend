import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getTelemetrySessionId, trackTelemetry } from '../../utils/telemetry';

export default function ComparisonRating({ programmeAId, programmeBId }) {
    const { t } = useLanguage();
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

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
            <div className="bg-slate-800 rounded-2xl p-5 text-center">
                <p className="text-emerald-400 font-semibold">{t('compare.rating.thanks')}</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-sm font-semibold text-slate-300">{t('compare.rating.title')}</p>

            <div className="flex gap-2" onMouseLeave={() => setHovered(0)}>
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        className={`text-2xl transition-colors ${(hovered || rating) >= star ? 'text-amber-400' : 'text-slate-600'}`}
                        onMouseEnter={() => setHovered(star)}
                        onClick={() => setRating(star)}
                        aria-label={`${star} star`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <textarea
                className="w-full bg-slate-700 text-slate-100 rounded-xl px-3 py-2 text-sm resize-none placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
                placeholder={t('compare.rating.placeholder')}
                value={comment}
                onChange={e => setComment(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                disabled={!rating || status === 'loading'}
                className="self-start bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-5 py-2 transition-colors"
            >
                {t('compare.rating.submit')}
            </button>
        </div>
    );
}
