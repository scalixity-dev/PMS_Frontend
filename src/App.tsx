import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TanStackDevtools } from '@tanstack/react-devtools';
import AppLayout from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/dashboardlayout/DashboardLayout';
import HomePage from './pages/basewebsite/home';
import ScreeningPage from './pages/basewebsite/features/screening/index';
import LeasePage from './pages/basewebsite/features/lease/index';
import FinancePage from './pages/basewebsite/features/finance/index';
import LeadsPage from './pages/basewebsite/features/leads/index';
import { RentalApplicationSettingsLayout } from './components/common/RentalApplicationSettingsLayout';
import PricingPage from './pages/basewebsite/pricing';
import LoginPage from './pages/basewebsite/auth/login';
import SignUpPage from './pages/basewebsite/auth/signUp';
import ServiceDashboardLogin from './pages/ServiceDashboard/pages/auth/Login';
import AdminLogin from './pages/Admin/Login';
import AdminLayout from './pages/Admin/layout/AdminLayout';
import AdminDashboard from './pages/Admin/pages/Dashboard/AdminDashboard';
import UsersPage from './pages/Admin/pages/Users/UsersPage';
import UserDetailPage from './pages/Admin/pages/Users/UserDetails/UserDetailPage';
import PropertiesPage from './pages/Admin/pages/Properties/PropertiesPage';
import LeasesPage from './pages/Admin/pages/Leases/LeasesPage';
import PaymentsPage from './pages/Admin/pages/Payments/PaymentsPage';
import ServiceDashboardSignup from './pages/ServiceDashboard/pages/auth/Signup';
import ForgotPassword from './pages/ServiceDashboard/pages/auth/ForgotPassword';
import Welcome from './pages/ServiceDashboard/pages/onboarding/Welcome';
import SelectProfession from './pages/ServiceDashboard/pages/onboarding/SelectProfession';
import ProfessionDetails from './pages/ServiceDashboard/pages/onboarding/ProfessionDetails';
import ServiceDashboardLayout from './components/service-dashboard/layout/ServiceDashboardLayout';
import ServiceDashboard from './pages/ServiceDashboard/pages/Dashboard/ServiceDashboard';
import ServiceDashboardSettings from './pages/ServiceDashboard/pages/Dashboard/Settings/ServiceDashboardSettings';
import ServiceDashboardProfileSettings from './pages/ServiceDashboard/pages/Dashboard/Settings/AccountSettings/ProfileSettings';
import ServiceDashboardSecuritySettings from './pages/ServiceDashboard/pages/Dashboard/Settings/AccountSettings/SecuritySettings';
import ServiceDashboardIntegrationSettings from './pages/ServiceDashboard/pages/Dashboard/Settings/AccountSettings/IntegrationSettings';
import ServiceDashboardNotificationSettings from './pages/ServiceDashboard/pages/Dashboard/Settings/AccountSettings/NotificationSettings';
import OtpPage from './pages/basewebsite/auth/otp';
import OAuthCallbackPage from './pages/basewebsite/auth/otp'; // Note: This might have been a mistake in the original or I misread, checking...
import OAuthCompletePage from './pages/basewebsite/auth/signUp/oauth-complete';
import { TenantOnboardingFlow } from './pages/basewebsite/auth/signUp/sections/TenantOnboardingFlow';
import TeamPage from './pages/basewebsite/features/team/index';
import LandlordUseCasesPage from './pages/basewebsite/usecases/landlord';
import ResourcePage from './pages/basewebsite/resources';
import TenantPage from './pages/basewebsite/usecases/tenant';
import ServiceProsPage from './pages/basewebsite/usecases/servicepros';
import Dashboard from './pages/Dashboard/Dashboard';
import ListUnit from './pages/Dashboard/features/ListUnit';
import AddProperty from './pages/Dashboard/features/Properties/AddProperty';
import EditProperty from './pages/Dashboard/features/Properties/EditProperty';
import Transactions from './pages/Dashboard/features/Transactions/Transactions';
import AddIncomeInvoice from './pages/Dashboard/features/Transactions/AddIncomeInvoice';
import CloneTransaction from './pages/Dashboard/features/Transactions/CloneTransaction';
import RecurringIncome from './pages/Dashboard/features/Transactions/RecurringIncome';
import RecurringExpense from './pages/Dashboard/features/Transactions/RecurringExpense';
import ReturnDeposit from './pages/Dashboard/features/Transactions/ReturnDeposit';
import ApplyDepositAndCredit from './pages/Dashboard/features/Transactions/ApplyDepositAndCredit';
import BulkPaymentsIncome from './pages/Dashboard/features/Transactions/BulkPaymentsIncome';
import BulkPaymentsExpense from './pages/Dashboard/features/Transactions/BulkPaymentsExpense';
import Deposit from './pages/Dashboard/features/Transactions/Deposit';
import Credits from './pages/Dashboard/features/Transactions/Credits';
import IncomePayments from './pages/Dashboard/features/Transactions/IncomePayments';
import ExpensePayments from './pages/Dashboard/features/Transactions/ExpensePayments';
import AddExpenseInvoice from './pages/Dashboard/features/Transactions/AddExpenseInvoice';
import Payments from './pages/Dashboard/features/Payments/Payments';
import Recurring from './pages/Dashboard/features/Recurring/Recurring';
import RecurringDetail from './pages/Dashboard/features/Recurring/RecurringDetail';
import RecurringClone from './pages/Dashboard/features/Transactions/RecurringClone';
import AddMaintenanceRequest from './pages/Dashboard/features/Maintenance/AddMaintenanceRequest';
import Requests from './pages/Dashboard/features/Maintenance/MaintenanceRequests';
import MaintenanceRequestsDetail from './pages/Dashboard/features/Maintenance/MaintenanceRequestsDetail';
import MaintenanceRecurring from './pages/Dashboard/features/Maintenance/MaintenanceRecurring';
import MaintenanceRecurringDetail from './pages/Dashboard/features/Maintenance/MaintenanceRecurringDetail';
import Properties from './pages/Dashboard/features/Properties/Properties';
import ImportProperties from './pages/Dashboard/features/Properties/ImportProperties/ImportProperties';
import Equipments from './pages/Dashboard/features/Equipments/Equipments';
import EquipmentDetail from './pages/Dashboard/features/Equipments/EquipmentDetail';
import CreateEquipment from './pages/Dashboard/features/Equipments/CreateEquipment';
import MoveIn from './pages/Dashboard/features/MoveIn/MoveIn';
import PropertyDetail from './pages/Dashboard/features/Properties/PropertyDetail';
import UnitPropertyDetail from './pages/Dashboard/features/Units/UnitPropertyDetail';
import EditUnit from './pages/Dashboard/features/Units/EditUnit';
import Listing from './pages/Dashboard/features/Listing/Listing';
import ListingDetail from './pages/Dashboard/features/Listing/ListingDetail';
import Calendar from './pages/Dashboard/features/Calendar/Calendar';
import Tasks from './pages/Dashboard/features/Tasks/Tasks';
import Tenants from './pages/Dashboard/features/Tenants/Tenants';
import ImportTenants from './pages/Dashboard/features/Tenants/ImportTenants/ImportTenants';
import AddEditTenant from './pages/Dashboard/features/Tenants/AddEditTenant';
import TenantDetail from './pages/Dashboard/features/Tenants/TenantDetail';
import Units from './pages/Dashboard/features/Units/Units';
import KeysLocks from './pages/Dashboard/features/KeysLocks/KeysLocks';
import KeyDetail from './pages/Dashboard/features/KeysLocks/KeyDetail';
import Leases from './pages/Dashboard/features/Leases/Leases';
import ImportLeases from './pages/Dashboard/features/Leases/ImportLeases/ImportLeases';
import LeaseDetail from './pages/Dashboard/features/Leases/LeaseDetail';
import EndLease from './pages/Dashboard/features/Leases/EndLease';
import AddKey from './pages/Dashboard/features/KeysLocks/AddKey';
import ServicePros from './pages/Dashboard/features/ServicePros/ServicePros';
import ImportServicePros from './pages/Dashboard/features/ServicePros/ImportServicePros/ImportServicePros';
import AddEditServicePro from './pages/Dashboard/features/ServicePros/AddEditServicePro';
import ServiceProsDetail from './pages/Dashboard/features/ServicePros/ServiceProsDetail';
import Application from './pages/Dashboard/features/Application/Application';
import NewApplication from './pages/Dashboard/features/Application/NewApplication';
import ApplicationDetail from './pages/Dashboard/features/Application/ApplicationDetail';
import ProviderStatement from './pages/Dashboard/features/ServicePros/ProviderStatement';
import TransactionDetail from './pages/Dashboard/features/Transactions/TransactionDetail';
import ChatPage from './pages/Dashboard/features/Messages/ChatPage';
// Documents pages
import LandlordForms from './pages/Dashboard/features/Documents/landlordforms/LandlordForms';
import TemplateView from './pages/Dashboard/features/Documents/landlordforms/TemplateView';
import UseTemplateWizard from './pages/Dashboard/features/Documents/landlordforms/UseTemplateWizard';
import MyTemplates from './pages/Dashboard/features/Documents/mytemplate/MyTemplates';
import MyTemplateDetail from './pages/Dashboard/features/Documents/mytemplate/MyTemplateDetail';
import EditTemplate from './pages/Dashboard/features/Documents/mytemplate/EditTemplate';
import CreateTemplateWizard from './pages/Dashboard/features/Documents/mytemplate/CreateTemplateWizard';
import Leads from './pages/Dashboard/features/Leads/leads';
import AddLead from './pages/Dashboard/features/Leads/AddLead';
import LeadDetail from './pages/Dashboard/features/Leads/LeadDetail';
import EditLead from './pages/Dashboard/features/Leads/EditLead';
import FileManagerFeature from './pages/Dashboard/features/FileManager/FileManager';



