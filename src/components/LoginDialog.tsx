
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
import { LogIn, LogOut } from "lucide-react";

const LoginDialog = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  if (user) {
    return (
      <Button variant="outline" onClick={handleAuthAction} className="gap-2">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    );
  }

  return (
    <Dialog>
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
          <Button onClick={() => navigate("/auth")} className="w-full">
            Continue to Sign In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
