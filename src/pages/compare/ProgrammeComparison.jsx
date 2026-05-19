import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, RotateCcw, ArrowLeftRight, Share2, Check } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProgrammeSelector from '../../components/compare/ProgrammeSelector';
import ComparisonResult from '../../components/compare/ComparisonResult';
import { useLanguage } from '../../context/LanguageContext';
import { getTelemetrySessionId, trackTelemetry } from '../../utils/telemetry';

export default function ProgrammeComparison() {
    const { t } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const [programmeA, setProgrammeA] = useState(null);
    const [programmeB, setProgrammeB] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);

    // Auto-trigger comparison if ?a= and ?b= are in URL
    useEffect(() => {
        const aId = searchParams.get('a');
        const bId = searchParams.get('b');
        if (aId && bId && !comparison && !isLoading) {
            triggerCompareById(aId, bId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    const resultsLoaded = !!comparison && !isLoading;

    async function triggerCompareById(aId, bId) {
        setIsLoading(true);
        setError(null);
        const sessionId = getTelemetrySessionId();
        try {
            const res = await fetch('/api/programmes/compare/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ programme_a_id: aId, programme_b_id: bId, session_id: sessionId })
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || t('compare.error.rateLimit')); return; }
            setComparison(data);
            trackTelemetry('comparison', {
                programme_a_id: aId,
                programme_b_id: bId,
                same_university: data.programme_a?.university === data.programme_b?.university
            });
        } catch {
            setError(t('compare.error.rateLimit'));
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCompare() {
        if (!canCompare) return;
        setSearchParams({ a: programmeA.id, b: programmeB.id });
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
            if (!res.ok) { setError(data.error || t('compare.error.rateLimit')); return; }
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

    function handleSwap() {
        setProgrammeA(programmeB);
        setProgrammeB(programmeA);
    }

    function handleReset() {
        setProgrammeA(null);
        setProgrammeB(null);
        setComparison(null);
        setError(null);
        setSearchParams({});
    }

    function handleShare() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* Page header — hidden once results load */}
            {!resultsLoaded && !isLoading && (
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
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                            <span className="text-sm font-semibold text-slate-800 truncate">{programmeA?.name || comparison?.programme_a?.name}</span>
                        </div>

                        <span className="text-slate-300 font-bold text-xs shrink-0">VS</span>

                        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                            <span className="text-sm font-semibold text-slate-800 truncate text-right">{programmeB?.name || comparison?.programme_b?.name}</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        </div>

                        <div className="ml-3 shrink-0 flex items-center gap-1.5">
                            {/* Share button */}
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition-colors"
                            >
                                {copied ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
                                {copied ? 'Copied!' : 'Share'}
                            </button>

                            {/* Reset button */}
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition-colors"
                            >
                                <RotateCcw size={12} />
                                New
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 container mx-auto px-6 py-10 flex flex-col gap-8">

                {/* Selectors + compare button — hidden once results load */}
                {!resultsLoaded && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                            <ProgrammeSelector
                                label="Programme A"
                                value={programmeA}
                                onChange={setProgrammeA}
                                otherProgrammeId={programmeB?.id}
                            />

                            {/* Swap button — only shown when both are selected */}
                            {programmeA && programmeB && !isLoading && (
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:flex">
                                    <button
                                        onClick={handleSwap}
                                        title="Swap programmes"
                                        className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-accent hover:border-accent transition-colors"
                                    >
                                        <ArrowLeftRight size={15} />
                                    </button>
                                </div>
                            )}

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
                    <ComparisonResult result={comparison} onNewComparison={handleReset} />
                )}
            </main>

            <Footer />
        </div>
    );
}
