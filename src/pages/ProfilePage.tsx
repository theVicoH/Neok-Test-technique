// src/pages/ProfilePage.tsx
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useUserStore } from '@/stores/useUserStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedTransactions = [...(user?.transactions || [])].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const calculateTotalValue = () => {
    if (!user) return 0;
    const assetValues = Object.entries(user.assets).map(([asset, quantity]) => {
      const price = asset === 'Au' ? 1800 : 25;
      return quantity * price;
    });
    return assetValues.reduce((a, b) => a + b, 0) + user.balance;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Profil Investisseur</h2>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
                <div className="grid gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-medium">
                      {user?.profile?.firstName} {user?.profile?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.profile?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Niveau d'expérience</p>
                    <p className="font-medium capitalize">{user?.profile?.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profil de risque</p>
                    <p className="font-medium capitalize">{user?.profile?.riskProfile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membre depuis</p>
                    <p className="font-medium">
                      {user?.profile?.createdAt ? formatDate(user.profile.createdAt) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Résumé du portefeuille</h3>
              <div className="grid gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500">Valeur totale du portefeuille</p>
                    <p className="text-2xl font-bold">{calculateTotalValue().toFixed(2)} €</p>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Or (Au)</p>
                      <p className="text-xl font-bold">{user?.assets.Au.toFixed(2)} unités</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Argent (Ag)</p>
                      <p className="text-xl font-bold">{user?.assets.Ag.toFixed(2)} unités</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historique des transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-2xl font-bold">Historique des transactions</h2>
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {sortOrder === 'desc' ? '⬇️ Plus récent' : '⬆️ Plus ancien'}
            </button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actif</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <span className={
                        transaction.type === 'buy' 
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }>
                        {transaction.type === 'buy' ? 'Achat' : 'Vente'}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.asset}</TableCell>
                    <TableCell className="text-right">{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{transaction.price.toFixed(2)} €</TableCell>
                    <TableCell className="text-right font-medium">
                      {(transaction.amount * transaction.price).toFixed(2)} €
                    </TableCell>
                  </TableRow>
                ))}
                {sortedTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      Aucune transaction pour le moment
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}