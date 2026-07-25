import React, { useState } from 'react'
import { FaEye, FaEyeSlash, FaPhone, FaLock, FaArrowRight } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../services/api'
import FormInput from '../components/FormInput'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Logic to determine where to send the user after login
  // If they came from the Cart, location.state.from will be "/cart"
  const from = location.state?.from || "/"

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    phoneNoAsUser: '',
    password: '',
  })

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authService.userLogin({
        phoneNoAsUser: data.phoneNoAsUser,
        password: data.password
      })

      // 1. Store the token and expiry
      localStorage.setItem("token", result.token)
      localStorage.setItem("token_expires", result.expires)

      toast.success('Logged in successfully!')

      // 2. Navigate back to where they wanted to go (e.g., /cart)
      navigate(from, { replace: true })
      
      // 3. Optional: Force a small refresh if your Navbar 
      // doesn't automatically detect localStorage changes
      window.dispatchEvent(new Event("storage")) 

    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8">
          
          {/* Brand/Logo Area */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto bg-blue-600 rounded-2xl rotate-12 flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-4xl text-white -rotate-12 font-black">HS</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 pt-4">Welcome Back</h1>
            <p className="text-gray-500 font-medium">Please enter your details to sign in</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FormInput
                label="Phone Number"
                type="tel"
                name="phoneNoAsUser"
                placeholder="e.g. 1234567890"
                value={data.phoneNoAsUser}
                onChange={handleOnChange}
                required
              />
              <FaPhone className="absolute right-4 top-[3.2rem] text-gray-300" />
            </div>

            <div className="relative">
              <FormInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={data.password}
                onChange={handleOnChange}
                required
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-blue-600 transition"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                }
              />
              <FaLock className="absolute right-12 top-[3.2rem] text-gray-300" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-600 font-medium">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-bold transition"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In 
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Login Mockup */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">Or continue with</span></div>
          </div>

          <button className="w-full border-2 border-gray-100 hover:bg-gray-50 py-3 rounded-xl flex items-center justify-center gap-3 transition-colors font-semibold text-gray-700">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
            Google
          </button>

          {/* Footer Link */}
          <p className="text-center text-gray-600 font-medium">
            New here?{' '}
            <Link to="/sign-up" className="text-blue-600 hover:underline font-bold">
              Create an account
            </Link>
          </p>
        </div>

        {/* Support Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Need help? <Link to="/support" className="text-gray-600 font-bold hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Login