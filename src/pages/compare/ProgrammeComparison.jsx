import { useState, useEffect, useRef } from 'react';
import { Loader2, RotateCcw } from 'lucide-react';
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
    const [elapsed, setElapsed] = useState(0);
    const [error, setError] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isLoading) {
            setElapsed(0);
            timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isLoading]);

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
                setError(data.error || t('compare.error.rateLimit'));
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

    const resultsLoaded = !!comparison && !isLoading;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* Page header — hidden once results load to save space */}
            {!resultsLoaded && (
                <div className="bg-slate-900 text-white py-12">
                    <div className="container mx-auto px-6">
                        <h1 className="text-3xl font-bold">{t('compare.title')}</h1>
                        <p className="mt-2 text-slate-400 text-base">{t('compare.subtitle')}</p>
                    </div>
                </div>
            )}

            {/* Sticky identity bar — appears once results are loaded */}
            {resultsLoaded && (
                <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
                    <div className="container mx-auto px-6 py-3 flex items-center gap-3">
                        {/* Programme A */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                            <span className="text-sm font-semibold text-slate-800 truncate">{programmeA?.name}</span>
                        </div>

                        <span className="text-slate-300 font-bold text-xs shrink-0">VS</span>

                        {/* Programme B */}
                        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                            <span className="text-sm font-semibold text-slate-800 truncate text-right">{programmeB?.name}</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        </div>

                        {/* Reset */}
                        <button
                            onClick={handleReset}
                            className="ml-3 shrink-0 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition-colors"
                        >
                            <RotateCcw size={12} />
                            New comparison
                        </button>
                    </div>
                </div>
            )}

            <main className="flex-1 container mx-auto px-6 py-10 flex flex-col gap-8">

                {/* Selectors + compare button — hidden once results load */}
                {!resultsLoaded && (
                    <>
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

                        <div className="flex justify-center">
                            <button
                                onClick={handleCompare}
                                disabled={!canCompare || isLoading}
                                className="inline-flex items-center gap-2 bg-accent hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-10 py-3 transition-colors text-base"
                            >
                                {isLoading && <Loader2 size={18} className="animate-spin" />}
                                {isLoading ? t('compare.loading') : t('compare.btn.compare')}
                            </button>
                        </div>

                        {isLoading && (
                            <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                                <div className="flex justify-center mb-5">
                                    <div className="relative w-14 h-14">
                                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                            <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                            <circle
                                                cx="28" cy="28" r="24" fill="none"
                                                stroke="#6366f1" strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeDasharray={`${Math.min(elapsed / 20 * 150, 145)} 150`}
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-700">{elapsed}s</span>
                                    </div>
                                </div>
                                <p className="text-base font-semibold text-slate-800 mb-1">Analysing both programmes…</p>
                                <p className="text-sm text-slate-500">
                                    {elapsed < 5
                                        ? 'Retrieving programme data'
                                        : elapsed < 12
                                        ? 'AI is comparing course content'
                                        : elapsed < 18
                                        ? 'Generating insights and recommendations'
                                        : 'Almost ready — finalising the comparison'}
                                </p>
                                <p className="mt-4 text-xs text-slate-400">This usually takes 10–20 seconds</p>
                            </div>
                        )}
                    </>
                )}

                {error && (
                    <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700 text-center">
                        {error}
                    </div>
                )}

                {comparison && (
                    <ComparisonResult result={comparison} />
                )}
            </main>

            <Footer />
        </div>
    );
}
