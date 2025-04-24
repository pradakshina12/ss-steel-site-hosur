
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const { user, profile, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user || !profile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {profile.first_name} {profile.last_name}
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
