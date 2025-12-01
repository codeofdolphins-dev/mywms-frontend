import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import AuthLayout from './routes/Auth.route'
import Login from './screens/auth/Login'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<div>Register Page</div>} />
        </Route>
      </Route>
    )
  )


  return <RouterProvider router={router} />
}

export default App
