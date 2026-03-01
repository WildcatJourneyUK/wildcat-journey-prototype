import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Home Page</h1>
  },
]);

export default function App() {
  return <RouterProvider router={router} />
}