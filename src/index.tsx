import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import {Canvas} from './Canvas/Canvas';
import {Gallery} from './Gallery/Gallery';

const router = createBrowserRouter([
  {
    path: "/",
    element: <><App /></>,
    children: [
      {
        path: "/paint",
        element: <Canvas />
      },
    ]
  },
]);

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);