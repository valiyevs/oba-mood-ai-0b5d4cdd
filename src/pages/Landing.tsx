import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  BarChart3,
  Shield,
  Bell,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Target,
  ChevronRight,
} from "lucide-react";
import obaLogo from "@/assets/oba-logo.jpg";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  {
    icon: Brain,
    title: "AI ilə Analiz",
    description: "Süni intellekt işçilərin əhval datalarını real vaxtda analiz edir və hərəkətə keçməyə imkan verən tövsiyələr təqdim edir.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Ətraflı Dashboard",
    description: "Filial üzrə məmnuniyyət indeksi, əhval bölgüsü, trend analizi və müqayisəli qrafiklər bir ekranda.",
    color: "from-primary to-emerald-600",
  },
  {
    icon: Shield,
    title: "Tam Anonimlik",
    description: "İşçilərin şəxsi məlumatları heç bir yerdə saxlanmır. Cavablar tam anonim və konfidensiyaldır.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bell,
    title: "Anlıq Bildirişlər",
    description: "Burnout riski aşkarlandıqda menecerlərə dərhal xəbərdarlıq göndərilir.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Proqnozlaşdırma",
    description: "Gələcək risk proqnozu, stress tendensiyaları və müştəri şikayətlərinin əvvəlcədən aşkarlanması.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Target,
    title: "Hədəf İdarəetmə",
    description: "Filial və şöbə üzrə məmnuniyyət hədəfləri təyin edin, nəticələri real vaxtda izləyin.",
    color: "from-teal-500 to-green-500",
  },
];

const stats = [
  { value: "9", label: "Filial", suffix: "+" },
  { value: "500", label: "İşçi", suffix: "+" },
  { value: "98", label: "Anonimlik", suffix: "%" },
  { value: "24/7", label: "Monitorinq", suffix: "" },
];

const steps = [
  {
    step: "01",
    title: "İşçi sorğu doldurur",
    description: "Hər gün sadəcə bir sual — 'Bu gün özünüzü necə hiss edirsiniz?' Anonim və 30 saniyə.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "AI datanı analiz edir",
    description: "Süni intellekt toplanmış cavabları analiz edib tendensiyaları, riskləri və tövsiyələri müəyyən edir.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Menecer hərəkətə keçir",
    description: "AI tövsiyələrinə əsasən menecerlər vaxtında müdaxilə edir — burnout baş verməzdən əvvəl.",
    icon: Zap,
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={obaLogo} alt="MoodAI" className="w-10 h-10 rounded-xl object-cover ring-1 ring-border/50" />
            <span className="text-lg font-bold">MoodAI</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/survey")}
              className="hidden sm:inline-flex"
            >
              Sorğu
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/suggestion-box")}
              className="hidden sm:inline-flex"
            >
              Təklif qutusu
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/auth")}
              className="gap-1"
            >
              Giriş
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary font-medium">
              <Sparkles className="w-4 h-4" />
              AI ilə gücləndirilmiş əhval monitorinqi
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              İşçilərin əhvalını{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                real vaxtda
              </span>{" "}
              izləyin
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Burnout baş verməzdən <strong>əvvəl</strong> müdaxilə edin. Süni intellektlə gücləndirilmiş 
              analitika ilə komandanızın məmnuniyyətini artırın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/survey")}
                className="text-base px-8 h-12 rounded-xl gap-2 shadow-lg shadow-primary/25"
              >
                Sorğunu başla
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-base px-8 h-12 rounded-xl gap-2"
              >
                Demo baxış
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/40 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-primary">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Platforma İmkanları</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hər bir funksionallıq işçi məmnuniyyətini artırmaq və burnout risklərini azaltmaq üçün hazırlanıb.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 space-y-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Necə İşləyir?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Üç sadə addımla komandanızın əhvalını izləyin və vaxtında müdaxilə edin.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary/60 tracking-widest uppercase">
                  Addım {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-primary/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Nəyə görə{" "}
                <span className="text-primary">MoodAI?</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Burnout risklərinin 60%-ni əvvəlcədən aşkarlayır",
                  "İşçi dönüşümünü (turnover) 35% azaldır",
                  "Müştəri məmnuniyyətini 25% artırır",
                  "Menecer müdaxilə vaxtını 3x sürətləndirir",
                  "Tam anonim — işçi etibarını qoruyur",
                  "PWA dəstəyi — mobil cihazlardan rahat istifadə",
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">İstifadəçi Rolları</div>
                      <div className="text-sm text-muted-foreground">Üç səviyyəli giriş</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { role: "İşçi", desc: "Anonim sorğu doldurma, təklif göndərmə" },
                      { role: "Menecer", desc: "Dashboard, AI analiz, tapşırıq idarəetmə" },
                      { role: "HR", desc: "Bütün filiallar, hesabatlar, hədəflər" },
                    ].map((item) => (
                      <div key={item.role} className="flex items-start gap-3 p-3 rounded-lg bg-background/60">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div>
                          <div className="text-sm font-medium">{item.role}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-10 md:p-16 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Komandanızın əhvalını izləməyə başlayın
            </h2>
            <p className="text-muted-foreground text-lg">
              İndi qoşulun və burnout risklərini əvvəlcədən aşkarlayın. 
              Pulsuz sınaq müddəti ilə başlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-base px-8 h-12 rounded-xl gap-2 shadow-lg shadow-primary/25"
              >
                Pulsuz başla
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/survey")}
                className="text-base px-8 h-12 rounded-xl"
              >
                Sorğunu sına
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={obaLogo} alt="MoodAI" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-sm font-medium">MoodAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 PATCO Group. Bütün hüquqlar qorunur.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button onClick={() => navigate("/survey")} className="hover:text-primary transition-colors">
                Sorğu
              </button>
              <button onClick={() => navigate("/auth")} className="hover:text-primary transition-colors">
                Giriş
              </button>
              <button onClick={() => navigate("/export-spec")} className="hover:text-primary transition-colors">
                Sənədlər
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
