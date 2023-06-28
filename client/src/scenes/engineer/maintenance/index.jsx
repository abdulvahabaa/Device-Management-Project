import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";

import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import BASE_URL from "utils/BASE_URL";
import axios from "axios";

const Maintenance = ({ isAdmin = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.userState.token);
  const [maintenance, setMaintenance] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/device/maintenance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setMaintenance(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  useEffect(() => {
    const setMaintenance = () => {
      const newRows = maintenance.map((maintenance) => ({
        // id: `${maintenance._id}-${index}`,
        deviceId: maintenance._id,
        deviceName: maintenance.deviceName,
        deviceNumber: maintenance.deviceNumber,
        internalNumber: maintenance.internalNumber,
        engineer: maintenance.engineer,
        complaints: maintenance.checks
          .map((check) => {
            const complaints = [];
            if (check.mic === "failed") {
              complaints.push("Mic");
            }
            if (check.camera === "failed") {
              complaints.push("Camera");
            }
            if (check.sensor === "failed") {
              complaints.push("Sensor");
            }
            if (check.review) {
              complaints.push(`Review: ${check.review}`);
            }

            return complaints.join(", ");
          })
          .join(", "),
      }));
      setRows(newRows);
    };

    setMaintenance();
  }, [maintenance]);

  const columns = [
    // { field: "id", headerName: "ID", flex: 0.5 },

    {
      field: "deviceName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "internalNumber",
      headerName: "Internal Number",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "deviceNumber",
      headerName: "Device Number",
      flex: 1,
    },
    {
      field: "complaints",
      headerName: "Complaints",
      flex: 3,
    },

    // {
    //   field: "dss",
    //   headerName: "Delete",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Button onClick={() => {
    //       deleteDevice(params.row.deviceId)

    //     }} variant="contained" sx={{color:"red"}}>
    //      {params.row.status === true ? "notworked" : "DELETE"}
    //     </Button>

    //   ),

    // },
    {
      field: "status",
      headerName: "Dammage Report",
      flex: 1,
      renderCell: (params) => (
        <Button
          onClick={() => {
            forwardtoDammage(params.row.deviceId);
          }}
          variant="contained"
          sx={{ color: "red" }}
        >
          {params.row.status === true ? "notworked" : "DAMMAGE"}
        </Button>
      ),
    },
    {
      field: "statuss",
      headerName: "Ready",
      flex: 1,
      renderCell: (params) => (
        <Button
          onClick={() => {
            forwardtoProduction(params.row.deviceId);
          }}
          variant="contained"
          sx={{ color: "yellow" }}
        >
          {params.row.status === true ? "notworked" : "Production"}
        </Button>
      ),
    },
  ];

  const forwardtoProduction = async (deviceId) => {
    console.log(deviceId);
    try {
      const response = await axios.patch(
        `${BASE_URL}/device/toproduction`,
        { deviceId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      console.log(data);
      // setReports(data);
      // setLoading(!loading);
    } catch (error) {
      console.error(error);
    }
  };

  const forwardtoDammage = async (deviceId) => {
    console.log(deviceId);
    try {
      const response = await axios.patch(
        `${BASE_URL}/device/todammage`,
        { deviceId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      console.log(data);
      // setReports(data);
      // setLoading(!loading);
    } catch (error) {
      console.error(error);
    }
  };

  // const deleteDevice = async (deviceId) => {
  //   console.log("deviceId", deviceId);
  //   try {
  //     const response = await axios.delete(
  //       `${BASE_URL}/device/delete/${deviceId}`,

  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     // const data = response.data;
  //     // console.log(data);
  //     // setReports(data);
  //     // setLoading(!loading);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <Box m="20px">
      <Header
        title="Maintenance INFO"
        subtitle="List of Device Maintenance INFORMATIONS "
      />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          getRowId={(row) => row.deviceId}
          disableRowSelectionOnClick
          components={{
            Toolbar: isAdmin ? GridToolbar : null,
          }}
        />
      </Box>
    </Box>
  );
};

export default Maintenance;
