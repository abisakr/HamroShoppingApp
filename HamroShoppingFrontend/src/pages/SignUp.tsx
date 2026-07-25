import React, { useState } from 'react'
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { signup } from '../store/authSlice'
import FormInput from '../components/FormInput'
import { AppDispatch, RootState } from '../store'
import { validators } from '../utils/helpers'

interface SignUpFormData {
  fullName: string
  phoneNo: string
  email: string
  address: string
  city: string
  country: string
  password: string
  confirmPassword: string
}

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [data, setData] = useState<SignUpFormData>({
    fullName: '',
    phoneNo: '',
    email: '',
    address: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({})
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {}

    if (!data.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!data.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required'
    }

    if (!validators.isValidEmail(data.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!data.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!data.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!data.country.trim()) {
      newErrors.country = 'Country is required'
    }

    if (!validators.isValidPassword(data.password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!validators.arePasswordsMatching(data.password, data.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const result = await dispatch(
        signup({
          fullName: data.fullName,
          phoneNo: data.phoneNo,
          email: data.email,
          address: data.address,
          city: data.city,
          country: data.country,
          password: data.password,
        })
      )

      if (signup.fulfilled.match(result)) {
        toast.success('Account created successfully!')
        navigate('/')
      } else {
        toast.error(error || 'Sign up failed')
      }
    } catch (err) {
      toast.error('Something went wrong, please try again.')
    }
  }

  const passwordStrength = {
    hasLength: data.password.length >= 8,
    hasUppercase: /[A-Z]/.test(data.password),
    hasLowercase: /[a-z]/.test(data.password),
    hasNumber: /[0-9]/.test(data.password),
  }

  const strengthScore =
    Object.values(passwordStrength).filter(Boolean).length

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl customShadow-md p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl font-bold text-foreground">Create Account</h1>
            <p className="text-gray-600">Join us and start shopping today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
            <FormInput
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={data.fullName}
              onChange={handleOnChange}
              error={errors.fullName}
              required
              disabled={isLoading}
            />

            <FormInput
              label="Phone Number"
              type="tel"
              name="phoneNo"
              placeholder="1234567899"
              value={data.phoneNo}
              onChange={handleOnChange}
              error={errors.phoneNo}
              required
              disabled={isLoading}
            />

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={handleOnChange}
              error={errors.email}
              required
              disabled={isLoading}
            />

            <FormInput
              label="Address"
              type="text"
              name="address"
              placeholder="123 Main Street"
              value={data.address}
              onChange={handleOnChange}
              error={errors.address}
              required
              disabled={isLoading}
            />

            <FormInput
              label="City"
              type="text"
              name="city"
              placeholder="New York"
              value={data.city}
              onChange={handleOnChange}
              error={errors.city}
              required
              disabled={isLoading}
            />

            <FormInput
              label="Country"
              type="text"
              name="country"
              placeholder="United States"
              value={data.country}
              onChange={handleOnChange}
              error={errors.country}
              required
              disabled={isLoading}
            />

            <FormInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create a strong password"
              value={data.password}
              onChange={handleOnChange}
              error={errors.password}
              required
              disabled={isLoading}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />

            {/* Password Strength Indicator */}
            {data.password && (
              <div className="space-y-2">
                <div className="flex gap-1 h-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition ${
                        i < strengthScore
                          ? strengthScore < 2
                            ? 'bg-error'
                            : strengthScore < 4
                              ? 'bg-warning'
                              : 'bg-success'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasLength ? (
                      <FaCheck className="text-success" />
                    ) : (
                      <FaTimes className="text-gray-300" />
                    )}
                    <span
                      className={
                        passwordStrength.hasLength ? 'text-success' : 'text-gray-400'
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasUppercase ? (
                      <FaCheck className="text-success" />
                    ) : (
                      <FaTimes className="text-gray-300" />
                    )}
                    <span
                      className={
                        passwordStrength.hasUppercase ? 'text-success' : 'text-gray-400'
                      }
                    >
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasLowercase ? (
                      <FaCheck className="text-success" />
                    ) : (
                      <FaTimes className="text-gray-300" />
                    )}
                    <span
                      className={
                        passwordStrength.hasLowercase ? 'text-success' : 'text-gray-400'
                      }
                    >
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasNumber ? (
                      <FaCheck className="text-success" />
                    ) : (
                      <FaTimes className="text-gray-300" />
                    )}
                    <span className={passwordStrength.hasNumber ? 'text-success' : 'text-gray-400'}>
                      One number
                    </span>
                  </div>
                </div>
              </div>
            )}

            <FormInput
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={data.confirmPassword}
              onChange={handleOnChange}
              error={errors.confirmPassword}
              required
              disabled={isLoading}
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />

            {error && <div className="p-3 bg-error/10 border border-error text-error rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold rounded-lg btn-transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            to="/login"
            className="w-full px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg btn-transition text-center block"
          >
            Sign In Instead
          </Link>

          {/* Terms */}
          <div className="text-center text-xs text-gray-600">
            <p>
              By creating an account, you agree to our{' '}
              <Link to="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUp
