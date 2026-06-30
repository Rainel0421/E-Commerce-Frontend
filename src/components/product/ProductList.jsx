// frontend/src/components/product/ProductList.jsx
import { useState, useEffect } from "react";
import { getProducts } from "../../api/products.api";
import ProductCard from "./ProductCard";

export default function ProductList({ searchQuery = "", categoryId = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        
        // ✅ Solo incluye parámetros si tienen valor
        const filters = {};
        
        if (searchQuery && searchQuery.trim()) {
          filters.search = searchQuery.trim();
        }
        
        if (categoryId && categoryId !== "all") {
          filters.category = categoryId;
        }

        
        const data = await getProducts(filters);
        
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("❌ Error:", err);
        if (isMounted) setError("No se pudieron cargar los productos.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, categoryId]);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {searchQuery || categoryId 
          ? "No hay productos que coincidan con tu búsqueda"
          : "No hay productos disponibles."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}