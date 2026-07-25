import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import { toast } from 'react-toastify'

const AdminLogin = () => {
  const [PhoneNoAsUser, setPhoneNoAsUser] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await authService.adminLogin({ PhoneNoAsUser, password })
      localStorage.setItem("token", res.token)
      localStorage.setItem("role", "admin") // Set role to distinguish from normal user
      toast.success("Welcome, Administrator")
      navigate("/admin/dashboard")
    } catch (err: any) {
      toast.error(err.message || "Unauthorized")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <form onSubmit={handleAdminLogin} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 font-bold">Please verify your credentials</p>
        </div>

        <div className="space-y-4">
          <input 
            type="number" placeholder="Admin PhoneNumber" required
            className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            onChange={(e) => setPhoneNoAsUser(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition">
            Login to Dashboard
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminLogin