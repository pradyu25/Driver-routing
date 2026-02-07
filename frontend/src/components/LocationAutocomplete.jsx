
import React, { useState, useEffect, useRef } from 'react';
import { searchLocations } from '../api/api';
import { Search, MapPin, Loader2 } from 'lucide-react';

const LocationAutocomplete = ({ label, value, onChange, placeholder, icon: Icon }) => {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (text) => {
        setQuery(text);
        onChange(text);
        if (text.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const results = await searchLocations(text);
            setSuggestions(results);
            setShowSuggestions(true);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (suggestion) => {
        setQuery(suggestion.label);
        onChange(suggestion.label);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                {Icon && <Icon className="w-4 h-4 mr-2 text-slate-400" />}
                {label}
            </label>
            <div className="relative group">
                <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-white/50 backdrop-blur-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all duration-300 shadow-sm group-hover:border-slate-200"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => query.length >= 3 && setShowSuggestions(true)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    {loading ? (
                        <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                    ) : (
                        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    )}
                </div>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-[100] w-full mt-2 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            className="w-full flex items-start p-4 hover:bg-brand-50 transition-colors text-left border-b border-slate-50 last:border-0 group/item"
                            onClick={() => handleSelect(s)}
                        >
                            <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5 group-hover/item:text-brand-500 transition-colors shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-slate-900 mb-0.5">{s.label.split(',')[0]}</p>
                                <p className="text-xs font-medium text-slate-500 truncate">{s.label.split(',').slice(1).join(',').trim()}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationAutocomplete;
