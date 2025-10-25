import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem("registeredUser", JSON.stringify({ email, password }));
    toast.success("Registered successfully!");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg">
          Register
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-purple-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
