import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Home, LayoutDashboard, UserCog, ClipboardCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Ana Səhifə", to: "/", icon: Home },
  { label: "İdarəetmə", to: "/dashboard", icon: LayoutDashboard },
  { label: "HR Paneli", to: "/hr-panel", icon: UserCog },
  { label: "Menecer Tapşırıqları", to: "/manager-actions", icon: ClipboardCheck },
  { label: "İşçi Cavabları", to: "/employee-responses", icon: MessageSquare },
];

export const MobileNavMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="sm:hidden"
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Mobil menyu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-6 pt-8">
        <SheetHeader>
          <SheetTitle className="text-left">Naviqasiya</SheetTitle>
        </SheetHeader>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Button
                key={item.to}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "shadow-soft"
                )}
                onClick={() => handleNavigate(item.to)}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
