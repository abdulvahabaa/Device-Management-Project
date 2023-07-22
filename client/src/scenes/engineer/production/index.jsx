import React, { useEffect, useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { setLogout } from "state/engineerState";
import Header from "../../../components/Header";
import axios from "axios";
import BASE_URL from "utils/BASE_URL";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Production = ({ isAdmin = false }) => {
  const token = useSelector((state) => state.userState.token);
  const adminToken = useSelector((state) => state.adminState.adminToken);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [production, setProduction] = useState([]);
  const [rows, setRows] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(false); // State variable to trigger reload
  const [open, setOpen] = React.useState(false);

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
    const accessToken = token || adminToken;
    axios
      .get(`${BASE_URL}/device/production`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res);
        setProduction(res.data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response.data.error);
        if (error.response.data.error === "Access Token Expired") {
          dispatch(setLogout());
          navigate("/");
        }
      });
  }, [token, adminToken, navigate]);

  useEffect(() => {
    const getProductions = () => {
      const newRows = production.map((production) => ({
        deviceId: production._id,
        deviceName: production.deviceName,
        deviceNumber: production.deviceNumber,
        internalNumber: production.internalNumber,
        engineer: production.engineer,
        status: production.status,
      }));
      setRows(newRows);
    };

    getProductions();
  }, [production]);

  const forwardtoLive = async (deviceId) => {
    console.log(deviceId);
    try {
      const response = await axios.patch(
        `${BASE_URL}/device/tolive`,
        { deviceId },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      const data = response.data;
      console.log(data);
      setReloadTrigger(true); // Trigger reload by setting the reloadTrigger state to true
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (reloadTrigger) {
      // Fetch data again when reloadTrigger becomes true
      const accessToken = token || adminToken;
      axios
        .get(`${BASE_URL}/device/production`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          setProduction(res.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setReloadTrigger(false); // Reset reloadTrigger back to false after reloading
        });
    }
  }, [reloadTrigger, token, adminToken]);

  const columns = [
    {
      field: "deviceName",
      headerName: "Device Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "internalNumber",
      headerName: "Internal Number",
      flex: 1,
    },
    {
      field: "deviceNumber",
      headerName: "Device Number",
      flex: 1,
    },
    {
      field: "engineer",
      headerName: "Engineer Name",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Device Status",
      flex: 1,
    },

    ...(isAdmin
      ? [
          {
            field: "Action",
            headerName: "Move to Live",
            renderCell: (params) => (
              <Button
                onClick={() => {
                  forwardtoLive(params.row.deviceId);
                  handleClick();
                }}
                variant="contained"
                sx={{ color: "yellow" }}
              >
                {params.row.status === true ? "Live" : "Deploy"}
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <Box m="20px">
      <Header
        title="Ready to Production"
        subtitle="Managing the Ready to Production Devices for Deploy"
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
          "& .MuiDataGrid-row": {
            borderBottom: `1px solid ${colors.grey[300]}`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          getRowId={(row) => row.deviceId}
        />
      </Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Device is Deployed successfully and Live now!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Production;
