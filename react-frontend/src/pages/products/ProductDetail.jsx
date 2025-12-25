import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, cartApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await productApi.getById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setAddingToCart(true);
        setMessage({ type: '', text: '' });

        try {
            await cartApi.addItem({
                userId: user.userId,
                productId: product.id,
                quantity: quantity,
            });
            setMessage({ type: 'success', text: `${product.name} ajouté au panier !` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de l\'ajout au panier' });
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
    }

    if (!product) {
        return <div className="container mx-auto px-4 py-12 text-center">Produit non trouvé</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                        {/* Product Image */}
                        <div className="md:w-1/2 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-12">
                            <span className="text-9xl">📦</span>
                        </div>

                        {/* Product Info */}
                        <div className="md:w-1/2 p-8">
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-gray-600 mb-6">{product.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-primary">{product.price} €</span>
                            </div>

                            <div className="mb-6">
                                <span className={`px-4 py-2 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.stock > 0 ? `✓ En stock (${product.stock} disponibles)` : '✗ Rupture de stock'}
                                </span>
                            </div>

                            {message.text && (
                                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {message.text}
                                </div>
                            )}

                            {product.stock > 0 && (
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-medium mb-2">Quantité</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || addingToCart}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addingToCart ? 'Ajout en cours...' : product.stock > 0 ? '🛒 Ajouter au panier' : 'Produit indisponible'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
