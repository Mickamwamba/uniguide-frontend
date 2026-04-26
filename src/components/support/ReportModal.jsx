import { useState } from 'react';
import { X, Flag, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ReportModal = ({ isOpen, onClose, entityUrl }) => {
    const { t } = useLanguage();
    const [reportType, setReportType] = useState('INACCURATE');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/analytics/report/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    report_type: reportType,
                    description,
                    url: entityUrl || window.location.href,
                    contact_email: email
                })
            });

            if (!res.ok) throw new Error("Failed to submit report");
            setIsSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                            <Flag size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{t('report.modalTitle')}</h3>
                            <p className="text-xs text-slate-500">{t('report.modalSub')}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="font-bold text-xl text-slate-900 mb-2">{t('report.successTitle')}</h4>
                            <p className="text-slate-600 mb-8">{t('report.successMsg')}</p>
                            <button 
                                onClick={onClose}
                                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                            >
                                {t('report.close')}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('report.typeLabel')}
                                </label>
                                <select 
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                                >
                                    <option value="INACCURATE">{t('report.typeInaccurate')}</option>
                                    <option value="BROKEN_LINK">{t('report.typeBroken')}</option>
                                    <option value="OTHER">{t('report.typeOther')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('report.descLabel')}
                                </label>
                                <textarea 
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={t('report.descPlaceholder')}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('report.emailLabel')}
                                </label>
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('report.emailPlaceholder')}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        {t('report.submitting')}
                                    </>
                                ) : (
                                    t('report.submit')
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
