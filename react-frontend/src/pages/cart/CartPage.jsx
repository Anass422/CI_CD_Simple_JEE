import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartApi, orderApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [isAuthenticated, user]);

    const fetchCart = async () => {
        if (!user?.userId) return;

        try {
            const data = await cartApi.getCart(user.userId);
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await cartApi.removeItem(itemId);
            setMessage({ type: 'success', text: 'Article retiré du panier' });
            fetchCart();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Voulez-vous vraiment vider le panier ?')) return;

        try {
            await cartApi.clearCart(user.userId);
            setMessage({ type: 'success', text: 'Panier vidé' });
            fetchCart();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors du vidage du panier' });
        }
    };

    const handleCheckout = async () => {
        try {
            await orderApi.createOrder(user.userId);
            setMessage({ type: 'success', text: 'Commande créée avec succès !' });
            setTimeout(() => navigate('/orders'), 2000);
        } catch (error) {
            console.error('Checkout error:', error);
            // Extract error message from response
            const errorMessage = error.response?.data?.message ||
                error.response?.data ||
                'Erreur lors de la création de la commande';
            setMessage({ type: 'error', text: errorMessage });
        }
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2);
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">🛒 Mon Panier</h1>

            {message.text && (
                <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {cart && cart.items && cart.items.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                                <div className="text-4xl">📦</div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{item.productName}</h3>
                                    <p className="text-gray-600">ID: {item.productId}</p>
                                    <p className="text-gray-600">Quantité: {item.quantity}</p>
                                    <p className="font-bold text-primary">{item.unitPrice} €</p>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow sticky top-4">
                            <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
                            <hr className="mb-4" />
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Nombre d'articles:</span>
                                    <strong>{cart.items.length}</strong>
                                </div>
                                <div className="flex justify-between text-xl">
                                    <span>Total:</span>
                                    <strong className="text-primary">{calculateTotal()} €</strong>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-bold hover:opacity-90 transition mb-2"
                            >
                                💳 Passer la commande
                            </button>
                            <button
                                onClick={handleClearCart}
                                className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition"
                            >
                                🗑️ Vider le panier
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
                    <p className="text-gray-600 mb-6">Ajoutez des produits pour commencer vos achats</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
                    >
                        🛍️ Voir les produits
                    </button>
                </div>
            )}
        </div>
    );
}
