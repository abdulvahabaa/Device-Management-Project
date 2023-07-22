import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import axios from "axios";
import BASE_URL from "utils/BASE_URL";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import QrReader from "react-qr-scanner";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FormCreate = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.userState.token);
  const engineer = useSelector((state) => state.userState.engineer._id);
  const [scanOpen, setScanOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleScan = (data) => {
    if (data && data.text !== scannedResult) {
      setScannedResult(data.text);
      setScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    const data = { ...values, engineer };
    data.deviceNumber =
      scannedResult.length > 0 ? scannedResult : values.deviceNumber;

    try {
      await axios.post(`${BASE_URL}/device/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSubmitProps.resetForm();
      // setSuccess(true);
      setScannedResult(""); // Reset scannedResult after successful form submission
      handleClick()
    } catch (error) {
      console.log(error);
    }
  };

  const handleQRScanOpen = () => {
    setScanOpen(true);
    setScanning(true);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box m="20px">
      <Header title="ADD DEVICE" subtitle="Add a New Device into Inventory" />
      <Box sx={{display:'flex'}}>
   


      <Box bgcolor="#9B9B9B" p="20px">

        <Typography>fill this form to create a new Device</Typography>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
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
                
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Device Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.deviceName}
                  name="deviceName"
                  error={!!touched.deviceName && !!errors.deviceName}
                  helperText={touched.deviceName && errors.deviceName}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Device Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={scannedResult || values.deviceNumber}
                  name="deviceNumber"
                  error={!!touched.deviceNumber && !!errors.deviceNumber}
                  helperText={touched.deviceNumber && errors.deviceNumber}
                  sx={{ gridColumn: "span 3" }}
                />
              
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleQRScanOpen}
                >
                  QR Scan
                </Button>

              

                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Internal Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.internalNumber}
                  name="internalNumber"
                  error={!!touched.internalNumber && !!errors.internalNumber}
                  helperText={touched.internalNumber && errors.internalNumber}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="30px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  // onClick={handleClick}
                >
                  Create New Device
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      <Box ml="30px">
      {scanOpen && scanning && (
                  <QrReader
                    delay={100}
                    style={previewStyle}
                    onError={handleError}
                    onScan={handleScan}
                  />
                )}
                </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} onExited={handleReload}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          New Device Added Successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  deviceName: yup.string().required("required"),
  internalNumber: yup.number().required("required"),
});
const initialValues = {
  deviceName: "",
  internalNumber: "",
};

export default FormCreate;