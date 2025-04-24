
import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Menu, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface User {
  name: string;
  email: string;
}

interface AppHeaderProps {
  toggleSidebar: () => void;
  children?: ReactNode;
}

export function AppHeader({ toggleSidebar, children }: AppHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      // First try to get from localStorage for immediate display
      const storedUser = localStorage.getItem('user');
      const storedPhotoUrl = localStorage.getItem('profilePhotoUrl');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      if (storedPhotoUrl) {
        setProfilePhotoUrl(storedPhotoUrl);
      }
      
      // Then try to get fresh data from Supabase
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name, email, photo_url')
            .eq('id', session.user.id)
            .single();
            
          if (profileData) {
            const fullName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'User';
            const userData = {
              name: fullName,
              email: profileData.email || session.user.email || ''
            };
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            
            if (profileData.photo_url) {
              const photoUrl = supabase.storage
                .from('profile-photos')
                .getPublicUrl(profileData.photo_url).data.publicUrl;
                
              setProfilePhotoUrl(photoUrl);
              localStorage.setItem('profilePhotoUrl', photoUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('profilePhotoUrl');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      className: "bg-[#FFC42B] text-[#241715]",
    });
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleProfileClick = () => {
    navigate('/settings/profile');
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-white flex items-center justify-between h-16 px-4",
      location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' ? "hidden" : ""
    )}>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <img 
          src="/lovable-uploads/2ebe7ecc-af2a-4e7d-bba7-c42cae035782.png" 
          alt="Oscars Optical Clinic" 
          className="h-10 mr-4"
        />
      </div>

      <div className="flex items-center gap-4">
        {children}
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profilePhotoUrl || ""} alt={user.name} />
                  <AvatarFallback className="bg-crimson-100 text-crimson-700">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={handleProfileClick}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
