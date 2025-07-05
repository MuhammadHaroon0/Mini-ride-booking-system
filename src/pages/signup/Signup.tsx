import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";

type FormError = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

type UserType = 'customer' | 'driver';

const Signup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState<UserType>('customer');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<FormError>({});

  const validateForm = () => {
    const newErrors: FormError = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password doesn't match with password";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name as keyof FormError]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {

      const requestData = {
        ...formData,
        userType
      };

      await axios.post("/api/auth/register", requestData);
      toast.success(`${userType === 'driver' ? 'Driver' : 'Customer'} account created successfully!`);
      navigate("/auth/login");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error ?? `Something went wrong with ${userType} registration.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-4 lg:p-0 mt-8">
      <div className="flex w-full sm:w-8/12 lg:w-[840px] rounded-[30px] overflow-hidden">
        <div className="hidden lg:flex flex-1 bg-primary justify-center items-center text-white flex-col">
          <h1 className="text-6xl font-smooch-sans font-extrabold tracking-wider mb-5">
            Summit
          </h1>
          <p className="text-lg font-medium mb-2">
            Your gateway to curated search
          </p>
          <p className="text-sm">Access, manage, contribute to the community</p>
        </div>

        <div className="flex-1 px-8 py-12 bg-white shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

          <div className="mb-6">
            <div className="flex shadow-xs bg-secondary border border-gray-300 rounded-lg shadow p-1">
              <button
                type="button"
                onClick={() => handleUserTypeChange('customer')}
                className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${userType === 'customer'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sign up as Customer
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('driver')}
                className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${userType === 'driver'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sign up as Driver
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="rounded-md shadow-xs bg-secondary border border-gray-300 focus:border-primary block text-black w-full px-5 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="rounded-md shadow-xs bg-secondary border border-gray-300 focus:border-primary block text-black w-full px-5 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="rounded-md shadow-xs bg-secondary border border-gray-300 focus:border-primary block text-black w-full px-5 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
            <div className="mb-4">
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="rounded-md shadow-xs bg-secondary border border-gray-300 focus:border-primary block text-black w-full px-5 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
            </div>
            <p className="mb-4 text-sm">Already have an account?{" "}
              <span>
                <Link to={'/auth/login'}>
                  Signin
                </Link>
              </span>
            </p>
            <Button
              label={isSubmitting ? `Creating ${userType} Account...` : `Create ${userType === 'driver' ? 'Driver' : 'Customer'} Account`}
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex-1"
              disabled={isSubmitting}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;