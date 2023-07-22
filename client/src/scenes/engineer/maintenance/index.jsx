import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";

import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import BASE_URL from "utils/BASE_URL";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Maintenance = ({ isAdmin = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.userState.token);
  const [maintenance, setMaintenance] = useState([]);
  const [rows, setRows] = useState([]);
  const [reload, setReload] = useState(false); // Add a state variable for reload
  const [open, setOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  const handleSuccessAlert = (message) => {
    setOpen(true);
    setSuccessMessage(message);
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
        setReload(false); // Reset the reload state after data is fetched
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token, reload]); // Add the 'reload' state variable to the dependency array

  useEffect(() => {
    const setMaintenanceData = () => {
      const newRows = maintenance.map((maintenance) => ({
        deviceId: maintenance._id,
        deviceName: maintenance.deviceName,
        deviceNumber: maintenance.deviceNumber,
        internalNumber: maintenance.internalNumber,
        engineer: maintenance.engineer,
        status: maintenance.status,
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

    setMaintenanceData();
  }, [maintenance]);

  const forwardtoProduction = async (deviceId) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/device/toproduction`,
        { deviceId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);

      handleSuccessAlert("Device moved to Production successfully");
      setReload(true);
    } catch (error) {
      console.error(error);
    }
  };

  const forwardtoDammage = async (deviceId) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/device/todammage`,
        { deviceId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);

      handleSuccessAlert("Device moved to Damage successfully");
      setReload(true);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
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
      field: "status",
      headerName: "Device Status",
      flex: 1,
    },
    {
      field: "complaints",
      headerName: "Complaints",
      flex: 3,
    },
    {
      field: "dammage",
      headerName: "Report as Dammage",
      flex: 1.5,
      renderCell: (params) => (
        <Button
          onClick={() => {
            forwardtoDammage(params.row.deviceId);
            handleClick();
          }}
          variant="contained"
          sx={{ color: "red" }}
        >
          {params.row.status === true ? "notworked" : "DAMMAGE"}
        </Button>
      ),
    },
    {
      field: "production",
      headerName: "Move to Production",
      flex: 1.5,
      renderCell: (params) => (
        <Button
          onClick={() => {
            forwardtoProduction(params.row.deviceId);
            handleClick();
          }}
          variant="contained"
          sx={{ color: "yellow" }}
        >
          {params.row.status === true ? "notworked" : "Production"}
        </Button>
      ),
    },
  ];

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
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          getRowId={(row) => row.deviceId}
          components={{
            Toolbar: isAdmin ? GridToolbar : null,
          }}
        />
      </Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Maintenance;
