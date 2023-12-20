import React, { FC } from "react";
import Router from "./Router/Router";
import UserContextProvider from "./Context/UserContextProvider";
import "@mantine/core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { MantineProvider } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import io from "socket.io-client";

const socket = io("http://localhost:3001", { withCredentials: true });

const App: FC = () => {
  return (
    <div>
      <MantineProvider>
        <UserContextProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {/* Same as */}
          <Router />
          <ToastContainer />
        </UserContextProvider>
      </MantineProvider>
    </div>
  );
};

export default App;
export { socket };
