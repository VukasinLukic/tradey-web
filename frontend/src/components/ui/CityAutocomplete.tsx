import { useState, useRef, useEffect } from 'react';
import { SERBIAN_CITIES } from '../../data/serbianCities';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function CityAutocomplete({
  value,
  onChange,
  error,
  required = false,
  placeholder = 'Start typing city name...',
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter cities based on input
  useEffect(() => {
    if (value.length > 0) {
      const filtered = SERBIAN_CITIES.filter((city) =>
        city.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 10); // Show max 10 suggestions
      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleSelectCity = (city: string) => {
    onChange(city);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredCities.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectCity(filteredCities[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value.length > 0 && filteredCities.length > 0) {
            setIsOpen(true);
          }
        }}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full px-4 py-3 bg-tradey-white border-2 text-tradey-black text-base font-sans placeholder-tradey-black/40 focus:outline-none transition-all ${
          error
            ? 'border-tradey-red focus:border-tradey-red'
            : 'border-tradey-black/20 focus:border-tradey-red'
        }`}
      />

      {/* Dropdown */}
      {isOpen && filteredCities.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border-2 border-tradey-black/20 shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredCities.map((city, index) => (
            <button
              key={city}
              type="button"
              onClick={() => handleSelectCity(city)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full text-left px-4 py-3 font-sans text-sm transition-colors ${
                index === highlightedIndex
                  ? 'bg-tradey-red text-white'
                  : 'bg-white text-tradey-black hover:bg-tradey-red/10'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-tradey-red font-sans">{error}</p>
      )}
    </div>
  );
}
