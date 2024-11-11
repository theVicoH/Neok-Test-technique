import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/useUserStore';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Veuillez entrer un nom d\'utilisateur');
      return;
    }
    login(username);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-2xl font-bold tracking-tight mb-2">
          Plateforme d'investissement
        </h1>
        <h2 className="text-center text-gray-600 mb-8">
          Simulation de trading Or & Argent
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="border shadow-sm bg-white">
          <CardHeader>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-center">
                Bienvenue
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Commencez à trader avec un solde virtuel de 10,000€
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
              >
                Commencer à investir
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center text-sm text-gray-500">
              <p>
                Cette plateforme est une simulation à but éducatif.
                <br />
                Les prix sont mis à jour en temps réel.
              </p>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <p className="font-medium">Or (Au)</p>
              <p>Metal précieux</p>
            </div>
            <div className="text-center">
              <p className="font-medium">Argent (Ag)</p>
              <p>Metal précieux</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
