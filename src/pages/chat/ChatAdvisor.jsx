import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Send, Loader2, Sparkles, User, Bot } from 'lucide-react';

const ChatAdvisor = () => {
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hi! I am your UniGuide AI Advisor. Ask me anything about universities and courses in Tanzania. 🇹🇿' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const apiHistory = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const response = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.text,
                    history: apiHistory
                })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            const botMsg = { role: 'model', text: data.response };

            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl flex flex-col">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex-1 flex flex-col overflow-hidden min-h-[600px]">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl">UniGuide Student Advisor</h1>
                            <p className="text-slate-400 text-sm">Your personal AI academic counselor</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-white border border-slate-200 text-slate-600' : 'bg-indigo-600 text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>

                                <div className={`p-4 md:p-6 rounded-3xl text-sm md:text-base leading-relaxed max-w-[85%] shadow-sm ${msg.role === 'user'
                                    ? 'bg-slate-900 text-white rounded-br-none'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                    }`}>
                                    <div className={`prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 ${msg.role === 'user'
                                            ? 'prose-invert'
                                            : 'prose-slate prose-p:text-slate-800 prose-headings:text-slate-900 prose-strong:text-slate-900 prose-ul:text-slate-800'
                                        }`}>
                                        <ReactMarkdown
                                            components={{
                                                a: ({ node, ...props }) => <a {...props} className="text-indigo-500 hover:underline" target="_blank" rel="noopener noreferrer" />
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                    <Loader2 size={20} className="animate-spin" />
                                </div>
                                <div className="p-4 bg-white border border-slate-100 rounded-3xl rounded-bl-none shadow-sm text-slate-500 italic">
                                    Analyzing academic database...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-white border-t border-slate-100">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex gap-4 max-w-4xl mx-auto"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about specific universities, courses, or request advice..."
                                className="flex-1 bg-slate-100 border-0 rounded-2xl px-6 py-4 text-base focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="bg-indigo-600 text-white px-8 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 font-semibold flex items-center gap-2"
                            >
                                <Send size={20} />
                                <span className="hidden md:inline">Send</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChatAdvisor;
