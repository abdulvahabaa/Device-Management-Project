import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../state/engineerState";
import BASE_URL from "../../../utils/BASE_URL";
import axios from "axios";

const signupSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesSignup = {
  name: "",
  email: "",
  password: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isSignup = pageType === "signup";

  const signup = async (values, onSubmitProps) => {
    const userData = {
      name: values.name,
      email: values.email,
      password: values.password
    };
  
    try {
      const savedEngineerResponse = await axios.post(`${BASE_URL}/auth/signup`, userData);
      console.log(savedEngineerResponse);
  
      onSubmitProps.resetForm();
  
      if (savedEngineerResponse) {
        setPageType("login");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await axios.post(`${BASE_URL}/auth/login`, values);

    onSubmitProps.resetForm();

    if (loggedInResponse) {
      console.log(loggedInResponse);
      dispatch(
        setLogin({
          engineer: loggedInResponse.data.engineer,
          token: loggedInResponse.data.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isSignup) await signup(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesSignup}
      validationSchema={isLogin ? loginSchema : signupSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isSignup && (
              <>
                <TextField
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={Boolean(touched.name) && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: "yellow",
                color: "primary",
                "&:hover": { color: "cyan" },
              }}
            >
              {isLogin ? "LOGIN" : "SIGNUP"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "signup" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: "orange",
                "&:hover": {
                  cursor: "pointer",
                  color: "green",
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
