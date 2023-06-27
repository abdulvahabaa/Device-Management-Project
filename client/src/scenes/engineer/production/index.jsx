import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";

import Header from"../../../components/Header";
import {useEffect, useState} from "react"
import axios from "axios";
import BASE_URL from "utils/BASE_URL";
import { useSelector } from "react-redux";



  const Production = ({isAdmin=false}) => {
    const token = useSelector((state) => state.userState.token);
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const [production, setProduction] = useState([]);
    const [rows, setRows] = useState([]);
  
    useEffect(() => {
      axios
        .get(`${BASE_URL}/device/production`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          setProduction(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [token]);
  
    useEffect(() => {
      const getProductions = () => {
        const newRows = production.map((production) => ({
          // id: `${production._id}-${index}`,
          deviceId:production._id,
          deviceName: production.deviceName,
          deviceNumber: production.deviceNumber,
          internalNumber: production.internalNumber,
          engineer: production.engineer,
          // accessLevel: production.accessLevel,
        }));
        setRows(newRows);
      };
    
      getProductions();
    }, [production]);

    const forwardtoLive = async (deviceId) => {
      console.log(deviceId)
      try {
        const response = await axios.patch(
          `${BASE_URL}/device/tolive`,
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
      ...(isAdmin
        ? [
            {
              field: "Action",
              headerName: "Action",
              renderCell: (params) => (
                <Button
                  onClick={() => {
                    forwardtoLive(params.row.deviceId);
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
          }}
        >
          <DataGrid checkboxSelection  disableRowSelectionOnClick  rows={rows} columns={columns} getRowId={(row) => row.deviceId}  />
        </Box>
      </Box>
    );
  };
  
  export default Production;
  