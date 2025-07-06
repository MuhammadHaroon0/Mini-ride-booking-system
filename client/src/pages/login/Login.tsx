import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useAuthStore from "../../stores/authStore";

type LoginFormInputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type FormErrors = {
  email?: string;
  password?: string;
};

const Login = () => {
  const navigate = useNavigate()
  const { login, user } = useAuthStore()
  if (user && user.role === "driver")
    navigate("/ride-requests")
  else if (user)
    navigate("/request-a-ride")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormInputs>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(formData)
      toast.success("Success!");
      if (user.role === "driver")
        navigate("/ride-requests");
      else
        navigate("/request-a-ride");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response.data.message || "Something went wrong during login");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center h-full p-4 lg:p-0 my-8">
      <div className="flex w-full sm:w-8/12 lg:w-[840px] rounded-[30px] overflow-hidden">
        <div className="hidden lg:flex flex-1 bg-primary justify-center items-center text-white flex-col">
          <h1 className="text-6xl font-smooch-sans font-extrabold tracking-wider mb-5">
            Worldly
          </h1>
          <p className="text-lg font-medium mb-2">
            Your gateway to peaceful journey
          </p>
          <p className="text-sm">Request, manage, and enjoy seamless rides.</p>
        </div>

        <div className="flex-1 px-8 py-16 bg-white">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
          <form onSubmit={onSubmit}>
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
                  className="shadow-xs bg-secondary border border-gray-300 rounded-md focus:border-primary   block text-black w-full px-5 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
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
                  className=" shadow-xs bg-secondary border border-gray-300 focus:border-primary rounded-md block text-black w-full px-5 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>



            <div className="mb-6 text-center">
              <a href="#" className="text-sm text-secondary hover:underline font-bold">
                Forgot password?
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                label={isLoading ? "Signing In..." : "Sign In"}
                disabled={isLoading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex-1"
              />


              <Link
                to={'/auth/signup'}
                className=" bg-secondary border border-gray-300 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-xs border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;