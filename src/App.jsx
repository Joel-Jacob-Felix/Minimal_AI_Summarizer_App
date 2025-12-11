import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { listenToAuth, logoutUser } from "./features/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          AI Summary App
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                className="px-3 py-1 text-sm rounded bg-red-500 text-white"
                onClick={() => dispatch(logoutUser())}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 text-sm rounded bg-blue-500 text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listenToAuth());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
