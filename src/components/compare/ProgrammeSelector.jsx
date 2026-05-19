import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
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
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
            <p className="text-xs font-semibold text-accent uppercase tracking-wider">{label}</p>

            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    {t('compare.selector.universityLabel')}
                </label>
                <div className="relative">
                    <select
                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent pr-9"
                        value={selectedUniversity}
                        onChange={e => { setSelectedUniversity(e.target.value); onChange(null); setQuery(''); setSuggestions([]); }}
                    >
                        <option value="">{t('compare.selector.universityLabel')}</option>
                        {universities.map(u => (
                            <option key={u.id} value={u.id}>{u.name}{u.short_name ? ` (${u.short_name})` : ''}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {selectedUniversity && (
                <div className="relative">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        {t('compare.selector.searchPlaceholder')}
                    </label>
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent placeholder-slate-400 disabled:opacity-60"
                            placeholder={t('compare.selector.searchPlaceholder')}
                            value={query}
                            onChange={e => { setQuery(e.target.value); if (value) onChange(null); }}
                            disabled={!!value}
                        />
                    </div>
                    {suggestions.length > 0 && (
                        <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                            {suggestions.map(p => (
                                <li
                                    key={p.id}
                                    className="px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-accent cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                                    onClick={() => handleSelect(p)}
                                >
                                    {p.name}
                                    {p.award_level && <span className="ml-2 text-xs text-slate-400">({p.award_level})</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                    {!isSearching && query.trim().length >= 1 && suggestions.length === 0 && !value && (
                        <p className="mt-1.5 text-xs text-slate-400 px-1">{t('compare.selector.noResults')}</p>
                    )}
                </div>
            )}

            {value && (
                <div className="flex items-start justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
                    <div>
                        <p className="text-xs text-indigo-500 font-medium mb-0.5">{t('compare.selector.selected')}</p>
                        <p className="text-sm font-semibold text-slate-800">{value.name}</p>
                        {value.award_level && <p className="text-xs text-slate-500 mt-0.5">{value.award_level}</p>}
                    </div>
                    <button
                        onClick={handleClear}
                        className="text-slate-400 hover:text-red-500 ml-3 mt-0.5 transition-colors"
                        aria-label="Clear selection"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
