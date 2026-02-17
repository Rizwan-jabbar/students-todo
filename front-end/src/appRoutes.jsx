import { Route, Routes } from "react-router-dom"
import AddToDo from "./components/addToDo/addToDo"
import Header from "./components/header/header"
import Login from "./components/login/login"
import TaskList from "./components/taskList/taskList"
import ProtectedRoutes from "./protectedRoutes/protectedRoutes"
import RegisterForm from "./components/register/register"
import UserProfile from "./components/userProfile/userProfile"
import DashBoard from "./components/dashBoard/dashBoard"

function AppRoutes() {
    return (
        <>


            <Routes>
                <Route  element={<ProtectedRoutes />}>
                    <Route path="/" element={
                        <>
                            <Header />
                            <DashBoard />
                        </>
                    } />
                </Route>
                    <Route path="/myProfile" element={<>

                        <Header />
                        <UserProfile /> 
                    
                    </>} />


                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    )
}

export default AppRoutes