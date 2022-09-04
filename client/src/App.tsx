import {
  addApiRoute,
  allApisRoute,
  editApiRoute,
  landingRoute,
  monitoringRoute,
  profileRoute,
  registerRoute,
} from "constants/routes";
import { Error, Landing, ProtectedRoute, Register } from "pages";
import {
  AddApi,
  AllApis,
  EditApi,
  Monitoring,
  Profile,
  SharedLayout,
  Stats,
} from "pages/dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path={allApisRoute} element={<AllApis />} />
          <Route path={addApiRoute} element={<AddApi />} />
          <Route path={editApiRoute} element={<EditApi />} />
          <Route path={monitoringRoute} element={<Monitoring />} />
          <Route path={profileRoute} element={<Profile />} />
        </Route>
        <Route path={registerRoute} element={<Register />} />
        <Route path={landingRoute} element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
