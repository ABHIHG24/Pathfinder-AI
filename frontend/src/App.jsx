import React, { useState } from "react";
import "./App.css";
import {
  HomeLayout,
  Login,
  About,
  Error,
  Landing,
  AllRoadmap,
  Chat,
  DashBoard,
  Profile,
  Resources,
  ProgressPage,
  FitnessForm,
  UpdateProfile,
  UpdatePassword,
  Community,
  Allchat,
  ResumeForm,
  TestComponent,
} from "./pages/Index";
import { ErrorElement } from "./components";
import { Loader } from "./components/index";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { loader as landingLoader } from "./pages/Landing";
import { loader as CareerLoader } from "./pages/AllRoadmap";

import {
  ProfilePage,
  ResetPassword,
  ResetPassword2,
  CodeEditor,
} from "./components";
import { ToastContainer } from "react-toastify";

import PrivateRoute from "./features/PrivateRoute";

import {
  ManageUser,
  AdminDashboard,
  CreateRoadmap,
  AddResource,
  AdminHomePage,
  ManageFitMap,
} from "./Admin";

function App() {
  const [role, setRole] = useState("user");
  const mode = localStorage.getItem("theme");

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <HomeLayout />,
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: <Landing />,
            errorElement: <ErrorElement />,
            loader: landingLoader,
          },
          {
            path: "About",
            element: <About />,
          },
          {
            path: "Career",
            element: <AllRoadmap />,
            errorElement: <ErrorElement />,
            loader: CareerLoader,
          },
          {
            path: "Resources/ResumeForm",
            element: <ResumeForm />,
            errorElement: <ErrorElement />,
            loader: CareerLoader,
          },
          {
            path: "ai-chat",
            element: <Chat />,
          },
          {
            path: "DashBoard",
            element: (
              <PrivateRoute>
                <DashBoard />
              </PrivateRoute>
            ),
          },
          {
            path: "Community",
            element: (
              <PrivateRoute>
                <Community />
              </PrivateRoute>
            ),
          },
          {
            path: "Allchat/:id",
            element: (
              <PrivateRoute>
                <Allchat />
              </PrivateRoute>
            ),
          },
          {
            path: "Profile",
            element: (
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            ),
            children: [
              {
                index: true,
                element: <ProfilePage />,
              },
              {
                path: "update_profile",
                element: <UpdateProfile />,
              },
              {
                path: "update_password",
                element: <UpdatePassword />,
              },
            ],
          },
          {
            path: "Resources",
            element: <Resources />,
          },
          {
            path: "test",
            element: <TestComponent />,
          },
          {
            path: "Career/:id",
            element: <ProgressPage />,
            // loader: SingleCareerLoader,
          },
          {
            path: "FitnessForm",
            element: <FitnessForm />,
          },
          {
            path: "Resources/CodeEditor",
            element: <CodeEditor />,
          },
        ],
      },

      {
        path: "/login",
        element: <Login setRole={setRole} />,
        errorElement: <Error />,
      },
      {
        path: "/forgetPassword",
        element: <ResetPassword />,
        errorElement: <Error />,
      },
      {
        path: "/resetPassword/:token",
        element: <ResetPassword2 />,
        errorElement: <Error />,
      },
      {
        path: "/admin",
        element: (
          <PrivateRoute isAdmin={true}>
            <AdminHomePage />
          </PrivateRoute>
        ),
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },

          {
            path: "ManageUser",
            element: <ManageUser />,
          },
          {
            path: "CreateRoadmap",
            element: <CreateRoadmap />,
            // errorElement: <Error />,
          },
          {
            path: "AddResource",
            element: <AddResource />,
            // errorElement: <Error />,
          },
          {
            path: "Roadmap",
            element: <ManageFitMap />,
            // errorElement: <Error />,
          },
        ],
      },
    ],

    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );

  return (
    <>
      <React.Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </React.Suspense>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        draggable={true}
        pauseOnHover={true}
        theme={mode === "winter" ? "light" : "dark"}
      />
    </>
  );
}

export default App;
