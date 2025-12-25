import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/services';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productApi.getAll(search);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search Bar */}
            <div className="mb-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            onClick={fetchProducts}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
                        >
                            🔍 Rechercher
                        </button>
                    </div>
                </div>
            </div>

            {/* Page Title */}
            <h2 className="text-3xl font-bold text-center mb-8">
                {search ? `Résultats pour "${search}"` : 'Tous les Produits'}
            </h2>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-12">Chargement...</div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                            <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <span className="text-6xl">📦</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-2xl font-bold text-primary">{product.price} €</span>
                                    <span className={`px-3 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.stock > 0 ? `✓ Stock: ${product.stock}` : '✗ Rupture'}
                                    </span>
                                </div>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="block w-full bg-primary text-white text-center py-2 rounded-lg hover:bg-primary-dark transition"
                                >
                                    👁️ Voir détails
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Aucun produit trouvé.</p>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="mt-4 text-primary hover:underline"
                        >
                            Voir tous les produits
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
