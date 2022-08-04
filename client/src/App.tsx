import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register, Landing, Error, ProtectedRoute } from "pages";
import {
  AllApis,
  Profile,
  SharedLayout,
  Stats,
  AddApi,
  EditApi,
} from "pages/dashboard";
import {
  addApiRoute,
  allApisRoute,
  editApiRoute,
  landingRoute,
  profileRoute,
  registerRoute,
} from "constants/routes";

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
