import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "utils/BASE_URL";
import { useNavigate } from "react-router-dom";
import { setLogout } from "state/engineerState";

const Live = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.userState.token);
  const adminToken = useSelector((state) => state.adminState.adminToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [live, setLive] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const accessToken = token || adminToken;

    axios
      .get(`${BASE_URL}/device/live`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res);
        setLive(res.data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response.data.error);
        if (error.response.data.error === "Access Token Expired") {
          dispatch(setLogout());
          navigate("/");
        }
      });
  }, [token, navigate]);

  useEffect(() => {
    const setLive = () => {
      const newRows = live.map((live) => ({
        deviceId: live._id,
        deviceName: live.deviceName,
        deviceNumber: live.deviceNumber,
        internalNumber: live.internalNumber,
        engineer: live.engineer,
        complaints: live.checks,
        status: live.status,
      }));
      setRows(newRows);
    };

    setLive();
  }, [live]);

  const columns = [
    { field: "deviceId", headerName: "ID", flex: 1 },
    {
      field: "deviceName",
      headerName: "Device Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "deviceNumber",
      headerName: "Device Numbr",
      flex: 1,
    },
    {
      field: "internalNumber",
      headerName: "Internal Number",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Device Status",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="Live Devices" subtitle="List of Live Devices" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-row": {
            borderBottom: `1px solid ${colors.grey[300]}`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.deviceId}
        />
      </Box>
    </Box>
  );
};

export default Live;
