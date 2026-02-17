import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Menu,
  X,
  Quote,
  ShoppingCart,
  Landmark,
  Wifi,
  Award,
  Handshake,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { useCmsMenus } from "@/hooks/useCmsMenus";
import { useRef, useState, useEffect } from "react";

/* ─── Icon maps for CMS-driven arrays ─── */
const painIcons = [HeartCrack, ShieldAlert, TrendingUp, AlertTriangle];
const featureIcons = [MousePointerClick, Gauge, Brain, LineChart, Eye, Bell];
const stepIcons = [MessageSquare, Brain, Zap];
const planIcons = [Star, Crown, Building2];

/* ─── Sectors ─── */
const sectors = [
  {
    icon: ShoppingCart,
    title: "Pərakəndə",
    subtitle: "Mağaza zəncirləri",
    pain: "Satıcının stresli günü = düşük çek və müştəri itkisi",
    solution: "Hər filialın əhval indeksini izləyin, kritik günlərdə dərhal müdaxilə edin",
    emoji: "🛒",
  },
  {
    icon: Landmark,
    title: "Bank sektoru",
    subtitle: "Filial şəbəkələri",
    pain: "Əməkdaşın soyuq münasibəti = müştəri loyallığının itirilməsi",
    solution: "Emosional xəritə ilə hər filialın riskini görün, proaktiv hərəkət edin",
    emoji: "🏦",
  },
  {
    icon: Wifi,
    title: "Telekom",
    subtitle: "Mobil operatorlar",
    pain: "Xidmət keyfiyyəti əməkdaşın enerjisindən asılıdır",
    solution: "Süni intellekt ilə stress mənbələrini tapın, brend reputasiyasını qoruyun",
    emoji: "📡",
  },
];

