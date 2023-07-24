import Navbar from "./Navbar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AlternateEmail from "@mui/icons-material/AlternateEmail";
import Button from "@mui/material/Button";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import LockIcon from "@mui/icons-material/Lock";

// Utils import
import { sendRequest } from "../utils/signupUtil.js";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/signupUtil.js";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const formData = {
    email: values.email,
    password: values.password,
  };

  const handleLogin = async () => {
    setEmailErr("");
    setPasswordErr("");
    const response = await sendRequest(formData, `${BASE_URL}/login`, "POST");
    console.log(response);
    if (response.success) {
      // <Navigate to={"/dashboard"} />;
      navigate("/dashboard");
      console.log("Navigating to dashboard");
    }
    if (response.failed) {
      setEmailErr("Incorrect Details");
      setPasswordErr("Incorrect Details");
    }
    if (response.err) {
      setEmailErr("Some internal error occured...");
    }
  };

  return (
    <>
      <Navbar />
      <form method="post" onSubmit={(e) => e.preventDefault()}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <AlternateEmail sx={{ color: "action.active", mr: 1, mt: 3 }} />
            <TextField
              id="input-with-sx"
              type={"email"}
              required
              name="email"
              label="Email"
              variant="standard"
              sx={{ width: "30%" }}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              {...(emailErr && { error: true, helperText: passwordErr })}
            />
          </Box>
          <Box>
            <LockIcon sx={{ color: "action.active", mt: 4 }} />
            <FormControl sx={{ m: 1, width: "30%" }} variant="standard">
              <TextField
                variant="standard"
                label="Password"
                name="password"
                required
                type={"password"}
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                {...(passwordErr && { error: true, helperText: passwordErr })}
              />
            </FormControl>
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{ width: "100px" }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default Login;