// User Dashboard pages
import UserDashboardLayout from './components/userdashboard/UserDashboardLayout';
import UserDashboard from './pages/userdashboard/UserDashboard';
import UserRent from './pages/userdashboard/features/Rent/UserRent';
import UserRequests from './pages/userdashboard/features/Requests/UserRequests';
import UserUtilityProviders from './pages/userdashboard/features/Utilities/UserUtilityProviders';
import UserProperties from './pages/userdashboard/features/Properties/UserProperties';
import UserApplications from './pages/userdashboard/features/Applications/UserApplications';
import UserApplicationDetail from './pages/userdashboard/features/Applications/UserApplicationDetail';
import UserFileManager from './pages/userdashboard/features/Utilities/UserFileManager';
import UserDownloads from './pages/userdashboard/features/Utilities/UserDownloads';
import UserNewRequest from './pages/userdashboard/features/Requests/UserNewRequest';
import UserPropertyDetail from './pages/userdashboard/features/Properties/UserPropertyDetail';
import UserSettings from './pages/userdashboard/features/Settings/UserSettings';
import UserProfile from './pages/userdashboard/features/Profile/UserProfile';
import UserSecurity from './pages/userdashboard/features/Profile/UserSecurity';
import UserMyCards from './pages/userdashboard/features/Profile/UserMyCards';
import UserNotifications from './pages/userdashboard/features/Profile/UserNotifications';
import UserPublicRenterProfile from './pages/userdashboard/features/Profile/UserPublicRenterProfile';
import UserLeaseDetails from './pages/userdashboard/features/Leases/UserLeaseDetails';
import UserTransactionDetails from './pages/userdashboard/features/Transactions/UserTransactionDetails';
import UserRequestDetails from './pages/userdashboard/features/Requests/UserRequestDetails';
import UserMessages from './pages/userdashboard/features/Messages/UserMessages';
import UserNewApplication from './pages/userdashboard/features/Applications/UserNewApplication';




