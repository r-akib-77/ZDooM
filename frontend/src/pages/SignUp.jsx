import React from "react";
import { PiAirplaneTakeoffDuotone } from "react-icons/pi";
import heroImage from "../asset/hero.png";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const [signupData, setSignupData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  // React Query mutation for signup API call
  const {
    isPending,
    mutate: signupMutate,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      // Refetch or update the authenticated user data
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // Show toast after successful signup
      toast.success("Account created successfully!");
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutate(signupData);
  };

  return (
    <div className=" flex h-screen items-center justify-center p-4 sm:p-6 md:p-8 ">
      <div className="border border-primary/25 flex flex-col lg:flex-row items-center justify-center max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden  w-full">
        {/* left side or the form part  */}
        <div className="w-full  lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo here  */}
          <div className="flex justify-start mb-4 items-center  gap-2 ">
            <PiAirplaneTakeoffDuotone className="text-4xl text-cyan-500" />
            <span className="font-black text-4xl font-mono tracking-widest text-cyan-500">
              {" "}
              ZDooM
            </span>
          </div>
          {/* error message  */}

          {error && (
            <div className="alert alert-error mb-4 ">
              <span>{error.response?.data?.message}</span>
            </div>
          )}
          {/* form here  */}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl tracking-wider font-semibold">
                    Create an Account
                  </h2>
                  <p className="text-sm opacity-70 capitalize">
                    join us to explore the world of connectivity
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text"> Full Name</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text"> Email</span>
                    </label>

                    <input
                      type="email"
                      placeholder="ZDooM@example.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>

                    <input
                      type="password"
                      placeholder="*********"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />

                    <p className="text-sm opacity-75 capitalize">
                      your password must be 6 characters long
                    </p>
                  </div>

                  <div className="form-control ">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline  ">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4 ">
                  <p className="text-sm opacity-70 capitalize">
                    already have an account?{" "}
                    <span className="text-primary hover:underline">
                      <Link to="/login">Login</Link>{" "}
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* right side or the image part */}
        <div className="w-1/2 hidden lg:flex bg-base-200 p-4 sm:p-8">
          <img src={heroImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
