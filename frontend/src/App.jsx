import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./NotFound";
import ChatPage from "./pages/ChatPage";
import Notifications from "./pages/Notifications";
import OnboardingPage from "./pages/Onboarding";
import CallPage from "./pages/CallPage";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";
import { useAuthUser } from "./hooks/useAuthUser"; // Adjust the import path as necessary
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import Friends from "./pages/Friends";
import { useThemeStore } from "./store/useThemeStore";
const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnboarding = authUser?.isOnBoarded;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div data-theme={theme}>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarding ? (
              <Layout showSidebar>
                <Home />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : isOnboarding ? (
              <Navigate to={"/"} />
            ) : (
              <Navigate to={"/onboard"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarding ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarding ? (
              <Layout showSidebar>
                <Notifications />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboard"
          element={
            isAuthenticated ? (
              !isOnboarding ? (
                <OnboardingPage />
              ) : (
                <Navigate to={"/"} />
              )
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarding ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
            )
          }
        />

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