/* ─── Counter Animation Component ─── */
const CounterItem = ({ end, suffix, label, delay }: { end: number; suffix: string; label: string; delay: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const steps = 40;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="space-y-1"
    >
      <div className="text-3xl md:text-4xl font-extrabold text-primary">
        {count}{suffix}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { locale, t, tField } = useLanguage();
  const { menus: landingMenus } = useCmsMenus("landing_nav");
  const heroRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // CMS Data (FAQs & Partners loaded directly, content via t() from useLanguage)
  const { data: cmsFaqs = [] } = useQuery({
    queryKey: ["cms_faqs_landing"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_faqs").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });
  const { data: cmsPartners = [] } = useQuery({
    queryKey: ["cms_partners_landing"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_partners").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  // CMS-driven dynamic arrays
  const painStats = [1, 2, 3, 4].map((i, idx) => ({
    value: t(`pain_${i}_value`, ['65%', '79%', '+3%', '5%'][idx]),
    label: t(`pain_${i}_label`, ['Müştəri itkisi', 'Həvəssiz işçi', 'Gizli qazanc', 'Zəncir reaksiya'][idx]),
    detail: t(`pain_${i}_detail`, ''),
    source: t(`pain_${i}_source`, ''),
    icon: painIcons[idx],
  }));

  const solutionFeatures = [1, 2, 3, 4, 5, 6].map((i, idx) => ({
    icon: featureIcons[idx],
    title: t(`feature_${i}_title`, ''),
    description: t(`feature_${i}_desc`, ''),
    metric: t(`feature_${i}_metric`, ''),
  }));

  const steps = [1, 2, 3].map((i, idx) => ({
    step: `0${i}`,
    title: t(`step_${i}_title`, ''),
    description: t(`step_${i}_desc`, ''),
    icon: stepIcons[idx],
  }));

  const resultMetrics = [1, 2, 3, 4].map((i, idx) => ({
    value: t(`result_${i}_value`, ['60%', '35%', '25%', '3x'][idx]),
    label: t(`result_${i}_label`, ''),
  }));

  const sectors = [
    { icon: ShoppingCart, emoji: "🛒", n: 1 },
    { icon: Landmark, emoji: "🏦", n: 2 },
    { icon: Wifi, emoji: "📡", n: 3 },
  ].map(s => ({
    icon: s.icon,
    emoji: s.emoji,
    title: t(`sector_${s.n}_title`, ''),
    subtitle: t(`sector_${s.n}_subtitle`, ''),
    pain: t(`sector_${s.n}_pain`, ''),
    solution: t(`sector_${s.n}_solution`, ''),
  }));

  const testimonials = [1, 2, 3].map((i, idx) => ({
    quote: t(`testimonial_${i}_quote`, ''),
    name: t(`testimonial_${i}_name`, ''),
    role: t(`testimonial_${i}_role`, ''),
    emoji: ["🛒", "🏦", "📡"][idx],
  }));

  const pricingFeatureCounts: Record<string, { f: number; n: number }> = {
    basic: { f: 6, n: 3 },
    premium: { f: 8, n: 1 },
    enterprise: { f: 8, n: 0 },
  };

  const pricingPlans = [
    { key: 'basic', icon: planIcons[0], popular: false },
    { key: 'premium', icon: planIcons[1], popular: true },
    { key: 'enterprise', icon: planIcons[2], popular: false },
  ].map(p => ({
    name: t(`pricing_${p.key}_name`, p.key),
    price: t(`pricing_${p.key}_price`, '0'),
    period: t(`pricing_${p.key}_period`, 'ay / filial'),
    description: t(`pricing_${p.key}_desc`, ''),
    icon: p.icon,
    popular: p.popular,
    features: Array.from({ length: pricingFeatureCounts[p.key].f }, (_, i) => t(`pricing_${p.key}_f${i + 1}`, '')).filter(Boolean),
    notIncluded: Array.from({ length: pricingFeatureCounts[p.key].n }, (_, i) => t(`pricing_${p.key}_n${i + 1}`, '')).filter(Boolean),
  }));

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
  };

  // Use CMS menus if available, fallback to static
  const navLinks = landingMenus.length > 0
    ? landingMenus.map(m => ({ href: m.url || "#", label: m.label }))
    : [
        { href: "#problem", label: "Problem" },
        { href: "#solution", label: "Həll" },
        { href: "#sectors", label: "Sektorlar" },
        { href: "#how-it-works", label: "Necə işləyir" },
        { href: "#testimonials", label: "Rəylər" },
        { href: "#pricing", label: "Qiymətlər" },
      ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══ Sticky Navigation ═══ */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <span className="text-xl">😊</span>
            </div>
            <span className="text-lg font-bold tracking-tight">MoodAI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="hover:text-foreground transition-colors font-medium">{link.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/survey")} className="hidden sm:inline-flex">
              Demo
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")} className="gap-1 hidden sm:inline-flex">
              Giriş <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => { navigate("/survey"); setMobileMenuOpen(false); }}>Demo</Button>
                <Button size="sm" onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}>Giriş <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* ═══ Hero — Two Column ═══ */}
      <section ref={heroRef} className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-secondary/8 rounded-full blur-[160px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full border-destructive/30 text-destructive font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  {t('hero_badge', 'Görünməyən satış itkisi — hər gün baş verir')}
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight"
              >
                 {t('hero_title', 'İşçi əhvalını biznesin qazancına çevirin.')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground max-w-lg leading-relaxed"
              >
                 {t('hero_subtitle', 'Satışı ölçürsünüz. Bəs satışı yaradan insanın əhvalını? Ölçülməyən emosiya idarə oluna bilməz.')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" onClick={() => navigate("/auth")} className="text-base px-8 h-13 rounded-xl gap-2 shadow-lg shadow-primary/20">
                  {t('hero_cta_primary', 'Pulsuz başlayın')} <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/survey")} className="text-base px-8 h-13 rounded-xl gap-2">
                  {t('hero_cta_secondary', 'Canlı demo')} <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                {t('hero_trust_text', 'Kredit kartı tələb olunmur · 14 gün pulsuz sınaq')}
              </motion.p>
            </div>

            {/* Right — Glassmorphism Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-2xl">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-status-normal/60" />
                    <div className="w-3 h-3 rounded-full bg-status-good/60" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">MoodAI İdarəetmə Paneli</span>
                </div>

                {/* Mini dashboard cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="rounded-xl bg-background/80 border border-border/40 p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">Əhval Skoru</p>
                    <p className="text-2xl font-bold text-foreground">78%</p>
                    <div className="flex items-center gap-1 text-xs text-status-good">
                      <TrendingUp className="w-3 h-3" /> +5%
                    </div>
                  </div>
                  <div className="rounded-xl bg-background/80 border border-border/40 p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">Tükənmə Riski</p>
                    <p className="text-2xl font-bold text-status-good">Aşağı</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" /> Stabil
                    </div>
                  </div>
                  <div className="rounded-xl bg-background/80 border border-border/40 p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">Aktiv İşçi</p>
                    <p className="text-2xl font-bold text-foreground">342</p>
                    <div className="flex items-center gap-1 text-xs text-secondary">
                      <Users className="w-3 h-3" /> 12 filial
                    </div>
                  </div>
                </div>

                {/* Animated chart placeholder */}
                <div className="rounded-xl bg-background/60 border border-border/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">Həftəlik Əhval Trendi</span>
                    <Badge variant="outline" className="text-[10px] px-2 py-0">Canlı</Badge>
                  </div>
                  <div className="flex items-end gap-1.5 h-20">
                    {[45, 60, 55, 70, 65, 78, 82].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-secondary/60 to-secondary"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                    <span>Baz</span><span>Ber</span><span>Çrş</span><span>Crş</span><span>Cüm</span><span>Şnb</span><span>Baz</span>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-secondary/10 via-transparent to-primary/10 -z-10 blur-xl" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══ Counter / Social Proof Bar ═══ */}
      <section className="py-12 md:py-16 border-y border-border/40 bg-primary/[0.03]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { end: parseInt(t('stat_companies', '50')), suffix: "+", label: t('stat_companies_label', 'Şirkət istifadə edir') },
              { end: parseInt(t('stat_users', '340')), suffix: "+", label: t('stat_users_label', 'Aktiv istifadəçi') },
              { end: parseInt(t('stat_branches', '120')), suffix: "+", label: t('stat_branches_label', 'Filial') },
              { end: parseInt(t('stat_satisfaction', '98')), suffix: "%", label: t('stat_satisfaction_label', 'Məmnuniyyət') },
            ].map((item, i) => (
              <CounterItem key={item.label} end={item.end} suffix={item.suffix} label={item.label} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Pain Point Statistics ═══ */}
      <section id="problem" className="py-20 md:py-28 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16 space-y-4">
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full border-destructive/30 text-destructive">
                <XCircle className="w-3.5 h-3.5 mr-1.5" /> {t('problem_badge', 'Problem')}
              </Badge>
            </motion.div>
             <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">
               {t('problem_title', 'Rəqəmlərin arxasındakı həqiqət')}
             </motion.h2>
             <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-2xl mx-auto">
               {t('problem_subtitle', 'Rəqabət qiymətdə deyil, müştəri təcrübəsindədir.')}
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
                <Card className="h-full border-border/50 hover:border-secondary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card/80 backdrop-blur-sm group">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/15 transition-colors">
                        <stat.icon className="w-6 h-6 text-destructive" />
                      </div>
                      <span className="text-3xl md:text-4xl font-extrabold text-foreground">{stat.value}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{stat.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{stat.detail}</p>
                    <p className="text-xs text-muted-foreground/60 italic">— {stat.source}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Solution — Data-rich Feature Cards ═══ */}
      <section id="solution" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8 space-y-4">
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> {t('solution_badge', 'Həll')}
              </Badge>
            </motion.div>
             <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">
               {t('solution_title', 'Tanış olun: MoodAI')}
             </motion.h2>
          </motion.div>

          {/* MoodAI intro card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto mb-16">
            <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 via-card to-transparent shadow-xl overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-4xl">😊</span>
                </div>
                 <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: t('solution_intro', 'Emosiyaları <strong class="text-secondary">KPI-ya</strong> çevirin. İtkini gözləməyin — <strong class="text-secondary">qarşısını alın.</strong>') }} />
                 <div className="flex items-center justify-center gap-2 text-secondary font-medium">
                   <Shield className="w-5 h-5" />
                   <span>{t('solution_shield', 'İtki olmadan ÖNCƏ müdaxilə')}</span>
                 </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Cards with mini-dashboard metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {solutionFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full border-border/50 hover:border-secondary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-card/50 backdrop-blur-sm rounded-2xl">
                  <CardContent className="p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 group-hover:bg-secondary/15 transition-colors">
                        <feature.icon className="w-6 h-6 text-secondary" />
                      </div>
                      {/* Mini metric badge */}
                      <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/50">
                        {feature.metric}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-secondary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Sectors — Bento Grid ═══ */}
      <section id="sectors" className="py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16 space-y-4">
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                <Layers className="w-3.5 h-3.5 mr-1.5" /> {t('sectors_title', 'Sektorlar')}
              </Badge>
            </motion.div>
             <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">
               {t('sectors_title', 'Sektorlar üçün MoodAI')}
             </motion.h2>
             <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-2xl mx-auto">
               {t('sectors_subtitle', 'Hər sektorun öz ağrı nöqtəsi var. MoodAI hər birinə uyğunlaşır.')}
             </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sectors.map((sector, i) => (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Card className="h-full border-border/50 hover:border-secondary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group rounded-2xl overflow-hidden">
                  {/* Top accent bar */}
                  <div className="h-1 w-full gradient-primary" />
                  <CardContent className="p-7 space-y-5">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{sector.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-secondary transition-colors">{sector.title}</h3>
                        <p className="text-sm text-muted-foreground">{sector.subtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-xl bg-destructive/5 border border-destructive/10 p-3">
                        <p className="text-sm text-destructive/80 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{sector.pain}</span>
                        </p>
                      </div>
                      <div className="rounded-xl bg-secondary/5 border border-secondary/10 p-3">
                        <p className="text-sm text-secondary flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{sector.solution}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How it Works ═══ */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-20 space-y-4">
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                <Zap className="w-3.5 h-3.5 mr-1.5" /> {t('badge_process', 'Proses')}
              </Badge>
            </motion.div>
             <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">{t('steps_title', 'Sadəcə 3 addım')}</motion.h2>
             <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-xl mx-auto">
               {t('steps_subtitle', 'Dəqiqələr ərzində quraşdırın. Elə bu gün nəticə görün.')}
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
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/10 border border-secondary/20 shadow-lg">
                  <item.icon className="w-9 h-9 text-secondary" />
                </div>
                <div className="inline-block text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full tracking-widest uppercase">
                  {t('step_label', 'Addım')} {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-4 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-secondary/25" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Results & Impact ═══ */}
      <section className="py-20 md:py-28 bg-muted/15">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16 space-y-4">
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> {t('badge_results', 'Nəticələr')}
              </Badge>
            </motion.div>
             <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">
               {t('results_title', 'Ölçülə bilən nəticələr')}
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
                <Card className="text-center border-secondary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                  <CardContent className="p-8 space-y-3">
                    <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {m.value}
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">{m.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section id="testimonials" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16 space-y-4">
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                <Quote className="w-3.5 h-3.5 mr-1.5" /> {t('badge_reviews', 'Rəylər')}
              </Badge>
            </motion.div>
             <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">
               {t('reviews_title', 'Müştərilərimiz nə deyir?')}
             </motion.h2>
          </motion.div>

           <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-secondary/20 transition-all duration-300 bg-card/80 rounded-2xl group">
                  <CardContent className="p-7 space-y-5">
                    <Quote className="w-10 h-10 text-secondary/20 group-hover:text-secondary/30 transition-colors" />
                    <p className="text-foreground/80 leading-relaxed italic text-[15px]">"{item.quote}"</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="text-sm font-semibold">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Pricing ═══ */}
      <section id="pricing" className="py-20 md:py-28 bg-muted/15">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-20 space-y-4">
            <motion.div variants={fadeUp} custom={0}>
               <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                 <Crown className="w-3.5 h-3.5 mr-1.5" /> {t('badge_pricing', 'Qiymətlər')}
               </Badge>
             </motion.div>
             <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold">{t('pricing_title', 'Abunə Paketləri')}</motion.h2>
             <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-xl mx-auto">
               {t('pricing_subtitle', 'Filial bazasında. 14 gün pulsuz.')}
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
                    <Badge className="gradient-primary text-primary-foreground px-4 py-1 text-xs shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" /> {t('popular_badge', 'Ən populyar')}
                    </Badge>
                  </div>
                )}
                <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl ${
                  plan.popular
                    ? "border-secondary/50 shadow-lg shadow-secondary/10 bg-gradient-to-b from-secondary/5 to-transparent"
                    : "border-border/50"
                }`}>
                  <CardHeader className="pb-4 pt-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${
                        plan.popular ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
                       {t('free_start_btn', 'Pulsuz başla')} <ArrowRight className="w-4 h-4 ml-1" />
                     </Button>
                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
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

      {/* ═══ Trust & Social Proof (CMS) ═══ */}
      <section className="py-16 md:py-20 border-y border-border/40">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 space-y-3">
             <h3 className="text-xl md:text-2xl font-bold text-muted-foreground">{t('trust_title', 'Güvən və Tərəfdaşlıq')}</h3>
             <p className="text-sm text-muted-foreground/70">{t('trust_subtitle', 'Etibarlı şirkətlər tərəfindən istifadə olunur')}</p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {(cmsPartners.length > 0 ? cmsPartners : [{ name: "OBA Market", logo_url: null }, { name: "PATCO Group", logo_url: null }]).map((partner: any, i: number) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-3 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500 cursor-default"
              >
                {partner.logo_url ? (
                  <img src={partner.logo_url} alt={partner.name} className="w-12 h-12 object-contain rounded-xl" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <span className="text-lg font-semibold text-muted-foreground">{partner.name}</span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-5 py-2"
            >
              <Award className="w-5 h-5 text-secondary" />
              <span className="text-sm font-semibold text-secondary">{t('trusted_partner', 'Etibarlı Tərəfdaş')}</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ (CMS) ═══ */}
      {cmsFaqs.length > 0 && (
        <section id="faq" className="py-20 md:py-28 bg-muted/15">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12 space-y-4">
              <motion.div variants={fadeUp} custom={0}>
                <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                  <HelpCircle className="w-3.5 h-3.5 mr-1.5" /> FAQ
                </Badge>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold">{t('faq_title', 'Tez-tez Verilən Suallar')}</motion.h2>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-3">
              {cmsFaqs.map((faq: any, i: number) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AccordionItem value={faq.id} className="border border-border/50 rounded-xl px-5 bg-card/50 backdrop-blur-sm">
                     <AccordionTrigger className="text-left font-medium hover:no-underline py-4">{locale !== 'az' ? (tField('cms_faqs', faq.id, 'question', faq.question) || faq.question) : faq.question}</AccordionTrigger>
                     <AccordionContent className="text-muted-foreground pb-4">{locale !== 'az' ? (tField('cms_faqs', faq.id, 'answer', faq.answer) || faq.answer) : faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center rounded-3xl border border-secondary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-12 md:p-20 space-y-8 shadow-xl"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl">🚀</span>
            </div>
             <h2 className="text-3xl md:text-5xl font-bold">
               {t('cta_title', 'Emosiyaları ölçməyə başlayın. Satışları qoruyun.')}
             </h2>
             <p className="text-muted-foreground text-lg max-w-md mx-auto">
               {t('cta_subtitle', '14 gün pulsuz. Kredit kartı lazım deyil.')}
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
               <Button size="lg" onClick={() => navigate("/auth")} className="text-base px-10 h-14 rounded-2xl gap-2 shadow-xl shadow-primary/20 text-lg">
                 {t('nav_free_start', 'Pulsuz başlayın')} <ArrowRight className="w-5 h-5" />
               </Button>
               <Button variant="outline" size="lg" onClick={() => navigate("/survey")} className="text-base px-10 h-14 rounded-2xl text-lg">
                 {t('cta_demo_btn', 'Canlı demo sınayın')}
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
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-lg">😊</span>
              </div>
              <div>
                <span className="font-semibold">MoodAI</span>
                <p className="text-xs text-muted-foreground">{t('footer_tagline', 'Əməkdaş Emosiya Analitika Platforması')}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              {t('footer_copyright', '© 2026 PATCO Group. Bütün hüquqlar qorunur.')}
            </div>
            <div className="flex items-center justify-end gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate("/survey")} className="hover:text-secondary transition-colors">Demo</button>
              <button onClick={() => navigate("/auth")} className="hover:text-secondary transition-colors">Giriş</button>
              <button onClick={() => navigate("/suggestion-box")} className="hover:text-secondary transition-colors">Təklif</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
