import React, { useState } from "react";
import { SideImage } from "./SideImage";
import { InputField } from "./InputField";
import { Button } from "./Button";
import { LoginHeader } from "./LoginHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

export function Form() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUser(); // use the login function from context
  const [isLoading, setIsLoading] = useState(false);

  const styleobj = [
    { inputtype: "text", placeholder: "Username or Email", margin: 12 },
    { inputtype: "password", placeholder: "Password", margin: 0 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://projectnest-w2tf.onrender.com/api/v2/user/login",
        {
          email: username,
          password,
        }
      );

      const user = response.data.data.user;
      const token = response.data.token;
      localStorage.setItem("token", token);

      login(user); // update the context with the logged-in user

      if (user.role === "student") {
        navigate("/app/student");
      } else if (user.role === "supervisor") {
        navigate("/app/supervisor");
      } else {
        navigate("/app/admin");
      }
    } catch (error) {
      setError("Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col md:flex-row justify-center items-center md:justify-between border-2 h-auto md:h-3/5 w-9/12 md:w-5/12 xl:w-6/12 rounded-lg bg-white text-black shadow-2xl p-4 md:p-0 lg:w-6/12"
      onSubmit={handleSubmit}
    >
      <SideImage />
      <div className="md:mt-0 mt-4 md:pr-7 flex flex-col items-center md:items-start">
        <LoginHeader />
        <div className="h-full flex flex-col gap-4 text-black md:w-full">
          <InputField
            styleobj={styleobj[0]}
            value={username}
            setValue={setUsername}
          />
          <InputField
            styleobj={styleobj[1]}
            value={password}
            setValue={setPassword}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
}
