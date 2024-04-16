import { useState } from "react";
import UpdateElectron from "@/components/update";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import "../app/globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Dashboard } from "./views/Dashboard";
import Workflow from "./views/Workflow";
import FlowEdit from "./views/FlowEdit";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createTheme, MantineProvider } from "@mantine/core";
import { AppContextProvider } from "@/context/AppContext";
import { ReactFlowProvider } from "reactflow";
import ChatWorkflow from "./views/ChatWorkflow";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <div className="flex">
        <AppContextProvider>
          <DndProvider backend={HTML5Backend}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />}>
                  <Route index element={<Workflow />} />
                  <Route
                    path="/workflow-edit/:workflowId"
                    element={
                      <ReactFlowProvider>
                        <FlowEdit />
                      </ReactFlowProvider>
                    }
                  />
                  <Route path="/chat/:workflowId" element={<ChatWorkflow />} />
                </Route>
              </Routes>
            </BrowserRouter>
            {/* <UpdateElectron /> */}
          </DndProvider>
        </AppContextProvider>
      </div>
      <Notifications position="top-right" />
    </MantineProvider>
  );
}

export default App;
