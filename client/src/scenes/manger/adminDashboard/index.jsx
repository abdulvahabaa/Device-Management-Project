import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "utils/BASE_URL";

const AdminDashbord = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.userState.token);
  const adminToken = useSelector((state) => state.adminState.adminToken);

  const [dash, setDash] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const accessToken = token || adminToken;
    // console.log("adminToken",adminToken)
    // console.log("accessToken",accessToken)

    axios
      .get(`${BASE_URL}/device/feed`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res);
        setDash(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  useEffect(() => {
    const setDash = () => {
      const newRows = dash.map((dash) => ({
        // id: `${live._id}-${index}`,
        deviceId: dash._id,
        deviceName: dash.deviceName,
        deviceNumber: dash.deviceNumber,
        internalNumber: dash.internalNumber,
        engineer: dash.engineer,
        complaints: dash.checks,
        status:dash.status,
      }));
      setRows(newRows);
    };

    setDash();
  }, [dash]);

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
      <Header title="Dashboard" subtitle="List of All devices and its Current Staus" />
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




export default AdminDashbord;

