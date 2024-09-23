import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/app_layout";
import NoMatch from "./pages/404";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
import Dashboard from "./pages/dashboard";
import Payments from "./pages/payments";
import Tenders from "./pages/tenders";
import Users from "./pages/users";
import UserDetail from "./pages/users/_username";
import Entities from "./pages/entities";
import PopupProvider from "./providers/popup";
import Roles from "./pages/roles";
import ChangeDefaultPassword from "./pages/users/change-default-password";
import Categories from "./pages/categories";
import ContrlNumbers from "./pages/control-numbers";
import Bidders from "./pages/bidders";

export const queryClient = new QueryClient({});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <PopupProvider>
                <Toaster position="top-center" reverseOrder={false} />
                <Routes>
                    <Route>
                        <Route path="/login" element={<Login/>}/>

                        <Route path="/register" element={<Register/>}/>

                        <Route path="/forgot" element={<ForgotPassword />}/>

                        <Route path="/reset-password" element={<ResetPassword />} />

                        <Route path="/change-default" element={<ChangeDefaultPassword />} />

                        <Route path="/" element={<AppLayout />}> 
                            <Route index element = {<Dashboard/>}/>
                            <Route path="entities" element={<Entities/>}/>
                            <Route path="do-it-for-me" element={<ContrlNumbers/>}/>
                            <Route path="tenders" element={<Tenders />}/>
                            <Route path="payments" element={<Payments />}/>
                            <Route path="categories" element={<Categories />}/>
                            <Route path="users" element={<Users />}/>
                            <Route path="bidders" element={<Bidders />}/>
                            <Route path="users/:username" element={<UserDetail />}/>
                            <Route path="roles" element={<Roles />}/>

                        </Route>

                        <Route path="*" element={<NoMatch/>}/>
                    </Route>
                </Routes>

                <div>
                    <Outlet />
                </div>
            </PopupProvider>
        </QueryClientProvider>
    )
}

export default App
