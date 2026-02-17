import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Star,
  Crown,
  Building2,
  Check,
  Activity,
  Lock,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  {
    icon: Brain,
    title: "AI ilə Dərin Analiz",
    description: "Süni intellekt əhval datalarını real vaxtda analiz edib hərəkətə keçməyə imkan verən tövsiyələr yaradır.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "İnteraktiv Dashboard",
    description: "Məmnuniyyət indeksi, əhval bölgüsü, trend analizi və filial müqayisəsi bir baxışda.",
    color: "from-primary to-emerald-600",
  },
  {
    icon: Shield,
    title: "Tam Anonimlik",
    description: "İşçilərin şəxsi məlumatları saxlanmır. Cavablar 100% anonim və konfidensiyaldır.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bell,
    title: "Anlıq Xəbərdarlıqlar",
    description: "Tükənmişlik riski aşkarlandıqda menecerlərə dərhal push bildiriş göndərilir.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Proqnozlaşdırma",
    description: "1C/SAP datalarına əsasən gələcək risk proqnozu və satış korrelyasiyası.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Target,
    title: "Hədəf İdarəetmə",
    description: "Filial və şöbə üzrə məmnuniyyət hədəfləri təyin edin, progress real vaxtda izlənsin.",
    color: "from-teal-500 to-green-500",
  },
];

const stats = [
  { value: "9", label: "Filial əhatəsi", suffix: "+" },
  { value: "500", label: "Aktiv işçi", suffix: "+" },
  { value: "100", label: "Anonimlik", suffix: "%" },
  { value: "3x", label: "Sürətli müdaxilə", suffix: "" },
];

const steps = [
  {
    step: "01",
    title: "İşçi sorğu doldurur",
    description: "Hər gün 30 saniyəlik anonim sorğu — 'Bu gün özünüzü necə hiss edirsiniz?'",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "AI datanı analiz edir",
    description: "Süni intellekt tendensiyaları, risk amillərini və hərəkət planlarını müəyyənləşdirir.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Menecer hərəkətə keçir",
    description: "AI tövsiyələrinə əsasən vaxtında müdaxilə — tükənmişlik baş verməzdən əvvəl.",
    icon: Zap,
  },
];

