import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import axios from "axios";
import BASE_URL from "utils/BASE_URL";

import { useSelector } from "react-redux";
import { useState } from "react";
import QrReader from "react-qr-scanner";

const FormCreate = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.userState.token);
  const engineer = useSelector((state) => state.userState.engineer._id);
  const [scanOpen, setScanOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [scanning, setScanning] = useState(false); // New state variable

  const handleScan = (data) => {
    if (data && data.text !== scannedResult) {
      setScannedResult(data.text);
      setScanning(false); // Stop scanning after successful scan
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values);
    console.log(engineer);
    
    const data = { ...values, engineer };
    data.deviceNumber = scannedResult.length >0 ? scannedResult : values.deviceNumber
    
    console.log(data);

    try {
      const response = await axios.post(`${BASE_URL}/device/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSubmitProps.resetForm();
    } catch (error) {
      console.log(error);
      // Handle error appropriately
    }
  };

  const handleQRScanOpen = () => {
    setScanOpen(true);
    setScanning(true); // Start scanning
  };

  return (
    <Box m="20px">
      <Header title="ADD DEVICE" subtitle="Add a New Device into Inventory" />

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
                value={scannedResult || values.deviceNumber} // Use scannedResult if available, otherwise use formik values
                name="deviceNumber"
                error={!!touched.deviceNumber && !!errors.deviceNumber}
                helperText={touched.deviceNumber && errors.deviceNumber}
                sx={{ gridColumn: "span 4" }}
              />

              <Button
                color="secondary"
                variant="contained"
                onClick={handleQRScanOpen}
              >
                QR Scan
              </Button>

              {scanOpen && scanning && (
                <QrReader
                  delay={100}
                  style={previewStyle}
                  onError={handleError}
                  onScan={handleScan}
                />
              )}

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
              <Button type="submit" color="secondary" variant="contained">
                Create New Device
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  deviceName: yup.string().required("required"),
  // deviceNumber: yup.string().required("required"),
  internalNumber: yup.number().required("required"),
});
const initialValues = {
  deviceName: "",
  // deviceNumber: "",
  internalNumber: "",
};

export default FormCreate;