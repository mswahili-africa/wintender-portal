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
import Users from "./pages/users";
import UserDetail from "./pages/users/_username";
import Entities from "./pages/entities";
import PopupProvider from "./providers/popup";
import Roles from "./pages/roles";
import ChangeDefaultPassword from "./pages/users/change-default-password";
import Categories from "./pages/categories";
import Bidders from "./pages/bidders";
import CompanyDocuments from "./pages/complience";
import PublisherPerformance from "./pages/publisher-reports";
import TenderList from "./pages/tenders/fragments";
import { useSession } from "./store/auth";
import SessionTimeoutModal from "./components/cards/SessionLogger";
import ApplicationGroups from "./pages/applications/doItForMe";
import CompanyPlans from "./pages/plans";
import ApplicationInvoice from "./pages/applications/fragments/ApplicationInvoice";
import { UserDataProvider } from "./providers/userDataProvider";
import LoginAttempts from "./pages/login-attempts";
import Consultation from "./pages/consultation";
import ConsultationApplication from "./pages/consultation/applicatons";
import ProcurementEntities from "./pages/entities/peUsers";
import SubmittedApplication from "./pages/applications/selfSubmited";
import { ApplicantsList } from "./pages/applicants/index";
import TenderBox from "./pages/tenders/TenderBox";
import GovernmentTenders from "./pages/tenders/government-tenders";
import Settings from "./pages/settings";
import SystemHealth from "./pages/system-health";
import SystemLogs from "./pages/system-health/System-logs";
import Messages from "./pages/messages";
import FloatingChatButton from "./ai/components/FloatingChatButton";

export const queryClient = new QueryClient({});

function App() {

    const { showModal } = useSession();

    return (

        <UserDataProvider>
            <QueryClientProvider client={queryClient}>
                <PopupProvider>
                    <Toaster position="top-center" reverseOrder={false} />
                    {showModal && <SessionTimeoutModal />}
                    <Routes>
                        <Route>
                            <Route path="/login" element={<Login />} />

                            <Route path="/register" element={<Register />} />

                            <Route path="/forgot" element={<ForgotPassword />} />

                            <Route path="/reset-password" element={<ResetPassword />} />

                            <Route path="/change-default" element={<ChangeDefaultPassword />} />

                            <Route path="/" element={<AppLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="entities" element={<Entities />} />
                                <Route path="do-it-for-me" element={<ApplicationGroups />} />
                                <Route path="submitted-application" element={<SubmittedApplication />} />
                                <Route path="tenders" element={<TenderList />} />
                                <Route path="government-tenders" element={<GovernmentTenders />} />
                                <Route path="tender-box" element={<TenderBox />} />
                                <Route path="/tenders/:tenderId/applicants" element={<ApplicantsList />} />

                                <Route path="payments" element={<Payments />} />
                                <Route path="categories" element={<Categories />} />
                                <Route path="consultation" element={<Consultation />} />
                                <Route path="consultation-application" element={<ConsultationApplication />} />
                                <Route path="users" element={<Users />} />
                                <Route path="bidders" element={<Bidders />} />
                                <Route path="entities-users" element={<ProcurementEntities />} />
                                <Route path="users/:userId" element={<UserDetail selectedUser={null} selectedLoading={false} />} />
                                <Route path="roles" element={<Roles />} />
                                <Route path="publisher-perfomance" element={<PublisherPerformance />} />
                                <Route path="company-documents" element={<CompanyDocuments />} />
                                <Route path="company-plans" element={<CompanyPlans />} />
                                <Route path="application-profoma-invoice" element={<ApplicationInvoice />} />
                                <Route path="login-attempt" element={<LoginAttempts />} />
                                <Route path="error-logs" element={<SystemLogs />} /> {/* JCM logs  */}
                                <Route path="system-health" element={<SystemHealth />} /> {/* JCM health  */}
                                <Route path="settings" element={<Settings />} />
                                <Route path="messages" element={<Messages />} />
                            </Route>

                            <Route path="*" element={<NoMatch />} />
                        </Route>
                    </Routes>

                    <div>
                        <Outlet />
                    </div>

                    <FloatingChatButton />
                </PopupProvider>
            </QueryClientProvider>
        </UserDataProvider>
    )
}

export default App
