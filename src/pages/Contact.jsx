import { useState } from 'react';
import { Send, Phone, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch('/api/analytics/inquiry/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setFormData({ full_name: '', email: '', phone: '', message: '' });
            } else {
                setStatus('error');
                setErrorMsg(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setErrorMsg('Unable to reach the server. Please check your connection.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            
            <main className="flex-1 container mx-auto px-6 py-12 md:py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Info Column */}
                        <div>
                            <h1 className="text-4xl font-bold text-primary mb-6">{t('contact.title')}</h1>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                {t('contact.subtitle')}
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{t('contact.info.guidance')}</h3>
                                        <p className="text-sm text-slate-500">{t('contact.info.guidanceSub')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{t('contact.info.tcu')}</h3>
                                        <p className="text-sm text-slate-500">{t('contact.info.tcuSub')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 md:p-10 border border-slate-100">
                            {status === 'success' ? (
                                <div className="text-center py-12 animate-fade-in">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={32} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('contact.success.title')}</h2>
                                    <p className="text-slate-500 mb-8">{t('contact.success.sub')}</p>
                                    <button 
                                        onClick={() => setStatus(null)}
                                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        {t('contact.btn.another')}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">{t('contact.form.name')} *</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder={t('contact.form.placeholderName')}
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">{t('contact.form.phone')}</label>
                                            <input 
                                                type="tel" 
                                                placeholder="+255..."
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">{t('contact.form.email')}</label>
                                        <input 
                                            type="email" 
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">{t('contact.form.message')} *</label>
                                        <textarea 
                                            required
                                            rows={4}
                                            placeholder={t('contact.form.placeholderMessage')}
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm resize-none"
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
                                            {errorMsg}
                                        </div>
                                    )}

                                    <button 
                                        disabled={status === 'loading'}
                                        type="submit"
                                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-dark shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {status === 'loading' ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>{t('contact.btn.send')}</span>
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
