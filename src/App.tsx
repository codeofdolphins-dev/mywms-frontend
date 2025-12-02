import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import AuthLayout from './routes/Auth.route'
import Login from './screens/auth/Login'
import Register from './screens/auth/Register'
import Dashboard from './screens/Dashboard'
import AppLayout from './routes/App.route'
import Master from './screens/Master'
import Error404 from './screens/Error404'

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
