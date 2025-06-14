import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppDispatch } from "./store";
import { getCurrentUser } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./components/common/ThemeProvider";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Attempt to get the current user with the stored token
      dispatch(getCurrentUser())
        .unwrap()
        .catch((error) => {
          // If there's an error getting the current user, clear the token
          // This prevents redirect loops when token is invalid
          console.error("Error fetching current user:", error);
          localStorage.removeItem("token");
        });
    }
  }, [dispatch]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="package-tracker-theme">
      <div className="min-h-screen">
        <Toaster position="top-right" />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
