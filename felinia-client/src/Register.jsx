import { useState } from "react";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    // Mock registrazione – puoi integrare backend in seguito
    localStorage.setItem("token", "mock-token");
    onRegister({ email });
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Registrati a FelinIA</h2>
      <form onSubmit={handleRegister} className="space-y-4">
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
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Registrati
        </button>
        <p className="text-sm text-center">
          Hai già un account?{" "}
          <button type="button" onClick={onRegister} className="text-blue-600 underline">
            Accedi
          </button>
        </p>
      </form>
    </div>
  );
}
