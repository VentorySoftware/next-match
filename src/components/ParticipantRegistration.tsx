import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useParticipants } from '@/context/ParticipantContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserCheck } from 'lucide-react';

const participantSchema = z.object({
  category: z.enum(['principiante', 'intermedio', 'avanzado', 'profesional']),
  partnerName: z.string().optional(),
});

type ParticipantFormData = z.infer<typeof participantSchema>;

interface ParticipantRegistrationProps {
  tournamentId: string;
  onSuccess?: () => void;
}

export const ParticipantRegistration: React.FC<ParticipantRegistrationProps> = ({ 
  tournamentId, 
  onSuccess 
}) => {
  const { user, profile, loading } = useAuth();
  const { registerParticipant } = useParticipants();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      category: 'intermedio',
      partnerName: '',
    },
  });

  // Auto-fill form with user data when user is logged in
  useEffect(() => {
    if (user && profile) {
      form.setValue('category', 'intermedio');
    }
  }, [user, profile, form]);

  const onSubmit = async (data: ParticipantFormData) => {
    if (isSubmitting) return;
    
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "Debes estar logueado para inscribirte.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await registerParticipant({
        name: profile.full_name || profile.email,
        email: profile.email,
        phone: profile.phone || '',
        category: data.category,
        tournamentId,
        partnerName: data.partnerName,
      });
      
      toast({
        title: "¡Inscripción exitosa!",
        description: "Te has registrado al torneo correctamente.",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la inscripción. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Iniciar Sesión Requerido
          </CardTitle>
          <CardDescription>
            Debes estar registrado e iniciado sesión para inscribirte a un torneo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Para inscribirte a este torneo necesitas tener una cuenta y estar logueado. 
            Esto nos permite gestionar tu participación y mantenerte informado sobre el torneo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate('/auth')} className="flex-1">
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="flex-1"
            >
              Crear Cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Inscripción al Torneo
        </CardTitle>
        <CardDescription>
          Completa los datos adicionales para inscribirte al torneo
        </CardDescription>
        <div className="text-sm text-muted-foreground bg-accent/50 p-3 rounded-lg">
          <p><strong>Usuario:</strong> {profile?.full_name || profile?.email}</p>
          <p><strong>Email:</strong> {profile?.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu nivel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="principiante">Principiante</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                      <SelectItem value="profesional">Profesional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="partnerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de tu Pareja (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de tu compañero/a" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Inscribiendo..." : "Inscribirse al Torneo"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};