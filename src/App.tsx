import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import "../app/globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Dashboard } from "./views/Dashboard";
import Workflow from "./views/Workflow";
import FlowEdit from "./views/FlowEdit";
import { createTheme, MantineProvider } from "@mantine/core";
import { AppContextProvider } from "@/context/AppContext";
import { ReactFlowProvider } from "reactflow";
import { Notifications } from "@mantine/notifications";
import KnowledgeBaseBoard from "./views/KnowledgeBaseBoard";
import KnowledgeBase from "./views/KnowledgeBase";
import { Integration } from "./views/Integration";
import Conversations from "./views/Conversations";
import ChatConversation from "./views/ChatConversation";

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <div className="flex">
        <AppContextProvider>
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
                <Route
                  path="/integration/:integrationId?"
                  element={<Integration />}
                >
                  {/* <Route index element={<IntegrationConfig />} /> */}
                </Route>

                <Route path="/chat" element={<Conversations />}>
                  <Route
                    path="/chat/:conversationId"
                    element={<ChatConversation />}
                  />
                </Route>
                <Route path="/knowledge-base/:id" element={<KnowledgeBase />} />
                <Route
                  path="/knowledgeBaseBoard"
                  element={<KnowledgeBaseBoard />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
          {/* <UpdateElectron /> */}
        </AppContextProvider>
      </div>
      <Notifications position="top-right" />
    </MantineProvider>
  );
}

export default App;
