import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProgrammeSelector from '../../components/compare/ProgrammeSelector';
import ComparisonResult from '../../components/compare/ComparisonResult';
import { useLanguage } from '../../context/LanguageContext';
import { getTelemetrySessionId, trackTelemetry } from '../../utils/telemetry';

export default function ProgrammeComparison() {
    const { t } = useLanguage();
    const [programmeA, setProgrammeA] = useState(null);
    const [programmeB, setProgrammeB] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sameSelected = programmeA && programmeB && String(programmeA.id) === String(programmeB.id);
    const canCompare = programmeA && programmeB && !sameSelected;

    async function handleCompare() {
        if (!canCompare) return;
        setIsLoading(true);
        setError(null);
        const sessionId = getTelemetrySessionId();
        try {
            const res = await fetch('/api/programmes/compare/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    programme_a_id: programmeA.id,
                    programme_b_id: programmeB.id,
                    session_id: sessionId
                })
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 429) {
                    setError(t('compare.error.rateLimit'));
                } else {
                    setError(data.error || t('compare.error.rateLimit'));
                }
                return;
            }
            setComparison(data);
            trackTelemetry('comparison', {
                programme_a_id: programmeA.id,
                programme_b_id: programmeB.id,
                same_university: data.programme_a?.university === data.programme_b?.university
            });
        } catch {
            setError(t('compare.error.rateLimit'));
        } finally {
            setIsLoading(false);
        }
    }

    function handleReset() {
        setProgrammeA(null);
        setProgrammeB(null);
        setComparison(null);
        setError(null);
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-100">{t('compare.title')}</h1>
                    <p className="mt-2 text-slate-400">{t('compare.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ProgrammeSelector
                        label="Programme A"
                        value={programmeA}
                        onChange={setProgrammeA}
                        otherProgrammeId={programmeB?.id}
                    />
                    <ProgrammeSelector
                        label="Programme B"
                        value={programmeB}
                        onChange={setProgrammeB}
                        otherProgrammeId={programmeA?.id}
                    />
                </div>

                {sameSelected && (
                    <p className="text-center text-sm text-amber-400">{t('compare.error.same')}</p>
                )}

                <div className="flex justify-center gap-3">
                    <button
                        onClick={handleCompare}
                        disabled={!canCompare || isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl px-8 py-3 transition-colors"
                    >
                        {isLoading ? t('compare.loading') : t('compare.btn.compare')}
                    </button>
                    {(programmeA || programmeB || comparison) && (
                        <button
                            onClick={handleReset}
                            className="border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-slate-100 font-semibold rounded-2xl px-6 py-3 transition-colors"
                        >
                            {t('compare.btn.reset')}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="max-w-xl mx-auto bg-red-900/30 border border-red-500/50 rounded-2xl px-5 py-3 text-sm text-red-300 text-center">
                        {error}
                    </div>
                )}

                {comparison && (
                    <section className="mt-4">
                        <ComparisonResult result={comparison} />
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
