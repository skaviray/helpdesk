import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "./lib/auth-client";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { data: session, isPending } = useSession();

  if (isPending) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
