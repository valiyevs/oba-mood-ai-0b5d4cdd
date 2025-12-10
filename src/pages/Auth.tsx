import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Lock, Mail, UserCog, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import obaLogo from "@/assets/oba-logo.jpg";

type AppRole = "hr" | "manager";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("manager");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/dashboard");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        
        if (signUpError) throw signUpError;

        // If sign up successful, assign the role using RPC function
        if (signUpData.user) {
          const { error: roleError } = await supabase
            .rpc('assign_user_role', {
              _user_id: signUpData.user.id,
              _role: selectedRole
            });
          
          if (roleError) {
            console.error('Role assignment error:', roleError);
            // Don't throw - user is created, role can be added manually by HR
          }
        }
        
        toast({
          title: "Qeydiyyat uğurlu!",
          description: `Hesabınız ${selectedRole === 'hr' ? 'HR' : 'Menecer'} rolu ilə yaradıldı.`,
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
      }
    } catch (error: any) {
      let message = "Xəta baş verdi";
      if (error.message.includes("Invalid login credentials")) {
        message = "Email və ya şifrə yanlışdır";
      } else if (error.message.includes("User already registered")) {
        message = "Bu email artıq qeydiyyatdan keçib";
      } else if (error.message.includes("Password should be")) {
        message = "Şifrə ən azı 6 simvol olmalıdır";
      }
      
      toast({
        title: "Xəta",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={obaLogo} 
              alt="OBA Logo" 
              className="w-16 h-16 rounded-xl shadow-glow object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Qeydiyyat" : "Kabinet Girişi"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Yeni hesab yaratmaq üçün məlumatları daxil edin" 
              : "İdarəetmə panelinə daxil olmaq üçün giriş edin"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Şifrə</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Role Selection - Only shown during sign up */}
            {isSignUp && (
              <div className="space-y-3">
                <Label>Rol seçin</Label>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as AppRole)}
                  className="grid grid-cols-2 gap-3"
                >
                  <div>
                    <RadioGroupItem
                      value="manager"
                      id="role-manager"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="role-manager"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <UserCog className="mb-2 h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">Bölgə Meneceri</span>
                      <span className="text-xs text-muted-foreground mt-1">Öz bölgənizi idarə edin</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="hr"
                      id="role-hr"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="role-hr"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <Users className="mb-2 h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">HR / Rəhbərlik</span>
                      <span className="text-xs text-muted-foreground mt-1">Bütün bölgələri izləyin</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gözləyin...
                </>
              ) : isSignUp ? (
                "Qeydiyyatdan keç"
              ) : (
                "Daxil ol"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? "Artıq hesabınız var? " : "Hesabınız yoxdur? "}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? "Daxil olun" : "Qeydiyyatdan keçin"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
