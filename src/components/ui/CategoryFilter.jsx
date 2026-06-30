// frontend/src/components/CategoryFilter.jsx
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CategoryFilter({ categories, onFilter, selectedCategory }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (category) => {
    onFilter(category);
    setOpen(false);
  };

  const selectedLabel = selectedCategory === "all" 
    ? "Todas las categorías" 
    : categories.find(c => c.id === selectedCategory)?.name || "Filtrar";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl
                   text-sm font-medium text-gray-700 hover:bg-gray-50
                   transition-colors"
      >
        {selectedLabel}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg min-w-48">
            <button
              onClick={() => handleSelect("all")}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors rounded-t-xl
                ${selectedCategory === "all" 
                  ? "bg-indigo-50 text-indigo-700 font-medium" 
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              Todas las categorías
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelect(category.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-t border-gray-100 last:rounded-b-xl
                  ${selectedCategory === category.id 
                    ? "bg-indigo-50 text-indigo-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}