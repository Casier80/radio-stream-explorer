import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search, Heart, History, Smartphone, Globe, Radio, Share2 } from "lucide-react";
import radioLogo from "@/assets/radio-logo.png";

const Landing = () => {
  const handleOpenApp = () => {
    window.open("/app", "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = "🎵 ¡Descubre Casier Radio! Escucha emisoras de todo el mundo gratis desde tu navegador 📻";
    const url = window.location.origin;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={radioLogo} alt="Casier Radio Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Casier Radio
            </h1>
          </div>
          <Button onClick={handleOpenApp} className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Abrir App
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            <Radio className="w-4 h-4 mr-2" />
            Radio Mundial Online
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            Escucha emisoras de todo el mundo
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubre y disfruta miles de emisoras de radio internacionales desde tu navegador. 
            Búsqueda global, favoritos y disponible en todos tus dispositivos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={handleOpenApp} className="gap-2 text-lg px-8 py-6">
              <Radio className="w-5 h-5" />
              Comenzar a escuchar
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
              <Globe className="w-5 h-5" />
              Ver demo
            </Button>
          </div>

          {/* App Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card rounded-lg border shadow-2xl overflow-hidden">
              <iframe 
                src="/app" 
                className="w-full h-96 md:h-[500px]"
                title="Casier Radio App Preview"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Todo lo que necesitas para disfrutar la radio
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Search className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Búsqueda Global</h3>
                <p className="text-muted-foreground">
                  Encuentra emisoras por país, nombre o género musical. 
                  Accede a miles de estaciones de todo el mundo.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Favoritos</h3>
                <p className="text-muted-foreground">
                  Guarda tus emisoras favoritas para acceder rápidamente 
                  a ellas cuando quieras.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <History className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Historial</h3>
                <p className="text-muted-foreground">
                  Revisa las últimas emisoras que escuchaste y 
                  vuelve a ellas fácilmente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Tecnología moderna</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 justify-center">
                <Smartphone className="w-8 h-8 text-primary" />
                <span className="font-medium">PWA Instalable</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Globe className="w-8 h-8 text-primary" />
                <span className="font-medium">Responsive Design</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Radio className="w-8 h-8 text-primary" />
                <span className="font-medium">Interfaz en Español</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para explorar el mundo de la radio?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            No necesitas registro ni instalación. Comienza a escuchar ahora mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleOpenApp} className="gap-2 text-lg px-8 py-6">
              <Radio className="w-5 h-5" />
              Abrir Casier Radio
            </Button>
            <Button variant="outline" size="lg" onClick={handleShareWhatsApp} className="gap-2 text-lg px-8 py-6">
              <Share2 className="w-5 h-5" />
              Compartir en WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={radioLogo} alt="Casier Radio" className="w-8 h-8" />
            <span className="font-semibold">Casier Radio</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Radio mundial online - Desarrollado con ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;