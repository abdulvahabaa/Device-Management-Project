import { Box, IconButton, Typography } from "@mui/material";
import Header from "../../../components/Header";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import BASE_URL from "utils/BASE_URL";
import InitialCheackModal from "components/InitialCheackModal";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DeleteDeviceModal from "components/DeleteDeviceModal";
import { useNavigate } from "react-router-dom";
import { setLogout } from "state/engineerState";
import EditDeviceModal from "components/EditDeviceModal";

const Uncheacked = () => {
  const token = useSelector((state) => state.userState.token);
  const [deviceId, setDeviceId] = React.useState("");
  const [deviceName, setDeviceName] = React.useState("");
  const [deviceNmumber, setDeviceNumber] = React.useState("");
  const [internalNumber, setInternalNumber] = React.useState("");
  const [uncheacked, setUnCheacked] = React.useState([]);
  const [isReport, setIsReport] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [refetch, setRefetch] = React.useState(false);

  React.useEffect(() => {
    axios
      .get(`${BASE_URL}/device/unchecked`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setUnCheacked(res.data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response.data.error);
        if (error.response.data.error === "Access Token Expired") {
          dispatch(setLogout());
          navigate("/");
        }
      });
  }, [refetch, navigate]);

  const handleInitialCheck = (deviceId) => {
    setIsReport(true);
    setDeviceId(deviceId);
  };

  const handleEditDevice = (
    deviceId,
    deviceName,
    deviceNumber,
    internalNumber
  ) => {
    setIsUpdate(true);
    setDeviceId(deviceId);
    setDeviceName(deviceName);
    setDeviceNumber(deviceNumber);
    setInternalNumber(internalNumber);
  };

  const handleRefresh = () => {
    setRefetch(!refetch);
  };

  return (
    <Box m="20px">
      <Header
        title="Unchecked Devices"
        subtitle="Managing the initial Checks for Devices"
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {isReport && (
          <InitialCheackModal
            setIsReport={setIsReport}
            deviceId={deviceId}
            isReported={true}
            handleRefresh={handleRefresh}
            setUnCheacked={setUnCheacked}
          />
        )}
        {isUpdate && (
          <EditDeviceModal
            setIsUpdate={setIsUpdate}
            deviceId={deviceId}
            deviceName={deviceName}
            deviceNumber={deviceNmumber}
            internalNumber={internalNumber}
            isEdit={true}
            handleRefresh={handleRefresh}
          />
        )}

        {uncheacked.map((item) => (
          <Card key={item._id} sx={{ maxWidth: 350 }}>
            <CardActionArea>
              <CardContent>
                <IconButton
                  sx={{ color: "yellow" }}
                  onClick={() => {
                    handleEditDevice(
                      item._id,
                      item.deviceName,
                      item.deviceNumber,
                      item.internalNumber
                    );
                  }}
                >
                  <EditNoteOutlinedIcon />
                </IconButton>

                <Typography
                  gutterBottom
                  variant="h5"
                  color="lightskyblue"
                  component="div"
                >
                  ID : {item._id}
                </Typography>
                <Typography variant="h4" color="secondary">
                  Device Name : {item.deviceName}
                </Typography>
                <Typography variant="h4" color="orange">
                  Internal Number : {item.internalNumber}
                </Typography>
                <Typography variant="h4" color="orange">
                  Device Number : {item.deviceNumber}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button
                size="small"
                type="submit"
                color="secondary"
                variant="contained"
                onClick={() => handleInitialCheck(item._id)}
              >
                Initial Check
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Uncheacked;
