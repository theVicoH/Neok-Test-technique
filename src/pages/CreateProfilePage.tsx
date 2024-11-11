import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  experience: z.enum(['beginner', 'intermediate', 'expert'], {
    required_error: "Veuillez sélectionner votre niveau d'expérience",
  }),
  riskProfile: z.enum(['conservative', 'moderate', 'aggressive'], {
    required_error: "Veuillez sélectionner votre profil de risque",
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CreateProfilePage() {
  const navigate = useNavigate();
  const updateProfile = useUserStore((state) => state.updateProfile);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      updateProfile(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      alert('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Créez votre profil investisseur
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ces informations nous permettront de personnaliser votre expérience
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Card className="border shadow-sm bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Informations personnelles</h3>
                <p className="text-sm text-gray-500">
                  Remplissez les informations ci-dessous pour commencer à investir
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <Input
                    {...register('firstName')}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <Input
                    {...register('lastName')}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Niveau d'expérience en trading
                </label>
                <select
                  {...register('experience')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Sélectionnez votre niveau</option>
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="expert">Expert</option>
                </select>
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Profil de risque
                </label>
                <select
                  {...register('riskProfile')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Sélectionnez votre profil</option>
                  <option value="conservative">Conservateur</option>
                  <option value="moderate">Modéré</option>
                  <option value="aggressive">Agressif</option>
                </select>
                {errors.riskProfile && (
                  <p className="text-sm text-red-500">{errors.riskProfile.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Retour
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Création...' : 'Créer mon profil'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Toutes les informations sont stockées localement et seront effacées à la fermeture du navigateur.
          </p>
        </div>
      </div>
    </div>
  );
}