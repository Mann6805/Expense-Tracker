import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Input from '../../components/inputs/Input';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {

  const [profilePic, setprofilePic] = useState(null);
  const [fullname, setfullname] = useState("");
  const [email,setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault()

    let profileImageUrl = "";

    if(!fullname){
      seterror("Please enter your fullname.");
      return
    }

    if(!validateEmail(email)){
      seterror("Please enter a valid email address.");
      return
    }

    if(!password){
      seterror("Please enter a password.");
      return;
    }

    seterror("");

    // SignUp API Call
    try{

      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      console.log({
        fullname,
        email,
        password,
        profileImageUrl
      });

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullname,
        email,
        password,
        profileImageUrl
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    }
    catch (error) {
      if (error.response && error.response.data.message) {
        console.error("Signup error response:", error.response?.data);
        seterror(error.response.data.message);
      }
      else {
        seterror("Something went wrong. Please try again.");
      }
    }
  };
  
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setprofilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullname}
              onChange={({target}) => setfullname(target.value)}
              label="Full Name" 
              placeholder="user"
              type="text"
            />
            
            <Input
              value={email}
              onChange={({target}) => setemail(target.value)}
              label="Email Address" 
              placeholder="user@example.com"
              type="text"
            />
          </div>

          <div className='col-span-2'>
            <Input
              value={password}
              onChange={({target}) => setpassword(target.value)}
              label="Password" 
              placeholder="Min 8 characters"
              type="password"
            />
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            SIGNUP
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to='/login'>
              Login
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp