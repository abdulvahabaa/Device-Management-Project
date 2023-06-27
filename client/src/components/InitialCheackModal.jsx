import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  Slide,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import BASE_URL from "utils/BASE_URL";
import axios from "axios";
// import { reportPost } from 'api/users';

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,

  bgcolor: "#8D8D8D",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function InitialCheackModal({
  isReported = false,
  setIsReport,
  deviceId,
  postUserId,
}) {
  // const dispatch = useDispatch();
  // const user = useSelector((state) => state.userState.user);
  const token = useSelector((state) => state.userState.token);
  const [data, setData] = useState({});
  // const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setIsReport(false);
    setOpen(false);
  };
  console.log(deviceId);

  useEffect(() => {
    if (isReported) {
      handleOpen();
    }
  }, [isReported]);

  const checkButton = () => {
    if (
      data["mic"] == "passed" &&
      data["camera"] == "passed" &&
      data["sensor"] == "passed"
    ) {
      return true;
    }
    return false;
  };

  const forwardToMaintanance = async () => {
    const formData = { deviceId, ...data };
    try {
      await axios.patch(`${BASE_URL}/device/forwardmaitance`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const forwardToProducton = async()=>{
    const id = deviceId 
    console.log("deviceId",deviceId)

    try {

      await axios.patch(`${BASE_URL}/device/toproduction`, deviceId, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      <Modal
        sx={{ marginTop: "150px" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Mic</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="mic"
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
            >
              <FormControlLabel
                value="passed"
                control={<Radio />}
                label="pass"
              />
              <FormControlLabel
                value="failed"
                control={<Radio />}
                label="failed"
              />
            </RadioGroup>

            <FormLabel id="demo-row-radio-buttons-group-label">
              camera
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="camera"
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
            >
              <FormControlLabel
                value="passed"
                control={<Radio />}
                label="pass"
              />
              <FormControlLabel
                value="failed"
                control={<Radio />}
                label="failed"
              />
            </RadioGroup>

            <FormLabel id="demo-row-radio-buttons-group-label">
              Sensor
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="sensor"
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
            >
              <FormControlLabel
                value="passed"
                control={<Radio />}
                label="pass"
              />
              <FormControlLabel
                value="failed"
                control={<Radio />}
                label="failed"
              />
            </RadioGroup>

            <textarea
              rows={3}
              cols={42}
              style={{ border: "none" }}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              name="review"
              // value={postContent}
              placeholder="write something!!"
            />
          </FormControl>

          {checkButton() ? (
            <Button
              sx={{ backgroundColor: "green", color: "white" }}
              color="secondary"
              bgcolour="blue"
              mt="2px"
              onClick={() => {
                // console.log(data);
                forwardToProducton()
                // handleReport();
                handleClose();
                // navigate('/');
              }}
            >
              Redy for production
            </Button>
          ) : (
            <Button
              sx={{ backgroundColor: "blue", color: "white" }}
              color="secondary"
              onClick={() => {
                forwardToMaintanance();

                // handleReport();
                handleClose();
                // navigate('/');
              }}
            >
              Forward to Maintainance
            </Button>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default InitialCheackModal;
