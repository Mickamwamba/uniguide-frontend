import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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
                setError(res.status === 429 ? t('compare.error.rateLimit') : (data.error || t('compare.error.rateLimit')));
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
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* Page header */}
            <div className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-bold">{t('compare.title')}</h1>
                    <p className="mt-2 text-slate-400 text-base">{t('compare.subtitle')}</p>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-6 py-10 flex flex-col gap-8">

                {/* Selectors */}
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
                    <p className="text-center text-sm text-amber-600 font-medium">{t('compare.error.same')}</p>
                )}

                <div className="flex justify-center gap-3">
                    <button
                        onClick={handleCompare}
                        disabled={!canCompare || isLoading}
                        className="inline-flex items-center gap-2 bg-accent hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-8 py-3 transition-colors text-base"
                    >
                        {isLoading && <Loader2 size={18} className="animate-spin" />}
                        {isLoading ? t('compare.loading') : t('compare.btn.compare')}
                    </button>
                    {(programmeA || programmeB || comparison) && (
                        <button
                            onClick={handleReset}
                            className="border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 font-medium rounded-xl px-6 py-3 transition-colors text-base"
                        >
                            {t('compare.btn.reset')}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700 text-center">
                        {error}
                    </div>
                )}

                {comparison && (
                    <section>
                        <ComparisonResult result={comparison} />
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
