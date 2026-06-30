// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductList from "../components/product/ProductList";
import CategoryFilter from "../components/ui/CategoryFilter";
import { getCategories } from "../api/categories.api"; 

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const selectedCategory = searchParams.get("category") || "all";
  const searchQuery = decodeURIComponent(searchParams.get("search") || "");

  // Obtén las categorías de la API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryFilter = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ── Header ────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Nuestros productos</h1>
        {(searchQuery || selectedCategory !== "all") && (
          <p className="text-sm text-gray-500">
            {searchQuery && `Resultados para "${searchQuery}"`}
            {searchQuery && selectedCategory !== "all" && " • "}
            {selectedCategory !== "all" && 
              `Categoría: ${categories.find(c => c.id === selectedCategory)?.name}`
            }
          </p>
        )}
      </div>

      {/* ── Filtro de categorías ──────────────────────── */}
      {categories.length > 0 && (
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onFilter={handleCategoryFilter}
          />
        </div>
      )}

      {/* ── Lista de productos ────────────────────────– */}
      <ProductList 
        searchQuery={searchQuery} 
        categoryId={selectedCategory !== "all" ? selectedCategory : null}
      />
    </div>
  );
}