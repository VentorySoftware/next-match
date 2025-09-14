import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, Calendar, MapPin, Trophy, Users, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const CreateTournament = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "18:00",
    maxParticipants: "",
    prize: "",
    registrationFee: "",
    description: "",
    staff: "",
    image: "",
    dataSource: "internal" // internal or google-sheets
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validaciones básicas
    if (!formData.name || !formData.location || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simular creación del torneo
    setTimeout(() => {
      toast({
        title: "¡Torneo creado exitosamente!",
        description: `${formData.name} ha sido creado y está pendiente de aprobación.`,
      });
      
      setIsSubmitting(false);
      navigate("/tournaments");
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // En una aplicación real, aquí subirías la imagen a un servidor
      const imageUrl = URL.createObjectURL(file);
      handleInputChange("image", imageUrl);
      
      toast({
        title: "Imagen cargada",
        description: "La imagen de portada ha sido cargada correctamente.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/tournaments">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Torneos
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Crear Nuevo Torneo</h1>
              <p className="text-muted-foreground">Configura todos los detalles de tu torneo</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Información Básica */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Torneo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ej: Copa Primavera 2024"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                      placeholder="32"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe los detalles del torneo, reglas especiales, etc."
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prize">Premio</Label>
                    <Input
                      id="prize"
                      value={formData.prize}
                      onChange={(e) => handleInputChange("prize", e.target.value)}
                      placeholder="$50,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationFee">Costo de Inscripción</Label>
                    <Input
                      id="registrationFee"
                      value={formData.registrationFee}
                      onChange={(e) => handleInputChange("registrationFee", e.target.value)}
                      placeholder="$1,200"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="staff">Staff de Contacto</Label>
                  <Input
                    id="staff"
                    value={formData.staff}
                    onChange={(e) => handleInputChange("staff", e.target.value)}
                    placeholder="Juan Pérez - Director del Torneo"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Imagen de Portada */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Imagen de Portada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.image && (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Sube una imagen de portada
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        Seleccionar Imagen
                      </Button>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ubicación y Fechas */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Nombre del Lugar *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Club Deportivo Central"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Dirección Completa</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Av. Principal 123, Buenos Aires"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Fechas y Horarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Fecha de Inicio *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Fecha de Fin *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Hora de Inicio</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Hora de Fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuración de Datos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Gestión de Participantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="dataSource">Fuente de Datos</Label>
                <Select
                  value={formData.dataSource}
                  onValueChange={(value) => handleInputChange("dataSource", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la fuente de datos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Carga interna del sistema</SelectItem>
                    <SelectItem value="google-sheets">Importar desde Google Sheets</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  {formData.dataSource === "internal" 
                    ? "Los participantes se registrarán directamente en el sistema"
                    : "Los datos se sincronizarán automáticamente desde Google Sheets"
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Link to="/tournaments">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-hero hover:shadow-primary"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Crear Torneo
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;