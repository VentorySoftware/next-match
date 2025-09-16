import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useParticipants } from '@/context/ParticipantContext';
import { useToast } from '@/hooks/use-toast';

const participantSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
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
  const { registerParticipant } = useParticipants();
  const { toast } = useToast();
  
  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      category: 'intermedio',
      partnerName: '',
    },
  });

  const onSubmit = (data: ParticipantFormData) => {
    registerParticipant({
      name: data.name,
      email: data.email,
      phone: data.phone,
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inscripción al Torneo</CardTitle>
        <CardDescription>
          Completa tus datos para inscribirte al torneo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu número de teléfono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <Button type="submit" className="w-full">
              Inscribirse al Torneo
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};