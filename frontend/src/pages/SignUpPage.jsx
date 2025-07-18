import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { MessageSquare, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern.jsx';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData,setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { signup, isSigningup } = useAuthStore();
  
  const validateForm = () => {
    if(!formData.username.trim()) return toast.error("Username Required");
    if(!formData.email.trim()) return toast.error("Email Required");
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid Email");
    if(!formData.password) return toast.error("Password Required");
    if(formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if(success === true) signup(formData);
  };


  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        {/* LOGO */}
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">

              <div className="flex flex-col items-center gap-2 group">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center 
                justify-center group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className='size-6 text-primary'/>
                </div>
                <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
                <p className='text-base-content/60'>Get Started with your free account</p>
              </div> 
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6 w-1/2">
            <div className="form-control">
              <label className='label'>
                <span className='label-text font-medium'>Username</span>
              </label>
              <div className="relative">
                <div className='absolute z-10 pt-2.5 pl-1'>
                <User className='size-5 text-base-content/40'/>   
                </div>
                
                <input 
                  type="text"
                  className={`input input-bordered w-full pl-8`}
                  placeholder="Ningz"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="form-control">
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className="relative w-full">
                <div className='absolute z-10 pt-2.5 pl-1'>
                <Mail className='size-5 text-base-content/40'/>   
                </div>
                <input 
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-control">
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className="relative w-full">
                <div className='absolute z-10 pt-2.5 pl-1'>
                <Lock className='size-5 text-base-content/40'/>   
                </div>
                <div>
                <input 
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="**********"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                  />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={()=> setShowPassword(!showPassword)}
                  >
                  {showPassword ? (
                    <EyeOff className='size-5 text-base-content/40'/>
                  ) : (
                    <Eye className='size-5 text-base-content/40'/>
                  )}
                </button>
                </div>
              </div>
            </div>

            <button type='submit' className='btn btn-primary w-full' disabled={isSigningup}>
                  {isSigningup ? (
                    <>
                      <Loader2 className="size-5 animate-spin"/>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
            </button>

        </form>
        <div className="text-center pt-4">
          <p className='text-base-content/60'>
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
              Sign In
              </Link>
          </p>
        </div>
      </div> 

      {/* Right Side */}
      <AuthImagePattern
        title="Join our community."
        subtitle="Connect with friends and family."
      />
    </div>
  )
}

export default SignUpPage
