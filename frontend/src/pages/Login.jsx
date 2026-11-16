import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (err) {
  console.log("LOGIN ERROR:", err.response?.data || err.message);

  setError(
    err.response?.data?.message || err.message || "Login failed"
  );
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">TaskFlow</h1>
          <p className="text-gray-400 mt-2">
            Welcome back! Login to your account.
          </p>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?
          <Link to="/register" className="text-blue-500 ml-2 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;