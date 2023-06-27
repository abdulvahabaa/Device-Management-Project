import { useState } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Topbar from "./scenes/global/engineer/Topbar";
import Sidebar from "./scenes/global/engineer/Sidebar";
import Dashboard from "./scenes/engineer/dashboard";
import Uncheacked from "./scenes/engineer/uncheacked";
import Live from "./scenes/engineer/live";
import Maintenance from "./scenes/engineer/maintenance";
import FormCreate from "./scenes/engineer/formCreate";
import LoginPage from "scenes/engineer/loginPage";
import Production from "scenes/engineer/production";
import LoginPageAdmin from "scenes/manger/login";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useSelector } from "react-redux";
import AdminSidebar from "scenes/global/admin/adminSidebar";
import AdminTopbar from "scenes/global/admin/adminTopbar";
import Dammageinfo from "scenes/manger/dammageinfo";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const isAuth = Boolean(useSelector((state) => state.userState.token));
  const isAdminAuth = Boolean(
    useSelector((state) => state.adminState.adminToken)
  );

  const isLoginPage = window.location.pathname === "/";
  const isAdminLoginpage = window.location.pathname === "/admin";
  const isAdminPath = window.location.pathname.startsWith("/admin/");

  return (
    <BrowserRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {!isLoginPage && !isAdminLoginpage && !isAdminPath && (
              <Sidebar isSidebar={isSidebar} />
            )}

            {isAdminAuth && isAdminPath && <AdminSidebar />}

            <main className="content">
              {!isLoginPage && !isAdminLoginpage && !isAdminPath && (
                <Topbar setIsSidebar={setIsSidebar} />
              )}

              {isAdminAuth && isAdminPath && <AdminTopbar />}
              
              <Routes>
                <Route
                  path="/"
                  element={!isAuth ? <LoginPage /> : <Navigate to="/home" />}
                />
                <Route
                  path="/home"
                  element={isAuth ? <Dashboard /> : <Navigate to="/" />}
                />
                <Route
                  path="/live"
                  element={isAuth ? <Live /> : <Navigate to="/" />}
                />
                <Route
                  path="/create"
                  element={isAuth ? <FormCreate /> : <Navigate to="/" />}
                />
                <Route
                  path="/uncheacked"
                  element={isAuth ? <Uncheacked /> : <Navigate to="/" />}
                />
                <Route
                  path="/maintainance"
                  element={isAuth ? <Maintenance /> : <Navigate to="/" />}
                />
                <Route
                  path="/production"
                  element={isAuth ? <Production /> : <Navigate to="/" />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/admin"
                  element={
                    !isAdminAuth ? (
                      <LoginPageAdmin />
                    ) : (
                      <Navigate to="/admin/home" />
                    )
                  }
                />
                <Route
                  path="/admin/home"
                  element={
                    isAdminAuth ? <Dashboard /> : <Navigate to="/admin" />
                  }
                />
                <Route
                  path="/admin/production"
                  element={
                    isAdminAuth ? <Production isAdmin /> : <Navigate to="/admin" />
                  }
                />
                <Route
                  path="/admin/live"
                  element={isAdminAuth ? <Live isAdmin/> : <Navigate to="/admin" />}
                />
                <Route
                  path="/admin/uncheacked"
                  element={isAdminAuth ? <Uncheacked isAdmin /> : <Navigate to="/admin" />}
                />

                <Route
                  path="/admin/dammageinfo"
                  element={isAdminAuth ? <Dammageinfo isAdmin /> : <Navigate to="/admin" />}
                />


              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
