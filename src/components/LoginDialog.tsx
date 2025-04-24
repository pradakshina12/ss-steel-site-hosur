
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";

const LoginDialog = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
      setIsDialogOpen(false);
    }
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
    setIsDialogOpen(false);
  };

  if (user) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            {profile ? `${profile.first_name || 'User'}` : 'Account'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Account</DialogTitle>
            <DialogDescription>
              {profile?.role === 'admin' ? 'Admin Account' : 'Customer Account'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={navigateToDashboard} className="w-full">
              Go to Dashboard
            </Button>
            <Button onClick={handleAuthAction} variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <LogIn className="h-4 w-4" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to SS Steel</DialogTitle>
          <DialogDescription>
            Sign in to your account to manage orders and view inventory.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={() => {
            navigate("/auth");
            setIsDialogOpen(false);
          }} className="w-full">
            Continue to Sign In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
