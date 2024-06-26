import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import BASE_URL from "utils/BASE_URL";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAdminLogout } from "state/adminState";
import DeleteConfirmationModal from "../../../components/DeleteDeviceModal";

const Dammageinfo = ({ isAdmin = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const adminToken = useSelector((state) => state.adminState.adminToken);
  const [dammage, setDammage] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/dammageinfo`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      .then((res) => {
        console.log(res);
        setDammage(res.data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response.data.error);
        if (error.response.data.error === "Access Token Expired") {
          dispatch(setAdminLogout());
          navigate("/admin");
        }
      });
  }, [adminToken, navigate]);

  useEffect(() => {
    const setDammage = () => {
      const newRows = dammage.map((dammage) => ({
        deviceId: dammage._id,
        deviceName: dammage.deviceName,
        deviceNumber: dammage.deviceNumber,
        internalNumber: dammage.internalNumber,
        engineer: dammage.engineer,
        complaints: dammage.checks
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
    setDammage();
  }, [dammage]);

  const deleteDevice = async (deviceId) => {
    console.log("deviceId", deviceId);
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/device/delete/${deviceId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      axios
        .get(`${BASE_URL}/admin/dammageinfo`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          setDammage(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
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
      field: "complaints",
      headerName: "Complaints",
      flex: 3,
    },
    {
      field: "dss",
      headerName: "Delete",
      flex: 1,
      renderCell: (params) => (
        <Button
          onClick={() => {
            setSelectedDeviceId(params.row.deviceId);
            setOpenDeleteModal(true);
          }}
          variant="contained"
          sx={{ color: "red" }}
        >
          {params.row.status === true ? "notworked" : "DELETE"}
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Dammage INFO"
        subtitle="List of Device Dammage INFORMATIONS "
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
          getRowId={(row) => `${row.deviceId}-${loading}`}
          disableRowSelectionOnClick
          components={{
            Toolbar: isAdmin ? GridToolbar : null,
          }}
        />
      </Box>
      {/* Add the DeleteConfirmationModal component */}
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          deleteDevice(selectedDeviceId);
          setOpenDeleteModal(false);
        }}
      />
    </Box>
  );
};

export default Dammageinfo;
