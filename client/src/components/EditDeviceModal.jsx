import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { TextField, Typography } from "@mui/material";
import BASE_URL from "utils/BASE_URL";
import { useSelector } from "react-redux";
import axios from "axios";

function EditDeviceModal({
  setIsUpdate,
  deviceId,
  deviceName,
  deviceNumber,
  internalNumber,
  isEdit = false,
  handleRefresh,
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const token = useSelector((state) => state.userState.token);

  const [deviceNam, setDeviceNam] = useState(deviceName);
  const [deviceNumb, setDeviceNumb] = useState(deviceNumber);
  const [internalNumb, setInternalNumb] = useState(internalNumber);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDevice = async () => {
    try {
      const formData = new FormData();
      formData.append("deviceId", deviceId);
      formData.append("deviceNumber", deviceNumb);
      formData.append("deviceName", deviceNam);
      formData.append("internalNumber", internalNumb);

      const Data = {
        deviceId,
        deviceNumber: deviceNumb,
        deviceName: deviceNam,
        internalNumber: internalNumb,
      };

      console.log("formData>>>", Data);

      const response = await axios.put(`${BASE_URL}/device/edit`, Data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const posts = response.data;
      console.log(posts);
      handleRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => {
          setIsUpdate(false);
          handleClose();
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <Typography
            variant="h6"
            style={{ fontSize: "24px", color: "yellow" }}
          >
            Edit Device information
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="text"
            label="Device Name"
            value={deviceNam}
            name="deviceName"
            onChange={(e) => {
              setDeviceNam(e.target.value);
            }}
            style={{
              border: "1px solid red",
              color: "red",
              padding: "8px",
              borderRadius: "4px",
              marginTop: "10px", // Add the margin-top value here
            }}
          />
          <TextField
            fullWidth
            type="text"
            label="Device Number"
            value={deviceNumb}
            name="deviceNumber"
            onChange={(e) => {
              setDeviceNumb(e.target.value);
            }}
            style={{
              border: "1px solid red",
              color: "red",
              padding: "8px",
              borderRadius: "4px",
              marginTop: "10px", // Add the margin-top value here
            }}
          />
          <TextField
            fullWidth
            type="Number"
            label="Internal Number"
            value={internalNumb}
            name="internalNumber"
            onChange={(e) => {
              setInternalNumb(e.target.value);
            }}
            style={{
              border: "1px solid red",
              color: "red",
              padding: "8px",
              borderRadius: "4px",
              marginTop: "10px", // Add the margin-top value here
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            sx={{ backgroundColor: "blue", color: "white" }}
          >
            Disagree
          </Button>
          <Button
            type="submit"
            onClick={() => {
              handleDevice();
              setIsUpdate(false);
              handleClose();
            }}
            autoFocus
            sx={{ backgroundColor: "green", color: "white" }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditDeviceModal;
