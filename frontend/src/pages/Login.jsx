// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Login({setToken}) {
//     const [mobile, setMobile] = useState("9835343348");
//     const [password, setPassword] = useState("raman@123");
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         const res = await fetch("/api/taskTrac/auth/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ mobile, password })
//         });
//         const data = await res.json();   
//         if (res.ok) {
//               localStorage.setItem("token", data.data);
//               setToken(data.data);
//             navigate("/dashboard");
//         } else {
//             alert(data.message || "Login failed");
//         }
//     };

//     return (
//         <div>
//         <form onSubmit={handleLogin}>
//             <input type="mobile" placeholder="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
//             <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <button type="submit">Login</button>
//         </form>
//             <button onClick={()=>navigate("/signup")}>Signup</button>

//         </div>
//     );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const [mobile, setMobile] = useState("9835343348");
  const [password, setPassword] = useState("raman@123");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/taskTrac/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.data);
      setToken(data.data);
      navigate("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white-500 to-indigo-700">
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
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span className="text-indigo-600 cursor-pointer" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
