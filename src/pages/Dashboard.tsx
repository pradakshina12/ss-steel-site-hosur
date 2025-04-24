
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const { user, profile, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      console.log("Dashboard: No user detected, redirecting to auth");
      navigate("/auth");
    }

    // Log authentication state for debugging
    console.log("Dashboard auth state:", { 
      isLoading, 
      user: user?.email,
      profile,
      isAdmin 
    });
  }, [user, isLoading, navigate, profile, isAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>You need to be logged in to access the dashboard. Redirecting to login...</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Your profile is loading or doesn't exist. If this persists, please try logging out and back in.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <p>User: {user.email}</p>
          <p>Profile loaded: No</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {profile.first_name || 'User'} {profile.last_name || ''}
      </h1>
      
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </div>
  );
};

export default Dashboard;
