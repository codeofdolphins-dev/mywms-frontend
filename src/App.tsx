import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import AuthLayout from './layouts/Auth.layout'
import Login from './screens/auth/Login'
import Register from './screens/auth/Register'
import Dashboard from './screens/Dashboard'
import AppLayout from './layouts/App.layout'
import Master from './screens/Master'
import Error404 from './screens/Error404'
import RequisitionLayout from './layouts/Requisition.layout'
import Rules from './screens/requisition/Rules'
import RequisitionBrowse from './screens/requisition/RequisitionBrowse.jsx';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="master" element={<Master />} />

          {/* requisition */}
          <Route path="requisition" element={<RequisitionLayout />} >
            <Route path="admin/rules" element={<Rules />} />
            <Route path="browse" element={ <RequisitionBrowse /> } />
          </Route>

        </Route>
        <Route path="*" element={<Error404 />} />
      </Route>
    )
  )


  return <>
    <div className="horizontal full main-section antialiased relative font-nunito text-sm font-normal">
      <RouterProvider router={router} />
    </div>
  </>
}

export default App
