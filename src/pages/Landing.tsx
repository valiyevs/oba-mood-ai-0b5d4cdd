import { motion, useScroll, useTransform } from "framer-motion";
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
  TrendingDown,
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
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  Gauge,
  HeartCrack,
  ShieldAlert,
  LineChart,
  Layers,
  MousePointerClick,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRef } from "react";

/* ─── Pain Point Statistics ─── */
const painStats = [
  {
    value: "65%",
    label: "İtirilmiş müştəri",
    detail: "Müştərilərin 65%-i əməkdaşın mənfi münasibətinə görə rəqibə keçir",
    source: "Oxford Global Resources 2024",
    icon: HeartCrack,
    color: "text-destructive",
  },
  {
    value: "79%",
    label: "Risk zonasında",
    detail: "Retail işçilərinin yalnız 21%-i işinə həvəslə yanaşır. Qalan 79% — gizli itki riski",
    source: "Gallup 2024",
    icon: ShieldAlert,
    color: "text-destructive",
  },
  {
    value: "+3%",
    label: "Gizli qazanc",
    detail: "Əməkdaş loyallığı yüksək olan nöqtələr digərlərindən 3% daha çox satış edir",
    source: "McKinsey",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    value: "5%",
    label: "Stress dalğası",
    detail: "Cəmi 5% stressli işçi, gün ərzində on minlərlə mənfi müştəri təması yaradır",
    source: "Daxili araşdırma",
    icon: AlertTriangle,
    color: "text-secondary",
  },
];

/* ─── Solution Features ─── */
const solutionFeatures = [
  {
    icon: MousePointerClick,
    title: "3 Saniyəlik Mikro-Sorğu",
    description: "Əməkdaşın gününün cəmi 3 saniyəsini alır. Bir kliklə anonim əhval bildirişi.",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: Gauge,
    title: "Real-Time Mood Index",
    description: "0–100 arası hesablanan Əhval İndeksi kritik həddə düşdükdə menecerə dərhal alert göndərilir.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Brain,
    title: "AI Root Cause Analysis",
    description: "Süni intellekt stressin, yorğunluğun və konfliktlərin kök səbəblərini trend analizləri ilə müəyyən edir.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: LineChart,
    title: "Satışla İnteqrasiya",
    description: "Əhval göstəricilərinin satış datası ilə çarpaz analizi — əhvalın satışa real təsirini görün.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Eye,
    title: "Emosional Dashboard",
    description: "Regionlar, filiallar və növbələr üzrə Emosional Xəritə və Burnout Risk Skoru vizuallaşdırılır.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Bell,
    title: "Proaktiv Tövsiyələr",
    description: "AI tərəfindən idarəetmə heyəti üçün hazırlanan stressi azaltma və motivasiyanı artırma strategiyaları.",
    gradient: "from-teal-500 to-green-500",
  },
];

/* ─── How it works ─── */
const steps = [
  {
    step: "01",
    title: "Əməkdaş əhval bildirir",
    description: "Gündə 1 dəfə, bir kliklə — sadə, intuitiv, tam anonim. Psixoloji təhlükəsizlik qorunur.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "AI datanı analiz edir",
    description: "Süni intellekt tendensiyaları, kök səbəbləri və risk faktorlarını real vaxtda müəyyənləşdirir.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Rəhbərlik hərəkətə keçir",
    description: "Müştəri itkisi baş vermədən ÖNCƏ riskli filiallar və kritik zaman dilimləri müəyyən edilir.",
    icon: Zap,
  },
];