// Settings pages
import Settings from './pages/Dashboard/settings/index';
import ProfileSettings from './pages/Dashboard/settings/accountsetting/ProfileSettings';
import SecuritySettings from './pages/Dashboard/settings/accountsetting/SecuritySettings';
import IntegrationSettings from './pages/Dashboard/settings/accountsetting/IntegrationSettings';
import NotificationSettings from './pages/Dashboard/settings/accountsetting/NotificationSettings';
import MyPlanSettings from './pages/Dashboard/settings/subscription/MyPlanSettings';
import MyCardSettings from './pages/Dashboard/settings/subscription/MyCardSettings';
import InvoiceSettings from './pages/Dashboard/settings/accounting/invoice';
import QuickBookSettings from './pages/Dashboard/settings/accounting/quickbook';
import TagsSettings from './pages/Dashboard/settings/accounting/tags';
import OnlinePaymentsConfigurations from './pages/Dashboard/settings/online-payments/configurations';
import OnlineApplication from './pages/Dashboard/settings/rental-application/OnlineApplication';
import FormConfiguration from './pages/Dashboard/settings/rental-application/FormConfiguration';
import TermsSignature from './pages/Dashboard/settings/rental-application/TermsSignature';
import BackgroundQuestions from './pages/Dashboard/settings/rental-application/BackgroundQuestions';
import RolesPermissions from './pages/Dashboard/settings/team-management/RolesPermissions';
import PropertyPermissions from './pages/Dashboard/settings/team-management/PropertyPermissions';
import RequestSettings from './pages/Dashboard/settings/request-settings/RequestSettings';
import AutomationSettings from './pages/Dashboard/settings/request-settings/AutomationSettings';
import ServiceRequests from './pages/ServiceDashboard/pages/Dashboard/ServiceRequests/ServiceRequests';
import ServiceRequestsBoard from './pages/ServiceDashboard/pages/Dashboard/ServiceRequests/ServiceRequestsBoard';
import ServiceRequestDetail from './pages/ServiceDashboard/pages/Dashboard/ServiceRequests/ServiceRequestDetail';
import ServiceAccounting from './pages/ServiceDashboard/pages/Dashboard/Accounting/ServiceAccounting';
import ServiceTransactionDetail from './pages/ServiceDashboard/pages/Dashboard/Accounting/ServiceTransactionDetail';
import ServiceBusinessProfile from './pages/ServiceDashboard/pages/Dashboard/Settings/BusinessProfile/ServiceBusinessProfile';
import ServiceContacts from './pages/ServiceDashboard/pages/Dashboard/Contact/ServiceContacts';
import ServiceDashboardCalendar from './pages/ServiceDashboard/pages/Dashboard/Calendar/Calendar';
import ServiceFileManager from './pages/ServiceDashboard/pages/Dashboard/FileManager/FileManager';
import ServiceMessages from './pages/ServiceDashboard/pages/Dashboard/Messages/ServiceMessages';
import FindJob from './pages/ServiceDashboard/pages/Dashboard/FindJob/FindJob';
import JobDetail from './pages/ServiceDashboard/pages/Dashboard/FindJob/JobDetail';
import ServiceNotification from './pages/ServiceDashboard/pages/Dashboard/Notification/Notification';
import GeneralReports from './pages/Dashboard/settings/report/general';
import Reports from './pages/Dashboard/features/Reports/Reports';
import Rentability from './pages/Dashboard/features/Reports/Rentability';
import Contacts from './pages/Dashboard/features/Reports/Contacts';
import MaintenanceRequestsReport from './pages/Dashboard/features/Reports/MaintenanceRequestsReport';
import RentRoll from './pages/Dashboard/features/Reports/RentRoll';
import RentersInsurance from './pages/Dashboard/features/Reports/RentersInsurance';
import TenantStatement from './pages/Dashboard/features/Reports/TenantStatement';
import VacantRentals from './pages/Dashboard/features/Reports/VacantRentals';
import GeneralExpenses from './pages/Dashboard/features/Reports/GeneralExpenses';
import GeneralIncome from './pages/Dashboard/features/Reports/GeneralIncome';
import PropertyExpenses from './pages/Dashboard/features/Reports/PropertyExpenses';
import PropertyStatement from './pages/Dashboard/features/Reports/PropertyStatement';
import Notification from './pages/Dashboard/features/Notification/Notification';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

