import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

import Input from "../../components/ui/Input";
import Boton from "../../components/ui/Boton";
import Alerta from "../../components/ui/Alerta";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/authService";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Campos incompletos.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginService({ email, password });
      const rol = response.rol; // Asumiendo que el loginService devuelve el rol

      if (rol !== "ADMIN") {
        setError("Acceso denegado. Portal exclusivo para administración central.");
        return;
      }

      login(response);
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Credenciales de administrador inválidas.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 font-sans">
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

      <div className="w-full max-w-md rounded-2xl bg-[#171717] p-10 shadow-2xl border border-red-900/30">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sistema Restringido
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Identificación requerida nivel A-1
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <Alerta message={error} type="error" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Identificador (Email)
            </label>
            <Input
              type="email"
              placeholder="admin@pochitastore.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#262626] border-none text-white focus:ring-red-500 placeholder-gray-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Código de Acceso
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#262626] border-none text-white focus:ring-red-500 placeholder-gray-600"
            />
          </div>

          <Boton
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40 border-none transition-all py-3 font-semibold mt-2"
          >
            {loading ? "Verificando..." : "Autorizar Ingreso"}
          </Boton>
        </form>
      </div>

      {/* Elementos decorativos */}
      <div className="fixed bottom-6 left-6 text-gray-600 text-xs font-mono tracking-widest">
        POCHITA-SECURE-NODE-01
      </div>
    </main>
  );
}

export default AdminLogin;