/* ─── Pricing ─── */
const pricingPlans = [
  {
    name: "Basic",
    price: "20",
    period: "ay / filial",
    description: "Kiçik komandalar üçün əsas əhval izləmə",
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
    description: "AI proqnozları və ətraflı analitika ilə gücləndirilmiş",
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
    notIncluded: ["1C/SAP inteqrasiya"],
  },
  {
    name: "Enterprise",
    price: "50",
    period: "ay / filial",
    description: "Tam funksional — satış korrelyasiyası və dərin analiz",
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

/* ─── Result metrics ─── */
const resultMetrics = [
  { value: "60%", label: "Tükənmişlik risklərinin əvvəlcədən aşkarlanması" },
  { value: "35%", label: "İşçi dönüşümünün (turnover) azalması" },
  { value: "25%", label: "Müştəri məmnuniyyətinin artması" },
  { value: "3x", label: "Menecer müdaxilə sürətinin artması" },
];

const Landing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══ Navigation ═══ */}
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
            <a href="#problem" className="hover:text-foreground transition-colors">Problem</a>
            <a href="#solution" className="hover:text-foreground transition-colors">Həll</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">Necə işləyir</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Qiymətlər</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/survey")} className="hidden sm:inline-flex">
              Demo
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")} className="gap-1">
              Giriş <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ═══ Hero — Problem-Centric ═══ */}
      <section ref={heroRef} className="relative py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-destructive/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[200px]" />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-5 py-2 text-sm font-medium text-destructive"
            >
              <AlertTriangle className="w-4 h-4" />
              Görünməyən satış itkisi — hər gün baş verir
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight"
            >
              Müştərilərinizin{" "}
              <span className="bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
                65%-ni
              </span>{" "}
              itirirsiniz.
              <br />
              <span className="text-muted-foreground text-[0.7em]">
                Qiymətə görə deyil.{" "}
                <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent font-extrabold">
                  Emosiyaya
                </span>{" "}
                görə.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Şirkətlər satış rəqəmlərini ölçürlər — <strong className="text-foreground">nəticəni</strong>.
              Lakin bu nəticəni doğuran əsas amili — kassanın, bank masasının arxasındakı{" "}
              <strong className="text-foreground">insanın emosional vəziyyətini</strong> — ölçmürlər.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-block rounded-2xl border border-primary/20 bg-primary/5 px-8 py-4"
            >
              <p className="text-xl md:text-2xl font-bold text-primary">
                Ölçülməyən emosiya idarə oluna bilməz.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
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
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Kredit kartı tələb olunmur · 14 gün pulsuz sınaq
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ═══ Pain Point Statistics ═══ */}
      <section id="problem" className="py-20 md:py-28 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full border-destructive/30 text-destructive">
                <XCircle className="w-3.5 h-3.5 mr-1.5" /> Problem
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">
              Rəqəmlərin arxasındakı{" "}
              <span className="bg-gradient-to-r from-destructive to-destructive/60 bg-clip-text text-transparent">həqiqət</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Pərakəndə, bank və telekommunikasiya sektorlarında rəqabət artıq qiymətdə deyil, müştəri təcrübəsindədir.
              Eyni xidmət standartlarına baxmayaraq, müştəri məmnuniyyəti filiallar üzrə kəskin fərqlənir.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {painStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-destructive/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      <span className={`text-3xl md:text-4xl font-extrabold ${stat.color}`}>{stat.value}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{stat.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{stat.detail}</p>
                    <p className="text-xs text-muted-foreground/60 italic">— {stat.source}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pain point callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <Card className="border-destructive/20 bg-gradient-to-r from-destructive/5 via-background to-destructive/5">
              <CardContent className="p-8 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
                <h3 className="text-xl md:text-2xl font-bold">Əsas Ağrı Nöqtəsi</h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  Şirkətlər satış rəqəmlərini <strong className="text-foreground">(nəticəni)</strong> ölçürlər, lakin bu nəticəni doğuran əsas amili —{" "}
                  <strong className="text-destructive">kassanın arxasındakı insanın emosional vəziyyətini</strong> — ölçmürlər.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ═══ Solution Introduction ═══ */}
      <section id="solution" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8 space-y-4"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Həll
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">
              Tanış olun:{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">MoodAI</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-20"
          >
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-transparent shadow-xl overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto shadow-lg shadow-primary/30">
                  <span className="text-4xl">😊</span>
                </div>
                <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 max-w-3xl mx-auto">
                  Əməkdaşların emosional vəziyyətini real vaxt rejimində{" "}
                  <strong className="text-primary">biznes göstəricisinə (KPI)</strong> çevirən və süni intellektlə idarə olunan analitika platforması.
                </p>
                <div className="flex items-center justify-center gap-2 text-primary font-medium">
                  <Shield className="w-5 h-5" />
                  <span>Müştəri itkisi baş vermədən ÖNCƏ proaktiv müdaxilə imkanı</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Solution Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {solutionFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-7 space-y-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How it Works ═══ */}
      <section id="how-it-works" className="py-20 md:py-28 bg-muted/15">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                <Zap className="w-3.5 h-3.5 mr-1.5" /> Proses
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">3 addımda başlayın</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quraşdırma sadədir. Komandanız dəqiqələr ərzində əhval bildirməyə başlaya bilər.
            </motion.p>
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
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
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

      {/* ═══ Results & Impact ═══ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Nəticələr
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">
              Ölçülə bilən{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">nəticələr</span>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {resultMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-8 space-y-3">
                    <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                      {m.value}
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">{m.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Who Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  sector: "Pərakəndə ticarət",
                  detail: "Hər filialda müştəri ilə təmasda olan satıcıların əhvalı birbaşa satışa təsir edir",
                  emoji: "🛒",
                },
                {
                  sector: "Bankçılıq",
                  detail: "Bank masasının arxasındakı əməkdaşın münasibəti müştəri loyallığını müəyyən edir",
                  emoji: "🏦",
                },
                {
                  sector: "Telekommunikasiya",
                  detail: "Xidmət şöbəsinin enerjisi brendin ən güclü reklam alətidir",
                  emoji: "📡",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.sector}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300">
                    <CardContent className="p-6 space-y-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <h3 className="text-lg font-semibold">{item.sector}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Pricing ═══ */}
      <section id="pricing" className="py-20 md:py-28 bg-muted/15">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                <Crown className="w-3.5 h-3.5 mr-1.5" /> Qiymətlər
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">Abunə Paketləri</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Filial sayına görə miqyaslanan B2B SaaS modeli. Bütün paketlərdə 14 gün pulsuz sınaq.
            </motion.p>
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
                      className={`w-full h-11 rounded-xl ${plan.popular ? "shadow-md shadow-primary/20" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Pulsuz başla <ArrowRight className="w-4 h-4 ml-1" />
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

      {/* ═══ CTA ═══ */}
      <section className="py-20 md:py-28">
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
              Emosiyaları ölçməyə başlayın.
              <br />
              <span className="text-muted-foreground text-[0.7em]">Satışları qoruyun.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              14 gün pulsuz sınaq müddəti ilə başlayın. Kredit kartı tələb olunmur.
              Dəqiqələr ərzində ilk nəticələri görün.
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
                Canlı demo sınayın
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-border/40 py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-lg">😊</span>
              </div>
              <div>
                <span className="font-semibold">MoodAI</span>
                <p className="text-xs text-muted-foreground">Əməkdaş Emosiya Analitika Platforması</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              © 2026 PATCO Group. Bütün hüquqlar qorunur.
            </div>
            <div className="flex items-center justify-end gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate("/survey")} className="hover:text-primary transition-colors">Demo</button>
              <button onClick={() => navigate("/auth")} className="hover:text-primary transition-colors">Giriş</button>
              <button onClick={() => navigate("/suggestion-box")} className="hover:text-primary transition-colors">Təklif</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
