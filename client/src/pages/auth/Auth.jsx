import Victory from "../../assets/victory.svg";
import signup from "../../assets/Sign up.gif";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { apiClient } from "../../lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { userAppStore } from "../../store/index";

function Auth() {
  const navigate = useNavigate();
  const { setUserInfo } = userAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }

    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }

    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }

    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }

    if (!confirmPassword.length) {
      toast.error("Confirm Password is required.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password must be the same.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(
        LOGIN_ROUTE,

        {
          email,
          password,
        },

        {
          withCredentials: true,
        }
      );

      if (response.data.data.user._id) {
        setUserInfo(response.data.data.user);
        if (response.data.data.user.profileSetup) {
          navigate("/chat");
        } else navigate("/profile");
      }

      console.log({ response });
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,

        {
          email,
          password,
        },

      );

      if (response.status === 201) {
        setUserInfo(response.data.data);
        navigate("/profile"); 
      }

      console.log({ response });
    }
  };

  return (
    <div className="auth-container h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="auth-container-bg h-[80vh] w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 bg-white border-2 border-white text-opacity-90 shadow-2xl">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex justify-center items-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="✌️" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with best chat app!
            </p>
          </div>

          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>

                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />

                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>

              <TabsContent
                className="signup-container flex flex-col gap-5 mt-10"
                value="signup"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />

                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />

                <Button
                  className="signup-button rounded-full p-6"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="hidden xl:flex justify-center items-center">
          <img src={signup} alt="background login" className="h-fit" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
