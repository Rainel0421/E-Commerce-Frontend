
import { Search, X } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Buscar productos..." }) {
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setQuery("");
    onSearch(""); // ✅ Siempre dispara aunque esté vacío
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1"> {/* ✅ Quitado mx-4: el padre controla el espaciado */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full text-sm border border-gray-200 rounded-xl pl-10 pr-10 py-2.5
                     placeholder:text-gray-300
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400
                     transition"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}