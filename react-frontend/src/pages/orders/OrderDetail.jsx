import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../../api/services';

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const data = await orderApi.getOrder(id);
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
    }

    if (!order) {
        return <div className="container mx-auto px-4 py-12 text-center">Commande non trouvée</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/orders" className="text-primary hover:underline mb-4 inline-block">
                ← Retour aux commandes
            </Link>

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Commande #{order.id}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <p className="text-gray-600">Date de commande</p>
                        <p className="font-bold">{new Date(order.orderDate).toLocaleString('fr-FR')}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Statut</p>
                        <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full font-bold">
                            {order.status}
                        </span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4">Articles commandés</h2>
                <div className="space-y-4 mb-8">
                    {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">📦</div>
                                <div>
                                    <h3 className="font-bold">{item.productName}</h3>
                                    <p className="text-gray-600">Quantité: {item.quantity}</p>
                                    <p className="text-gray-600">Prix unitaire: {item.unitPrice} €</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary">{item.subtotal} €</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-2xl font-bold">
                        <span>Total</span>
                        <span className="text-primary">{order.totalAmount} €</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
