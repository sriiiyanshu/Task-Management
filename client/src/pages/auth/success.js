import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setToken } from "@/utils/auth";

export default function AuthSuccess() {
  const router = useRouter();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Get token from URL query parameter
        const { token } = router.query;

        // Wait for router to be ready
        if (!router.isReady) return;

        if (token) {
          // Save token to localStorage
          setToken(token);
          setStatus("success");

          // Small delay for user feedback, then redirect
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        } else {
          // No token found - redirect to login with error
          setStatus("error");
          setTimeout(() => {
            router.push("/login?error=no_token");
          }, 2000);
        }
      } catch (error) {
        console.error("Error processing authentication:", error);
        setStatus("error");
        setTimeout(() => {
          router.push("/login?error=auth_failed");
        }, 2000);
      }
    };

    handleAuthSuccess();
  }, [router, router.isReady, router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">
        {status === "processing" && (
          <>
            {/* Loading Spinner */}
            <div className="mb-6 flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Signing you in...</h2>
            <p className="text-gray-600">Please wait while we process your authentication</p>
          </>
        )}

        {status === "success" && (
          <>
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">Redirecting back to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
