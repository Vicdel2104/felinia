import { useState } from "react";

export default function Login({ onLogin, onToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login – puoi integrare la logica reale dopo
    localStorage.setItem("token", "mock-token");
    onLogin({ email });
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Accedi a FelinIA</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Accedi
        </button>
        <p className="text-sm text-center">
          Non hai un account?{" "}
          <button type="button" onClick={onToggle} className="text-blue-600 underline">
            Registrati
          </button>
        </p>
      </form>
    </div>
  );
}
