import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderApi.getUserOrders(user.userId);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">📦 Mes Commandes</h1>

            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Commande #{order.id}</h3>
                                    <p className="text-gray-600">
                                        📅 {new Date(order.orderDate).toLocaleString('fr-FR')}
                                    </p>
                                    <span className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-800 rounded-full font-bold">
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary mb-4">{order.totalAmount} €</p>
                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
                                    >
                                        👁️ Détails
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h2 className="text-2xl font-bold mb-4">Aucune commande</h2>
                    <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande</p>
                    <Link
                        to="/products"
                        className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
                    >
                        🛍️ Découvrir nos produits
                    </Link>
                </div>
            )}
        </div>
    );
}
