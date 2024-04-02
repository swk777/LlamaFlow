import { useState } from "react";
import UpdateElectron from "@/components/update";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import "../app/globals.css";
import { Dashboard } from "./views/Dashboard";
import Workflow from "./views/Workflow";
import Flow from "./views/Flow";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     // errorElement: <ErrorPage />,
//     children: [
//       {
//         path: "flow-edit",
//         element: <Flow />,
//       },
//     ],
//   },
// ]);
function App() {
  const [count, setCount] = useState(0);
  return (
    // <BrowserRouter>
    <div className="flex">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Workflow />} />
            <Route path="/workflow-edit" element={<Flow />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <UpdateElectron /> */}
    </div>
    // </BrowserRouter>
  );
  // return (
  //   <div className='App'>
  //     <div className='logo-box'>
  //       <a href='https://github.com/electron-vite/electron-vite-react' target='_blank'>
  //         <img src={logoVite} className='logo vite' alt='Electron + Vite logo' />
  //         <img src={logoElectron} className='logo electron' alt='Electron + Vite logo' />
  //       </a>
  //     </div>
  //     <h1>Electron + Vite + React</h1>
  //     <div className='card'>
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className='read-the-docs'>
  //       Click on the Electron + Vite logo to learn more
  //     </p>
  //     <div className='flex-center'>
  //       Place static files into the<code>/public</code> folder <img style={{ width: '5em' }} src='./node.svg' alt='Node logo' />
  //     </div>

  //     <UpdateElectron />
  //   </div>
  // )
}

export default App;
