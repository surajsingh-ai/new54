import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Home, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">{title}</h1>
          <p className="text-sm text-muted-foreground">Manage your store</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            View Store
          </Button>
          
          <div className="flex items-center gap-3 px-3 py-1.5 bg-secondary/50 rounded-lg">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user?.email}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSignOut}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
