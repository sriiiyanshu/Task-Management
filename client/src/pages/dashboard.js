import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isAuthenticated, getUserFromToken, removeToken } from "@/utils/auth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Get user info from token - wrap in function to avoid direct setState
    const loadUser = () => {
      const userInfo = getUserFromToken();
      setUser(userInfo);
    };
    loadUser();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Task Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-blue-900">
                <strong>✅ Authentication Successful!</strong>
              </p>
              <p className="text-blue-700 mt-2">
                You are now logged in and your JWT token is stored securely.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-900">
                <strong>User Information:</strong>
              </p>
              <div className="mt-2 text-green-800 space-y-1">
                <p>📧 Email: {user.email}</p>
                <p>👤 Name: {user.name}</p>
                <p>🆔 User ID: {user.id}</p>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
              <p className="text-purple-900">
                <strong>🚀 Next Steps:</strong>
              </p>
              <ul className="mt-2 text-purple-800 space-y-1 list-disc list-inside">
                <li>Build task list components</li>
                <li>Create task creation form</li>
                <li>Add filtering and search UI</li>
                <li>Implement task editing and deletion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
