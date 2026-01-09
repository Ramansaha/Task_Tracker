import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      setMessageType("error");
      setMessage("Missing fields are required!");
      return;
    }

    try {
      const res = await fetch("/api/taskTrac/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.data);
        setToken(data.data);
        setMessageType("success");
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000); // short delay for UX
      } else {
        setMessageType("error");
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (_err) {
      setMessageType("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  const getMessageStyle = () => {
    return messageType === "success"
      ? "bg-green-100 text-green-700 border-green-400"
      : "bg-red-100 text-red-700 border-red-400";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-indigo-200">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          />

          {message && (
            <div
              className={`text-sm px-4 py-2 border rounded-md ${getMessageStyle()}`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
