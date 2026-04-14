import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "../lib/auth-client";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setError("");

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message || "Invalid email or password");
      return;
    }

    navigate("/");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-md p-8 bg-white rounded-lg shadow-md"
        noValidate
      >
        <h1 className="text-2xl font-bold text-center mb-2">Sign In</h1>
        <div>
          <input
            type="email"
            placeholder="Email"
            className={`w-full px-3 py-3 border rounded-md text-base ${
              errors.email
                ? "border-red-500 ring-2 ring-red-200"
                : "border-gray-300"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className={`w-full px-3 py-3 border rounded-md text-base ${
              errors.password
                ? "border-red-500 ring-2 ring-red-200"
                : "border-gray-300"
            }`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-1/2 self-center py-3 bg-blue-600 text-white rounded-md text-base hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
