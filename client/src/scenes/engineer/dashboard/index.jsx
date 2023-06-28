import { Box, Typography } from "@mui/material";
import Header from "components/Header";
import React from "react";

function Dashbord() {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashbord" />
      </Box>
      <Typography sx={{ color: "yellow" ,fontSize: 36 }}>
        Welcome To Estro Tech , DashBoard Coming Soon............
      </Typography>
    </Box>
  );
}

export default Dashbord;
