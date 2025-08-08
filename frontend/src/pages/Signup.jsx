import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup({ setToken }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !mobile || !password) {
      setMessageType("error");
      setMessage("All fields are required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessageType("error");
      setMessage("Please enter a valid email address!");
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      setMessageType("error");
      setMessage("Please enter a valid 10-digit mobile number!");
      return;
    }

    try {
      const res = await fetch("/api/taskTrac/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType("success");
        setMessage("Signup successful! Redirecting...");
        localStorage.setItem("token", data.data);
        setToken(data.data);
        setTimeout(() => navigate("/dashboard"), 1000); // UX delay
      } else {
        setMessageType("error");
        setMessage(data.message || "Signup failed. Please try again.");
      }
    } catch {
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
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          />

          <input
            type="text"
            placeholder="Mobile Number"
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
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