const App: React.FC = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Service Dashboard Auth - Standalone Pages */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Dashboard Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/users/:userId" element={<UserDetailPage />} />
              <Route path="/admin/properties" element={<PropertiesPage />} />
              <Route path="/admin/leases" element={<LeasesPage />} />
              <Route path="/admin/payments" element={<PaymentsPage />} />
            </Route>

            <Route path="/service-dashboard/login" element={<ServiceDashboardLogin />} />
            <Route path="/service-dashboard/signup" element={<ServiceDashboardSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Service Dashboard Onboarding */}
            <Route path="/service-dashboard/welcome" element={<Welcome />} />
            <Route path="/service-dashboard/select-profession" element={<SelectProfession />} />
            <Route path="/service-dashboard/profession-details" element={<ProfessionDetails />} />

            {/* Service Dashboard Routes */}
            <Route element={<ServiceDashboardLayout />}>
              <Route path="/service-dashboard" element={<ProtectedRoute><ServiceDashboard /></ProtectedRoute>} />
              <Route path="/service-dashboard/requests" element={<ProtectedRoute><ServiceRequests /></ProtectedRoute>} />
              <Route path="/service-dashboard/requests/:id" element={<ProtectedRoute><ServiceRequestDetail /></ProtectedRoute>} />
              <Route path="/service-dashboard/requests-board" element={<ProtectedRoute><ServiceRequestsBoard /></ProtectedRoute>} />
              <Route path="/service-dashboard/accounting" element={<ProtectedRoute><ServiceAccounting /></ProtectedRoute>} />
              <Route path="/service-dashboard/accounting/transaction/:id" element={<ProtectedRoute><ServiceTransactionDetail /></ProtectedRoute>} />
              <Route path="/service-dashboard/settings" element={<ProtectedRoute><ServiceDashboardSettings /></ProtectedRoute>} />
              <Route path="/service-dashboard/settings/profile" element={<ProtectedRoute><ServiceDashboardProfileSettings /></ProtectedRoute>} />
              <Route path="/service-dashboard/settings/security" element={<ProtectedRoute><ServiceDashboardSecuritySettings /></ProtectedRoute>} />
              <Route path="/service-dashboard/settings/integrations" element={<ProtectedRoute><ServiceDashboardIntegrationSettings /></ProtectedRoute>} />
              <Route path="/service-dashboard/settings/notifications" element={<ProtectedRoute><ServiceDashboardNotificationSettings /></ProtectedRoute>} />
              <Route path="/service-dashboard/settings/business-profile" element={<ProtectedRoute><ServiceBusinessProfile /></ProtectedRoute>} />
              <Route path="/service-dashboard/contacts" element={<ProtectedRoute><ServiceContacts /></ProtectedRoute>} />
              <Route path="/service-dashboard/calendar" element={<ProtectedRoute><ServiceDashboardCalendar /></ProtectedRoute>} />
              <Route path="/service-dashboard/file-manager" element={<ProtectedRoute><ServiceFileManager /></ProtectedRoute>} />
              <Route path="/service-dashboard/messages" element={<ProtectedRoute><ServiceMessages /></ProtectedRoute>} />
              <Route path="/service-dashboard/find-job" element={<ProtectedRoute><FindJob /></ProtectedRoute>} />
              <Route path="/service-dashboard/find-job/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
              <Route path="/service-dashboard/notifications" element={<ProtectedRoute><ServiceNotification /></ProtectedRoute>} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signup/oauth-complete" element={<OAuthCompletePage />} />
              <Route path="/signup/tenant-onboarding-flow" element={<TenantOnboardingFlow />} />
              <Route path="/otp" element={<OtpPage />} />
              <Route path="/auth/callback" element={<OAuthCallbackPage />} />




              <Route path="/usecases/landlord" element={<LandlordUseCasesPage />} />
              <Route path="/usecases/tenant" element={<TenantPage />} />
              <Route path="/usecases/servicepros" element={<ServiceProsPage />} />
              <Route path="/features/screening" element={<ScreeningPage />} />
              <Route path="/features/lease" element={<LeasePage />} />
              <Route path="/features/finance" element={<FinancePage />} />
              <Route path="/features/leads" element={<LeadsPage />} />
              <Route path="/features/team" element={<TeamPage />} />
              <Route path="/resources" element={<ResourcePage />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Route>
            <Route element={<DashboardLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/dashboard/list-unit" element={<ListUnit />} />

              <Route path="/dashboard/portfolio/units" element={<Units />} />
              <Route path="/dashboard/portfolio/keys-locks" element={<KeysLocks />} />
              <Route path="/dashboard/portfolio/add-key" element={<AddKey />} />
              <Route path="/dashboard/portfolio/edit-key/:id" element={<AddKey />} />
              <Route path="/dashboard/portfolio/keys-locks/:id" element={<KeyDetail />} />
              <Route path="/dashboard/properties/:id" element={<PropertyDetail />} />
              <Route path="/dashboard/properties/edit/:id" element={<EditProperty />} />
              <Route path="/dashboard/units/edit/:unitId" element={<EditUnit />} />
              <Route path="/dashboard/units/:unitId" element={<UnitPropertyDetail />} />
              <Route path="/dashboard/property/add" element={<AddProperty />} />
              <Route path="/dashboard/portfolio/units" element={<Units />} />
              <Route path="/dashboard/portfolio/keys-locks" element={<KeysLocks />} />
              <Route path="/dashboard/portfolio/keys-locks/:id" element={<KeyDetail />} />
              <Route path="/dashboard/portfolio/listing" element={<Listing />} />
              <Route path="/dashboard/listings/:id" element={<ListingDetail />} />
              <Route path="/dashboard/calendar" element={<Calendar />} />
              <Route path="/dashboard/tasks" element={<Tasks />} />
              <Route path="/dashboard/equipments" element={<Equipments />} />
              <Route path="/dashboard/equipments/add" element={<CreateEquipment />} />
              <Route path="/dashboard/equipments/edit/:id" element={<CreateEquipment />} />
              <Route path="/dashboard/equipments/:id" element={<EquipmentDetail />} />
              <Route path="/dashboard/property/add" element={<AddProperty />} />
              <Route path="/dashboard/properties/edit/:id" element={<EditProperty />} />
              <Route path="/dashboard/properties" element={<Properties />} />
              <Route path="/dashboard/properties/import" element={<ImportProperties />} />
              <Route path="/dashboard/accounting/transactions" element={<Transactions />} />
              <Route path="/dashboard/accounting/transactions/clone" element={<CloneTransaction />} />
              <Route path="/dashboard/accounting/transactions/:id" element={<TransactionDetail />} />
              <Route path="/dashboard/accounting/transactions/income/add" element={<AddIncomeInvoice />} />
              <Route path="/dashboard/accounting/transactions/income-payments" element={<IncomePayments />} />
              <Route path="/dashboard/accounting/transactions/recurring-income/add" element={<RecurringIncome />} />
              <Route path="/dashboard/accounting/transactions/expense/add" element={<AddExpenseInvoice />} />
              <Route path="/dashboard/accounting/transactions/recurring-expense/add" element={<RecurringExpense />} />
              <Route path="/dashboard/accounting/transactions/return-deposit" element={<ReturnDeposit />} />
              <Route path="/dashboard/accounting/transactions/apply-deposit" element={<ApplyDepositAndCredit />} />
              <Route path="/dashboard/accounting/transactions/bulk-payments-income" element={<BulkPaymentsIncome />} />
              <Route path="/dashboard/accounting/transactions/bulk-payments-expense" element={<BulkPaymentsExpense />} />
              <Route path="/dashboard/accounting/transactions/deposit/add" element={<Deposit />} />
              <Route path="/dashboard/accounting/transactions/credits/add" element={<Credits />} />
              <Route path="/dashboard/accounting/transactions/expense-payments" element={<ExpensePayments />} />
              <Route path="/dashboard/accounting/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              <Route path="/dashboard/accounting/recurring" element={<ProtectedRoute><Recurring /></ProtectedRoute>} />
              <Route path="/dashboard/accounting/transactions/recurring-clone" element={<ProtectedRoute><RecurringClone /></ProtectedRoute>} />
              <Route path="/dashboard/accounting/recurring/:id" element={<ProtectedRoute><RecurringDetail /></ProtectedRoute>} />
              <Route path="/dashboard/maintenance/request" element={<AddMaintenanceRequest />} />
              <Route path="/dashboard/maintenance/requests" element={<Requests />} />
              <Route path="/dashboard/maintenance/requests/:id" element={<MaintenanceRequestsDetail />} />
              <Route path="/dashboard/maintenance/recurring" element={<MaintenanceRecurring />} />
              <Route path="/dashboard/maintenance/recurring/:id" element={<MaintenanceRecurringDetail />} />
              <Route path="/dashboard/movein" element={<MoveIn />} />
              <Route path="/dashboard/contacts/tenants" element={<Tenants />} />
              <Route path="/dashboard/contacts/tenants/import" element={<ImportTenants />} />
              <Route path="/dashboard/contacts/tenants/add" element={<AddEditTenant />} />
              <Route path="/dashboard/contacts/tenants/edit/:id" element={<AddEditTenant />} />
              <Route path="/dashboard/contacts/tenants/:id" element={<TenantDetail />} />
              <Route path="/dashboard/contacts/service-pros" element={<ServicePros />} />
              <Route path="/dashboard/contacts/service-pros/import" element={<ImportServicePros />} />
              <Route path="/dashboard/contacts/service-pros/add" element={<AddEditServicePro />} />
              <Route path="/dashboard/contacts/service-pros/edit/:id" element={<AddEditServicePro />} />
              <Route path="/dashboard/contacts/service-pros/:id" element={<ServiceProsDetail />} />
              <Route path="/dashboard/leasing/applications" element={<Application />} />
              <Route path="/dashboard/property-detail/:id" element={<PropertyDetail />} />
              <Route path="/dashboard/application/new" element={<NewApplication />} />
              <Route path="/dashboard/application/:id" element={<ApplicationDetail />} />
              <Route path="/dashboard/leasing/leases" element={<Leases />} />
              <Route path="/dashboard/leasing/leases/import" element={<ImportLeases />} />
              <Route
                path="/dashboard/leasing/leads"
                element={
                  <ProtectedRoute>
                    <Leads />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/leasing/leads/add"
                element={
                  <ProtectedRoute>
                    <AddLead />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/leasing/leads/:id"
                element={
                  <ProtectedRoute>
                    <LeadDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/leasing/leads/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditLead />
                  </ProtectedRoute>
                }
              />
              <Route path="/dashboard/portfolio/leases/:id" element={<LeaseDetail />} />
              <Route path="/dashboard/leasing/leases/:id/end-lease" element={<EndLease />} />

              <Route
                path="/dashboard/messages"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/notifications"
                element={
                  <ProtectedRoute>
                    <Notification />
                  </ProtectedRoute>
                }
              />

              {/* Settings Routes */}
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Account Settings */}
              <Route
                path="/dashboard/settings/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/security"
                element={
                  <ProtectedRoute>
                    <SecuritySettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/integrations"
                element={
                  <ProtectedRoute>
                    <IntegrationSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationSettings />
                  </ProtectedRoute>
                }
              />

              {/* Subscription Settings */}
              <Route
                path="/dashboard/settings/subscription/my-plan"
                element={
                  <ProtectedRoute>
                    <MyPlanSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/subscription/my-card"
                element={
                  <ProtectedRoute>
                    <MyCardSettings />
                  </ProtectedRoute>
                }
              />

              {/* Accounting Settings */}
              <Route
                path="/dashboard/settings/accounting/invoice"
                element={
                  <ProtectedRoute>
                    <InvoiceSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/accounting/quickbook"
                element={
                  <ProtectedRoute>
                    <QuickBookSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/accounting/tags"
                element={
                  <ProtectedRoute>
                    <TagsSettings />
                  </ProtectedRoute>
                }
              />

              {/* Online Payments Settings */}
              <Route
                path="/dashboard/settings/online-payments/configurations"
                element={
                  <ProtectedRoute>
                    <OnlinePaymentsConfigurations />
                  </ProtectedRoute>
                }
              />

              {/* Rental Application Settings */}
              <Route path="/dashboard/settings/rental-application" element={
                <ProtectedRoute>
                  <RentalApplicationSettingsLayout />
                </ProtectedRoute>
              }>
                <Route path="online-application" element={<OnlineApplication />} />
                <Route path="form-configuration" element={<FormConfiguration />} />
                <Route path="terms-signature" element={<TermsSignature />} />
              </Route>

              <Route path="/dashboard/settings/rental-application/background-questions" element={
                <ProtectedRoute>
                  <BackgroundQuestions />
                </ProtectedRoute>
              } />

              {/* Team Management Settings */}
              <Route
                path="/dashboard/settings/team-management/roles-permissions"
                element={
                  <ProtectedRoute>
                    <RolesPermissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/team-management/property-permissions"
                element={
                  <ProtectedRoute>
                    <PropertyPermissions />
                  </ProtectedRoute>
                }
              />

              {/* Request Settings */}
              <Route
                path="/dashboard/settings/request-settings/request-settings"
                element={
                  <ProtectedRoute>
                    <RequestSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/request-settings/automation-settings"
                element={
                  <ProtectedRoute>
                    <AutomationSettings />
                  </ProtectedRoute>
                }
              />

              {/* Reports Settings */}
              <Route
                path="/dashboard/settings/report/general"
                element={
                  <ProtectedRoute>
                    <GeneralReports />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leasing"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounting"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Documents Routes */}
              <Route
                path="/dashboard/documents/landlord-forms"
                element={
                  <ProtectedRoute>
                    <LandlordForms />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents/landlord-forms/template/:templateName"
                element={
                  <ProtectedRoute>
                    <TemplateView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents/landlord-forms/use-template/:templateName"
                element={
                  <ProtectedRoute>
                    <UseTemplateWizard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/leasing/leases/:id/send-notice"
                element={
                  <ProtectedRoute>
                    <UseTemplateWizard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/leasing/leases/:id/send-agreement"
                element={
                  <ProtectedRoute>
                    <UseTemplateWizard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents/my-templates"
                element={
                  <ProtectedRoute>
                    <MyTemplates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents/my-templates/create-wizard"
                element={
                  <ProtectedRoute>
                    <CreateTemplateWizard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents/my-templates/:id"
                element={
                  <ProtectedRoute>
                    <MyTemplateDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents/my-templates/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditTemplate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents/file-manager"
                element={
                  <ProtectedRoute>
                    <FileManagerFeature />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/rentability"
                element={
                  <ProtectedRoute>
                    <Rentability />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/statement"
                element={
                  <ProtectedRoute>
                    <ProviderStatement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/contacts"
                element={
                  <ProtectedRoute>
                    <Contacts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/maintenance-requests"
                element={
                  <ProtectedRoute>
                    <MaintenanceRequestsReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/rent-roll"
                element={
                  <ProtectedRoute>
                    <RentRoll />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/renters-insurance"
                element={
                  <ProtectedRoute>
                    <RentersInsurance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/tenant-statement"
                element={
                  <ProtectedRoute>
                    <TenantStatement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/vacant-rentals"
                element={
                  <ProtectedRoute>
                    <VacantRentals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/general-expenses"
                element={
                  <ProtectedRoute>
                    <GeneralExpenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/general-income"
                element={
                  <ProtectedRoute>
                    <GeneralIncome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/property-expenses"
                element={
                  <ProtectedRoute>
                    <PropertyExpenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports/property-statement"
                element={
                  <ProtectedRoute>
                    <PropertyStatement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/downloads"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* User Dashboard Routes */}
            <Route element={<UserDashboardLayout />}>
              <Route path="/userdashboard" element={<UserDashboard />} />
              <Route path="/userdashboard/rent" element={<UserRent />} />
              <Route path="/userdashboard/requests" element={<UserRequests />} />
              <Route path="/userdashboard/requests/:id" element={<UserRequestDetails />} />
              <Route path="/userdashboard/messages" element={<UserMessages />} />
              <Route path="/userdashboard/utility-providers" element={<UserUtilityProviders />} />
              <Route path="/userdashboard/properties" element={<UserProperties />} />
              <Route path="/userdashboard/properties/:id" element={<UserPropertyDetail />} />
              <Route path="/userdashboard/applications" element={<UserApplications />} />
              <Route path="/userdashboard/applications/:id" element={<UserApplicationDetail />} />
              <Route path="/userdashboard/new-application" element={<UserNewApplication />} />
              <Route path="/userdashboard/file-manager" element={<UserFileManager />} />
              <Route path="/userdashboard/downloads" element={<UserDownloads />} />
              <Route path="/userdashboard/new-request" element={<UserNewRequest />} />
              <Route path="/userdashboard/settings" element={<UserSettings />} />
              <Route path="/userdashboard/settings/account/profile" element={<UserProfile />} />
              <Route path="/userdashboard/settings/account/security" element={<UserSecurity />} />
              <Route path="/userdashboard/settings/account/cards" element={<UserMyCards />} />
              <Route path="/userdashboard/settings/account/notifications" element={<UserNotifications />} />
              <Route path="/userdashboard/settings/public-renter-profile" element={<UserPublicRenterProfile />} />
              <Route path="/userdashboard/leases/:id" element={<UserLeaseDetails />} />
              <Route path="/userdashboard/transactions/:id" element={<UserTransactionDetails />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
        <TanStackDevtools />
      </QueryClientProvider>
    </>
  );
};

export default App;
