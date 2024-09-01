import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MainLayout from "./pages/layout.tsx";
import {Typography} from "@mui/material";
import Problems from "./pages/problems";
import {ProblemContextProvider} from "./contexts/ProblemContext.tsx";

const Home = () => <Typography variant="h4">Home Page</Typography>;
const About = () => <Typography variant="h4">About Page</Typography>;
const Contact = () => <Typography variant="h4">Contact Page</Typography>;

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {index: true, path: "", element: <Problems/>},
            {path: "home", element: <Home/>},
            {path: "about", element: <About/>},
            {path: "contact", element: <Contact/>},
        ]
    },
]);

function App() {
    return (
        <ProblemContextProvider >
            <RouterProvider router={router} />
        </ProblemContextProvider>
    );
}

export default App;
