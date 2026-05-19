import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function ProgrammeSelector({ value, onChange, otherProgrammeId, label }) {
    const { t } = useLanguage();
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        fetch('/api/universities/')
            .then(r => r.json())
            .then(data => setUniversities(data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!selectedUniversity || query.trim().length < 1) {
            setSuggestions([]);
            return;
        }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/programmes/?university=${selectedUniversity}&search=${encodeURIComponent(query)}`);
                const data = await res.json();
                const results = Array.isArray(data) ? data : (data.results || []);
                setSuggestions(results.filter(p => String(p.id) !== String(otherProgrammeId)));
            } catch {
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [query, selectedUniversity, otherProgrammeId]);

    function handleSelect(programme) {
        onChange(programme);
        setQuery(programme.name);
        setSuggestions([]);
    }

    function handleClear() {
        onChange(null);
        setQuery('');
        setSuggestions([]);
        setSelectedUniversity('');
    }

    return (
        <div className="bg-slate-800 rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">{label}</p>

            <div>
                <label className="block text-xs text-slate-400 mb-1">{t('compare.selector.universityLabel')}</label>
                <select
                    className="w-full bg-slate-700 text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedUniversity}
                    onChange={e => { setSelectedUniversity(e.target.value); onChange(null); setQuery(''); setSuggestions([]); }}
                >
                    <option value="">{t('compare.selector.universityLabel')}</option>
                    {universities.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
            </div>

            {selectedUniversity && (
                <div className="relative">
                    <input
                        type="text"
                        className="w-full bg-slate-700 text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                        placeholder={t('compare.selector.searchPlaceholder')}
                        value={query}
                        onChange={e => { setQuery(e.target.value); if (value) onChange(null); }}
                        disabled={!!value}
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-20 w-full mt-1 bg-slate-700 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                            {suggestions.map(p => (
                                <li
                                    key={p.id}
                                    className="px-4 py-2 text-sm text-slate-100 hover:bg-indigo-600 cursor-pointer"
                                    onClick={() => handleSelect(p)}
                                >
                                    {p.name}
                                    {p.award_level && <span className="ml-2 text-xs text-slate-400">({p.award_level})</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                    {!isSearching && query.trim().length >= 1 && suggestions.length === 0 && !value && (
                        <p className="mt-1 text-xs text-slate-400 px-1">{t('compare.selector.noResults')}</p>
                    )}
                </div>
            )}

            {value && (
                <div className="flex items-center justify-between bg-indigo-900/50 border border-indigo-500 rounded-xl px-3 py-2">
                    <div>
                        <p className="text-xs text-indigo-300 mb-0.5">{t('compare.selector.selected')}</p>
                        <p className="text-sm font-semibold text-slate-100">{value.name}</p>
                    </div>
                    <button
                        onClick={handleClear}
                        className="text-slate-400 hover:text-red-400 ml-3 text-lg leading-none"
                        aria-label="Clear selection"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}
