import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/useUserStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AssetType, PriceData } from '@/types/types';
import DashboardLayout from '../layout/DashboardLayout';

const INITIAL_PRICE_DATA: PriceData = {
  Au: { current: 1800, history: [] },
  Ag: { current: 25, history: [] }
};

export default function Dashboard() {
  const { user, addTransaction, updateBalance, updateAsset } = useUserStore();
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<AssetType>('Au');
  const [priceData, setPriceData] = useState<PriceData>(INITIAL_PRICE_DATA);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData(prevData => {
        const newData = { ...prevData };
        
        (Object.keys(newData) as AssetType[]).forEach(asset => {
          newData[asset].current += (Math.random() - 0.5) * (asset === 'Au' ? 10 : 0.5);
          newData[asset].history = [
            ...newData[asset].history,
            {
              time: new Date().toLocaleTimeString(),
              price: newData[asset].current
            }
          ].slice(-10);
        });
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleTransaction = async (type: 'buy' | 'sell') => {
    try {
      setLoading(true);
      const currentPrice = priceData[selectedAsset].current;
      const amountNum = parseFloat(amount);
      
      if (isNaN(amountNum) || amountNum <= 0) {
        alert('Veuillez entrer un montant valide');
        return;
      }

      const totalCost = currentPrice * amountNum;

      if (type === 'buy') {
        if (!user || user.balance < totalCost) {
          alert('Solde insuffisant');
          return;
        }
        updateBalance(-totalCost);
        updateAsset(selectedAsset, amountNum);
      } else {
        if (!user || (user.assets?.[selectedAsset] || 0) < amountNum) {
          alert('Quantité insuffisante');
          return;
        }
        updateBalance(totalCost);
        updateAsset(selectedAsset, -amountNum);
      }

      addTransaction({
        type,
        asset: selectedAsset,
        amount: amountNum,
        price: currentPrice
      });

      setAmount('');
      
    } catch (error) {
      console.error('Erreur lors de la transaction:', error);
      alert('Une erreur est survenue lors de la transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h2>
                <p className="text-gray-500">Gestion de vos investissements</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Solde disponible</p>
                <p className="text-2xl font-bold text-gray-900">{user?.balance.toFixed(2)} €</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card className="bg-white border">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Or (Au)</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {user?.assets?.Au.toFixed(2)} unités
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ≈ {((user?.assets?.Au || 0) * priceData.Au.current).toFixed(2)} €
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Argent (Ag)</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {user?.assets?.Ag.toFixed(2)} unités
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ≈ {((user?.assets?.Ag || 0) * priceData.Ag.current).toFixed(2)} €
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Prix en temps réel</h3>
                    <div className="text-sm text-gray-500">
                      Actualisé toutes les 2 secondes
                    </div>
                  </div>
                  <LineChart width={400} height={300} data={priceData[selectedAsset].history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#000000"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionner un actif
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      value={selectedAsset}
                      onChange={(e) => setSelectedAsset(e.target.value as AssetType)}
                      disabled={loading}
                    >
                      <option value="Au">Or (Au)</option>
                      <option value="Ag">Argent (Ag)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité de {selectedAsset}
                    </label>
                    <Input
                      type="number"
                      placeholder="Quantité"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => handleTransaction('buy')}
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? 'Transaction...' : 'Acheter'}
                    </Button>
                    <Button 
                      onClick={() => handleTransaction('sell')}
                      variant="outline"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? 'Transaction...' : 'Vendre'}
                    </Button>
                  </div>
                  <Card className="border">
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Prix actuel</h4>
                      <p className="text-2xl font-bold text-gray-900">
                        {priceData[selectedAsset].current.toFixed(2)} €
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Vous possédez: {user?.assets?.[selectedAsset].toFixed(2)} {selectedAsset}</p>
                        <p>Valeur: {((user?.assets?.[selectedAsset] || 0) * priceData[selectedAsset].current).toFixed(2)} €</p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}