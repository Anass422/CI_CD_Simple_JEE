import { useEffect, useState } from 'react';
import { userApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const data = await userApi.getUser(authUser.username);
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
    }

    if (!user) {
        return <div className="container mx-auto px-4 py-12 text-center">Utilisateur non trouvé</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">👤</div>
                        <h1 className="text-3xl font-bold">Mon Profil</h1>
                    </div>

                    <div className="space-y-4">
                        <div className="border-b pb-4">
                            <p className="text-gray-600 text-sm">Nom d'utilisateur</p>
                            <p className="font-bold text-lg">{user.username}</p>
                        </div>

                        <div className="border-b pb-4">
                            <p className="text-gray-600 text-sm">Email</p>
                            <p className="font-bold text-lg">{user.email}</p>
                        </div>

                        <div className="border-b pb-4">
                            <p className="text-gray-600 text-sm">Nom complet</p>
                            <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
                        </div>

                        <div className="border-b pb-4">
                            <p className="text-gray-600 text-sm">Rôle</p>
                            <span className="inline-block px-3 py-1 bg-primary text-white rounded-full font-bold">
                                {user.role}
                            </span>
                        </div>

                        <div>
                            <p className="text-gray-600 text-sm">Statut du compte</p>
                            <span className={`inline-block px-3 py-1 rounded-full font-bold ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.enabled ? '✓ Activé' : '✗ Désactivé'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
