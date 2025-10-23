import { useState, useContext } from "react";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e)=>{
    e.preventDefault();
    const res = await loginUser({ email, password });
    login({ role:res.data.role, name:res.data.name }, res.data.token);
    if(res.data.role==="student") navigate("/student");
    else navigate("/faculty");
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-3 w-80 mx-auto mt-20">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="p-2 border rounded" />
      <button className="bg-blue-500 text-white py-2 rounded">Login</button>
    </form>
  );
}