const pricingPlans = [
  {
    name: "Basic",
    price: "20",
    period: "ay / filial",
    description: "Kiçik komandalar üçün əsas əhval izləmə funksiyaları",
    icon: Star,
    popular: false,
    features: [
      "Gündəlik əhval sorğusu",
      "Əsas dashboard",
      "Əhval bölgüsü qrafikləri",
      "CSV export",
      "Anonim təklif qutusu",
      "Email dəstək",
    ],
    notIncluded: [
      "AI analiz və tövsiyələr",
      "Proqnozlaşdırıcı analitika",
      "Satış korrelyasiyası",
    ],
  },
  {
    name: "Premium",
    price: "35",
    period: "ay / filial",
    description: "AI proqnozları və ətraflı analitika ilə gücləndirilmiş paket",
    icon: Crown,
    popular: true,
    features: [
      "Basic-in bütün funksiyaları",
      "AI ilə dərin analiz",
      "Tükənmişlik risk proqnozu",
      "Menecer tapşırıq sistemi",
      "Real-time bildirişlər",
      "Trend analizi",
      "Excel və PDF export",
      "Prioritet dəstək",
    ],
    notIncluded: [
      "1C/SAP inteqrasiya",
    ],
  },
  {
    name: "Enterprise",
    price: "50",
    period: "ay / filial",
    description: "Tam funksional platforma — satış korrelyasiyası və dərin analiz",
    icon: Building2,
    popular: false,
    features: [
      "Premium-un bütün funksiyaları",
      "1C/SAP satış korrelyasiyası",
      "Müştəri şikayəti proqnozu",
      "Xüsusi hesabat şablonları",
      "API inteqrasiya",
      "Xüsusi branding",
      "Onboarding dəstəyi",
      "7/24 prioritet dəstək",
    ],
    notIncluded: [],
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-md">
              <span className="text-xl">😊</span>
            </div>
            <span className="text-lg font-bold">MoodAI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">İmkanlar</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">Necə işləyir</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Qiymətlər</a>
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
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[200px]" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm text-primary font-medium"
            >
              <Sparkles className="w-4 h-4" />
              AI ilə gücləndirilmiş HR analitika platforması
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight">
              İşçi əhvalını{" "}
              <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                real vaxtda
              </span>
              <br />
              izləyin, analiz edin
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tükənmişlik baş verməzdən <strong className="text-foreground">əvvəl</strong> müdaxilə edin. 
              Süni intellekt analitikası ilə komandanızın məmnuniyyətini <strong className="text-foreground">ölçün və artırın</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-base px-10 h-14 rounded-2xl gap-2 shadow-xl shadow-primary/20 text-lg"
              >
                Pulsuz başlayın
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/survey")}
                className="text-base px-10 h-14 rounded-2xl gap-2 text-lg"
              >
                Canlı demo
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Kredit kartı tələb olunmur · 14 gün pulsuz sınaq
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Trusted by / Stats */}
      <section className="py-16 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-10 uppercase tracking-widest font-medium">
            Platformanın göstəriciləri
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
              <Activity className="w-3.5 h-3.5 mr-1.5" /> İmkanlar
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Hər şey bir platformada
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              İşçi məmnuniyyətini artırmaq və tükənmişlik risklərini azaltmaq üçün ehtiyacınız olan bütün alətlər.
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
                <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-7 space-y-4">
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
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/15">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5 mr-1.5" /> Proses
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">3 addımda başlayın</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quraşdırma sadədir. Komandanız dəqiqələr ərzində əhval bildirməyə başlaya bilər.
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
                className="relative text-center space-y-5"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 shadow-lg">
                  <item.icon className="w-9 h-9 text-primary" />
                </div>
                <div className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full tracking-widest uppercase">
                  Addım {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-4 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-primary/25" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
              <Crown className="w-3.5 h-3.5 mr-1.5" /> Qiymətlər
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Abunə Paketləri
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Filial sayına görə miqyaslanan B2B SaaS modeli. Bütün paketlərdə 14 gün pulsuz sınaq.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-1 text-xs shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" /> Ən populyar
                    </Badge>
                  </div>
                )}
                <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular 
                    ? "border-primary/50 shadow-lg shadow-primary/10 bg-gradient-to-b from-primary/5 to-transparent" 
                    : "border-border/50"
                }`}>
                  <CardHeader className="pb-4 pt-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${
                        plan.popular 
                          ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <plan.icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className="text-lg text-muted-foreground">AZN</span>
                      <span className="text-sm text-muted-foreground ml-1">/ {plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button
                      onClick={() => navigate("/auth")}
                      className={`w-full h-11 rounded-xl ${
                        plan.popular 
                          ? "shadow-md shadow-primary/20" 
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Pulsuz başla
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground/50">
                          <Check className="w-4 h-4 mt-0.5 shrink-0 opacity-30" />
                          <span className="line-through">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 md:py-32 bg-muted/15">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Nəticələr
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Nəyə görə{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">MoodAI?</span>
                </h2>
              </div>
              <div className="space-y-5">
                {[
                  "Tükənmişlik risklərinin 60%-ni əvvəlcədən aşkarlayır",
                  "İşçi dönüşümünü (turnover) 35% azaldır",
                  "Müştəri məmnuniyyətini 25% artırır",
                  "Menecer müdaxilə vaxtını 3x sürətləndirir",
                  "Tam anonim — işçi etibarını qoruyur",
                  "PWA — mobil cihazlardan istənilən yerdə istifadə",
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-transparent shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-md">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">İstifadəçi Rolları</div>
                      <div className="text-sm text-muted-foreground">Üç səviyyəli giriş nəzarəti</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { role: "İşçi", desc: "Anonim sorğu doldurma, təklif göndərmə", emoji: "👤" },
                      { role: "Menecer", desc: "Dashboard, AI analiz, tapşırıq idarəetmə", emoji: "👔" },
                      { role: "HR", desc: "Bütün filiallar, hesabatlar, hədəflər", emoji: "🏢" },
                    ].map((item) => (
                      <div key={item.role} className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/30">
                        <span className="text-xl mt-0.5">{item.emoji}</span>
                        <div>
                          <div className="text-sm font-semibold">{item.role}</div>
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
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-12 md:p-20 space-y-8 shadow-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              Komandanızın əhvalını izləməyə başlayın
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              14 gün pulsuz sınaq müddəti ilə başlayın. Kredit kartı tələb olunmur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-base px-10 h-14 rounded-2xl gap-2 shadow-xl shadow-primary/20 text-lg"
              >
                Pulsuz başlayın
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/survey")}
                className="text-base px-10 h-14 rounded-2xl text-lg"
              >
                Sorğunu sınayın
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-lg">😊</span>
              </div>
              <div>
                <span className="font-semibold">MoodAI</span>
                <p className="text-xs text-muted-foreground">Personal Məmnuniyyət Platforması</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              © 2026 PATCO Group. Bütün hüquqlar qorunur.
            </div>
            <div className="flex items-center justify-end gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate("/survey")} className="hover:text-primary transition-colors">
                Sorğu
              </button>
              <button onClick={() => navigate("/auth")} className="hover:text-primary transition-colors">
                Giriş
              </button>
              <button onClick={() => navigate("/suggestion-box")} className="hover:text-primary transition-colors">
                Təklif
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
