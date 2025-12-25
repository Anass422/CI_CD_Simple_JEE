import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/services';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productApi.getAll();
                setProducts(data.slice(0, 6)); // Show only 6 products on home
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">🛒 Bienvenue sur E-Commerce</h1>
                    <p className="text-xl mb-8">Découvrez nos produits avec une architecture microservices moderne</p>
                    <Link
                        to="/products"
                        className="bg-white text-primary px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block"
                    >
                        🔍 Explorer les produits
                    </Link>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">
                    ⭐ Produits Disponibles
                </h2>

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
                                    <p className="text-gray-600 mb-4">{product.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-primary">{product.price} €</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.stock > 0 ? '✓ En stock' : '✗ Rupture'}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="mt-4 block w-full bg-primary text-white text-center py-2 rounded-lg hover:bg-primary-dark transition"
                                    >
                                        👁️ Voir détails
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">Aucun produit disponible</div>
                )}

                {products.length > 0 && (
                    <div className="text-center mt-8">
                        <Link to="/products" className="text-primary font-bold hover:underline">
                            Voir tous les produits →
                        </Link>
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white rounded-xl shadow">
                            <div className="text-5xl mb-4">🛡️</div>
                            <h3 className="text-xl font-bold mb-2">Sécurisé</h3>
                            <p className="text-gray-600">Authentification JWT et cryptage BCrypt</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow">
                            <div className="text-5xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold mb-2">Rapide</h3>
                            <p className="text-gray-600">Architecture microservices performante</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow">
                            <div className="text-5xl mb-4">☁️</div>
                            <h3 className="text-xl font-bold mb-2">Moderne</h3>
                            <p className="text-gray-600">Spring Cloud & React 18</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
