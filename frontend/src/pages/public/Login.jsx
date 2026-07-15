import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/";

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Easter Egg: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/admin-secure/login");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginService({ email, password });

      // Validamos estrictamente que sea un CLIENTE
      if (response.rol !== "CLIENTE") {
        setError("Acceso denegado. Exclusivo para clientes.");
        setLoading(false);
        return;
      }

      login(response);
      navigate(from);
    } catch (err) {

      setError(
        err.response?.data?.message || "Credenciales incorrectas. Intente de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <LogIn className="mx-auto h-10 w-10 text-violet-600" />
          <h1 className="mt-2 text-2xl font-bold text-gray-800">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-gray-500">
            Ingrese sus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <Alerta message={error} type="error" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Boton type="submit" disabled={loading} className="w-full">
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Boton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
