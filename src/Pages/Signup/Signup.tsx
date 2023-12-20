import React, { FC, useEffect } from "react";
import "./SignUp.css";
import { Avatar, Button, TextInput } from "@mantine/core";
import { login } from "../../utils/fetchApi";
import { errorToast } from "../../utils/toastHelper";
import { UserContext } from "../../Context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";

const Signup: FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { user, setUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="signupBody">
      <div className="avatar">
        <div>
          <Avatar
            src={
              "https://d33g7sdvsfd029.cloudfront.net/subject/2023-01-17-0.17044360120951185.jpg"
            }
          />
          <div>100Xdevs Chat</div>
        </div>
      </div>
      <div>
        <h2 className="signUpHeading">Welcome to the cohort</h2>
        <div className="inputs">
          <TextInput
            mt="l"
            label="Email"
            placeholder="Enter your email here"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password here"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
          />
        </div>
        <div className="submit">
          <Button
            variant="filled"
            onClick={() => {
              if (!email || !password) {
                errorToast("Please enter email and password");
                return;
              }
              login(email, password)
                .then((res) => {
                  setUser(res.data.user);
                  socket.connect();
                  localStorage.setItem("user", JSON.stringify(res.data.user));
                  navigate("/");
                })
                .catch((err) => {
                  errorToast(
                    err?.response?.data?.message ||
                      err?.message ||
                      "Something went wrong"
                  );
                });
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
