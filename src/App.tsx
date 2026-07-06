import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePageTracking } from './hooks/usePageTracking';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ReactQueryDevtools as TanStackDevtools } from '@tanstack/react-query-devtools';
import { ChatToast } from './components/chat/ChatToast';
import AppLayout from './components/layout/AppLayout';
import { ProtectedRoute, ServiceProtectedRoute, TenantProtectedRoute, GuestRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/dashboardlayout/DashboardLayout';
const HomePage = lazy(() => import('./pages/basewebsite/home'));
const ScreeningPage = lazy(() => import('./pages/basewebsite/features/screening/index'));
const LeasePage = lazy(() => import('./pages/basewebsite/features/lease/index'));
const FinancePage = lazy(() => import('./pages/basewebsite/features/finance/index'));
const LeadsPage = lazy(() => import('./pages/basewebsite/features/leads/index'));
import { RentalApplicationSettingsLayout } from './components/common/RentalApplicationSettingsLayout';
const PricingPage = lazy(() => import('./pages/basewebsite/pricing'));
const SelectPlanPage = lazy(() => import('./pages/onboarding/SelectPlanPage'));
const TermsOfService = lazy(() => import('./pages/basewebsite/legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/basewebsite/legal/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/basewebsite/legal/CookiePolicy'));
const AcceptInvitation = lazy(() => import('./pages/basewebsite/team/AcceptInvitation'));
import { ToastProvider } from './components/common/Toast';
import { PushForegroundListener } from './components/PushForegroundListener';
import AIChatButton from './components/common/AIChatButton';
import LoginPage from './pages/basewebsite/auth/login';
import SignUpPage from './pages/basewebsite/auth/signUp';
import { GlobalLoader } from './components/common/GlobalLoader';
import Welcome from './pages/ServiceDashboard/pages/onboarding/Welcome';
import SelectProfession from './pages/ServiceDashboard/pages/onboarding/SelectProfession';
import ProfessionDetails from './pages/ServiceDashboard/pages/onboarding/ProfessionDetails';
import ServiceDashboardLayout from './components/service-dashboard/layout/ServiceDashboardLayout';
const ServiceDashboard = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/ServiceDashboard'));
const ServiceDashboardSettings = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Settings/ServiceDashboardSettings'));
const ServiceDashboardProfileSettings = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Settings/AccountSettings/ProfileSettings'));
const ServiceDashboardSecuritySettings = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Settings/AccountSettings/SecuritySettings'));
const ServiceDashboardIntegrationSettings = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Settings/AccountSettings/IntegrationSettings'));
const ServiceDashboardNotificationSettings = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Settings/AccountSettings/NotificationSettings'));
const OtpPage = lazy(() => import('./pages/basewebsite/auth/otp'));
const OAuthCallbackPage = lazy(() => import('./pages/basewebsite/auth/oauth-callback'));
const OAuthCompletePage = lazy(() => import('./pages/basewebsite/auth/signUp/oauth-complete'));
const MobileAutoLogin = lazy(() => import('./pages/basewebsite/auth/mobile-auto-login/MobileAutoLogin'));
import AutoLoginProvider from './components/AutoLoginProvider';
import { TeamPermissionProvider, useTeamPermissions } from './context/TeamPermissionContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { Navigate, Outlet } from 'react-router-dom';
import { usePlanFeatures } from './hooks/usePlanFeatures';
import UpgradeModal from './components/common/UpgradeModal';
import { Lock } from 'lucide-react';

const TeamPermissionGuard: React.FC<{ module: string; children: React.ReactNode }> = ({ module, children }) => {
  const { isTeamMember, canView } = useTeamPermissions();
  if (isTeamMember && !canView(module)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const PlanRouteGuard: React.FC<{ feature: string }> = ({ feature }) => {
  const { planGateInfo, isLoading } = usePlanFeatures();
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);

  if (isLoading) return null;

  const { allowed, requiredPlan, requiredPlanName, featureLabel } = planGateInfo(feature);

  if (allowed) return <Outlet />;

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 p-8 font-['Urbanist']">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Lock size={28} className="text-gray-400" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{featureLabel}</h2>
          <p className="text-gray-500 text-sm">
            This feature requires the <strong>{requiredPlanName}</strong> plan or higher.
          </p>
        </div>
        <button
          onClick={() => setUpgradeOpen(true)}
          className="px-6 py-2.5 bg-[#3A6D6C] text-white font-semibold rounded-xl hover:bg-[#2e5857] transition-colors text-sm"
        >
          Upgrade to {requiredPlanName}
        </button>
      </div>
      {requiredPlan && (
        <UpgradeModal
          isOpen={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          requiredPlan={requiredPlan}
          featureLabel={featureLabel}
        />
      )}
    </>
  );
};
const TenantOnboardingFlow = lazy(() => import('./pages/basewebsite/auth/signUp/sections/TenantOnboardingFlow').then((mod) => ({ default: mod.TenantOnboardingFlow })));
const TeamPage = lazy(() => import('./pages/basewebsite/features/team/index'));
const LandlordUseCasesPage = lazy(() => import('./pages/basewebsite/usecases/landlord'));
const ResourcePage = lazy(() => import('./pages/basewebsite/resources'));
const TenantPage = lazy(() => import('./pages/basewebsite/usecases/tenant'));
const ServiceProsPage = lazy(() => import('./pages/basewebsite/usecases/servicepros'));
const BecomeServiceProvider = lazy(() => import('./pages/basewebsite/features/BecomeServiceProvider'));
const ListingPreview = lazy(() => import('./pages/Preview/ListingPreview'));
const PublicRenterProfilePage = lazy(() => import('./pages/PublicRenterProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ListUnit = lazy(() => import('./pages/Dashboard/features/ListUnit'));
const AddProperty = lazy(() => import('./pages/Dashboard/features/Properties/AddProperty'));
const EditProperty = lazy(() => import('./pages/Dashboard/features/Properties/EditProperty'));
const Transactions = lazy(() => import('./pages/Dashboard/features/Transactions/Transactions'));
const AddIncomeInvoice = lazy(() => import('./pages/Dashboard/features/Transactions/AddIncomeInvoice'));
const CloneTransaction = lazy(() => import('./pages/Dashboard/features/Transactions/CloneTransaction'));
const RecurringIncome = lazy(() => import('./pages/Dashboard/features/Transactions/RecurringIncome'));
const RecurringExpense = lazy(() => import('./pages/Dashboard/features/Transactions/RecurringExpense'));
const ReturnDeposit = lazy(() => import('./pages/Dashboard/features/Transactions/ReturnDeposit'));
const ApplyDepositAndCredit = lazy(() => import('./pages/Dashboard/features/Transactions/ApplyDepositAndCredit'));
const BulkPaymentsIncome = lazy(() => import('./pages/Dashboard/features/Transactions/BulkPaymentsIncome'));
const BulkPaymentsExpense = lazy(() => import('./pages/Dashboard/features/Transactions/BulkPaymentsExpense'));
const Deposit = lazy(() => import('./pages/Dashboard/features/Transactions/Deposit'));
const Credits = lazy(() => import('./pages/Dashboard/features/Transactions/Credits'));
const IncomePayments = lazy(() => import('./pages/Dashboard/features/Transactions/IncomePayments'));
const ExpensePayments = lazy(() => import('./pages/Dashboard/features/Transactions/ExpensePayments'));
const AddExpenseInvoice = lazy(() => import('./pages/Dashboard/features/Transactions/AddExpenseInvoice'));
const Payments = lazy(() => import('./pages/Dashboard/features/Payments/Payments'));
const Recurring = lazy(() => import('./pages/Dashboard/features/Recurring/Recurring'));
const RecurringDetail = lazy(() => import('./pages/Dashboard/features/Recurring/RecurringDetail'));
const RecurringClone = lazy(() => import('./pages/Dashboard/features/Transactions/RecurringClone'));
const AddMaintenanceRequest = lazy(() => import('./pages/Dashboard/features/Maintenance/AddMaintenanceRequest'));
const Requests = lazy(() => import('./pages/Dashboard/features/Maintenance/MaintenanceRequests'));
const MaintenanceRequestsDetail = lazy(() => import('./pages/Dashboard/features/Maintenance/MaintenanceRequestsDetail'));
const MaintenanceRecurring = lazy(() => import('./pages/Dashboard/features/Maintenance/MaintenanceRecurring'));
const MaintenanceRecurringDetail = lazy(() => import('./pages/Dashboard/features/Maintenance/MaintenanceRecurringDetail'));
const Properties = lazy(() => import('./pages/Dashboard/features/Properties/Properties'));
const ImportProperties = lazy(() => import('./pages/Dashboard/features/Properties/ImportProperties/ImportProperties'));
const Equipments = lazy(() => import('./pages/Dashboard/features/Equipments/Equipments'));
const EquipmentDetail = lazy(() => import('./pages/Dashboard/features/Equipments/EquipmentDetail'));
const CreateEquipment = lazy(() => import('./pages/Dashboard/features/Equipments/CreateEquipment'));
const MoveIn = lazy(() => import('./pages/Dashboard/features/MoveIn/MoveIn'));
const PropertyDetail = lazy(() => import('./pages/Dashboard/features/Properties/PropertyDetail'));
const UnitPropertyDetail = lazy(() => import('./pages/Dashboard/features/Units/UnitPropertyDetail'));
const EditUnit = lazy(() => import('./pages/Dashboard/features/Units/EditUnit'));
const Listing = lazy(() => import('./pages/Dashboard/features/Listing/Listing'));
const ListingDetail = lazy(() => import('./pages/Dashboard/features/Listing/ListingDetail'));
const Calendar = lazy(() => import('./pages/Dashboard/features/Calendar/Calendar'));
const Tasks = lazy(() => import('./pages/Dashboard/features/Tasks/Tasks'));
const Tenants = lazy(() => import('./pages/Dashboard/features/Tenants/Tenants'));
const ImportTenants = lazy(() => import('./pages/Dashboard/features/Tenants/ImportTenants/ImportTenants'));
const AddEditTenant = lazy(() => import('./pages/Dashboard/features/Tenants/AddEditTenant'));
const TenantDetail = lazy(() => import('./pages/Dashboard/features/Tenants/TenantDetail'));
const Units = lazy(() => import('./pages/Dashboard/features/Units/Units'));
const KeysLocks = lazy(() => import('./pages/Dashboard/features/KeysLocks/KeysLocks'));
const KeyDetail = lazy(() => import('./pages/Dashboard/features/KeysLocks/KeyDetail'));
const Leases = lazy(() => import('./pages/Dashboard/features/Leases/Leases'));
const ImportLeases = lazy(() => import('./pages/Dashboard/features/Leases/ImportLeases/ImportLeases'));
const LeaseDetail = lazy(() => import('./pages/Dashboard/features/Leases/LeaseDetail'));
const EndLease = lazy(() => import('./pages/Dashboard/features/Leases/EndLease'));
const AddKey = lazy(() => import('./pages/Dashboard/features/KeysLocks/AddKey'));
const ServicePros = lazy(() => import('./pages/Dashboard/features/ServicePros/ServicePros'));
const ImportServicePros = lazy(() => import('./pages/Dashboard/features/ServicePros/ImportServicePros/ImportServicePros'));
const AddEditServicePro = lazy(() => import('./pages/Dashboard/features/ServicePros/AddEditServicePro'));
const ServiceProsDetail = lazy(() => import('./pages/Dashboard/features/ServicePros/ServiceProsDetail'));
const Application = lazy(() => import('./pages/Dashboard/features/Application/Application'));
const NewApplication = lazy(() => import('./pages/Dashboard/features/Application/NewApplication'));
const ApplicationDetail = lazy(() => import('./pages/Dashboard/features/Application/ApplicationDetail'));
const ProviderStatement = lazy(() => import('./pages/Dashboard/features/ServicePros/ProviderStatement'));
const TransactionDetail = lazy(() => import('./pages/Dashboard/features/Transactions/TransactionDetail'));
const ChatPage = lazy(() => import('./pages/Dashboard/features/Messages/ChatPage'));
const AIChatPage = lazy(() => import('./pages/Dashboard/features/AIChat/AIChatPage'));
// Documents pages
const LandlordForms = lazy(() => import('./pages/Dashboard/features/Documents/landlordforms/LandlordForms'));
const TemplateView = lazy(() => import('./pages/Dashboard/features/Documents/landlordforms/TemplateView'));
const UseTemplateWizard = lazy(() => import('./pages/Dashboard/features/Documents/landlordforms/UseTemplateWizard'));
const MyTemplates = lazy(() => import('./pages/Dashboard/features/Documents/mytemplate/MyTemplates'));
const MyTemplateDetail = lazy(() => import('./pages/Dashboard/features/Documents/mytemplate/MyTemplateDetail'));
const EditTemplate = lazy(() => import('./pages/Dashboard/features/Documents/mytemplate/EditTemplate'));
const CreateTemplateWizard = lazy(() => import('./pages/Dashboard/features/Documents/mytemplate/CreateTemplateWizard'));
const Leads = lazy(() => import('./pages/Dashboard/features/Leads/leads'));
const AddLead = lazy(() => import('./pages/Dashboard/features/Leads/AddLead'));
const LeadDetail = lazy(() => import('./pages/Dashboard/features/Leads/LeadDetail'));
const EditLead = lazy(() => import('./pages/Dashboard/features/Leads/EditLead'));
const FileManagerFeature = lazy(() => import('./pages/Dashboard/features/FileManager/FileManager'));



// User Dashboard pages
import UserDashboardLayout from './components/userdashboard/UserDashboardLayout';
const UserDashboard = lazy(() => import('./pages/userdashboard/UserDashboard'));
const UserRent = lazy(() => import('./pages/userdashboard/features/Rent/UserRent'));
const UserRequests = lazy(() => import('./pages/userdashboard/features/Requests/UserRequests'));
const UserUtilityProviders = lazy(() => import('./pages/userdashboard/features/Utilities/UserUtilityProviders'));
const UserProperties = lazy(() => import('./pages/userdashboard/features/Properties/UserProperties'));
const UserApplications = lazy(() => import('./pages/userdashboard/features/Applications/UserApplications'));
const UserApplicationDetail = lazy(() => import('./pages/userdashboard/features/Applications/UserApplicationDetail'));
const UserFileManager = lazy(() => import('./pages/userdashboard/features/Utilities/UserFileManager'));
const UserDownloads = lazy(() => import('./pages/userdashboard/features/Utilities/UserDownloads'));
const UserNewRequest = lazy(() => import('./pages/userdashboard/features/Requests/UserNewRequest'));
const UserPropertyDetail = lazy(() => import('./pages/userdashboard/features/Properties/UserPropertyDetail'));
const UserSettings = lazy(() => import('./pages/userdashboard/features/Settings/UserSettings'));
const UserProfile = lazy(() => import('./pages/userdashboard/features/Profile/UserProfile'));
const UserSecurity = lazy(() => import('./pages/userdashboard/features/Profile/UserSecurity'));
const UserMyCards = lazy(() => import('./pages/userdashboard/features/Profile/UserMyCards'));
const UserNotifications = lazy(() => import('./pages/userdashboard/features/Profile/UserNotifications'));
const UserPublicRenterProfile = lazy(() => import('./pages/userdashboard/features/Profile/UserPublicRenterProfile'));
const UserLeaseDetails = lazy(() => import('./pages/userdashboard/features/Leases/UserLeaseDetails'));
const UserTransactionDetails = lazy(() => import('./pages/userdashboard/features/Transactions/UserTransactionDetails'));
const UserRequestDetails = lazy(() => import('./pages/userdashboard/features/Requests/UserRequestDetails'));
const UserMessages = lazy(() => import('./pages/userdashboard/features/Messages/UserMessages'));
const UserNewApplication = lazy(() => import('./pages/userdashboard/features/Applications/UserNewApplication'));
const UserNotificationFeed = lazy(() => import('./pages/userdashboard/features/Notification/UserNotificationFeed'));




// Settings pages
const Settings = lazy(() => import('./pages/Dashboard/settings/index'));
const ProfileSettings = lazy(() => import('./pages/Dashboard/settings/accountsetting/ProfileSettings'));
const SecuritySettings = lazy(() => import('./pages/Dashboard/settings/accountsetting/SecuritySettings'));
const IntegrationSettings = lazy(() => import('./pages/Dashboard/settings/accountsetting/IntegrationSettings'));
const NotificationSettings = lazy(() => import('./pages/Dashboard/settings/accountsetting/NotificationSettings'));
const MyPlanSettings = lazy(() => import('./pages/Dashboard/settings/subscription/MyPlanSettings'));
const MyCardSettings = lazy(() => import('./pages/Dashboard/settings/subscription/MyCardSettings'));
const InvoiceSettings = lazy(() => import('./pages/Dashboard/settings/accounting/invoice'));
const TagsSettings = lazy(() => import('./pages/Dashboard/settings/accounting/tags'));
const OnlinePaymentsConfigurations = lazy(() => import('./pages/Dashboard/settings/online-payments/configurations'));
const OnlineApplication = lazy(() => import('./pages/Dashboard/settings/rental-application/OnlineApplication'));
const FormConfiguration = lazy(() => import('./pages/Dashboard/settings/rental-application/FormConfiguration'));
const BackgroundQuestions = lazy(() => import('./pages/Dashboard/settings/rental-application/BackgroundQuestions'));
const RolesPermissions = lazy(() => import('./pages/Dashboard/settings/team-management/RolesPermissions'));
const PropertyPermissions = lazy(() => import('./pages/Dashboard/settings/team-management/PropertyPermissions'));
const RequestSettings = lazy(() => import('./pages/Dashboard/settings/request-settings/RequestSettings'));
const AutomationSettings = lazy(() => import('./pages/Dashboard/settings/request-settings/AutomationSettings'));
const ServiceRequests = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/ServiceRequests/ServiceRequests'));
const ServiceRequestsBoard = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/ServiceRequests/ServiceRequestsBoard'));
const ServiceRequestDetail = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/ServiceRequests/ServiceRequestDetail'));
const ServiceAccounting = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Accounting/ServiceAccounting'));
const ServiceTransactionDetail = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Accounting/ServiceTransactionDetail'));
const ServiceBusinessProfile = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Settings/BusinessProfile/ServiceBusinessProfile'));
const ServiceContacts = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Contact/ServiceContacts'));
const ServiceDashboardCalendar = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Calendar/Calendar'));
const ServiceFileManager = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/FileManager/FileManager'));
const ServiceMessages = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Messages/ServiceMessages'));
const FindJob = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/FindJob/FindJob'));
const JobDetail = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/FindJob/JobDetail'));
const ServiceNotification = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Notification/ServiceNotification'));
const ServiceOnlinePayment = lazy(() => import('./pages/ServiceDashboard/pages/Dashboard/Settings/OnlinePayment/ServiceOnlinePayment'));
const Reports = lazy(() => import('./pages/Dashboard/features/Reports/Reports'));
const Rentability = lazy(() => import('./pages/Dashboard/features/Reports/Rentability'));
const Contacts = lazy(() => import('./pages/Dashboard/features/Reports/Contacts'));
const MaintenanceRequestsReport = lazy(() => import('./pages/Dashboard/features/Reports/MaintenanceRequestsReport'));
const RentRoll = lazy(() => import('./pages/Dashboard/features/Reports/RentRoll'));
const RentersInsurance = lazy(() => import('./pages/Dashboard/features/Reports/RentersInsurance'));
const TenantStatement = lazy(() => import('./pages/Dashboard/features/Reports/TenantStatement'));
const VacantRentals = lazy(() => import('./pages/Dashboard/features/Reports/VacantRentals'));
const GeneralExpenses = lazy(() => import('./pages/Dashboard/features/Reports/GeneralExpenses'));
const GeneralIncome = lazy(() => import('./pages/Dashboard/features/Reports/GeneralIncome'));
const PropertyExpenses = lazy(() => import('./pages/Dashboard/features/Reports/PropertyExpenses'));
const PropertyStatement = lazy(() => import('./pages/Dashboard/features/Reports/PropertyStatement'));
const Notification = lazy(() => import('./pages/Dashboard/features/Notification/Notification'));
const NotFound = lazy(() => import('./pages/NotFound'));


// Inner component so usePageTracking can sit inside <BrowserRouter>.
const RoutedApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePageTracking();
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
        <PushForegroundListener />
        <BrowserRouter>
          <RoutedApp>
          <AutoLoginProvider>
          <TeamPermissionProvider>
          <SubscriptionProvider>
          <GlobalLoader />
          <AIChatButton />
          <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading…</div>}>
          <Routes>
            {/* Forgot password route removed; use basewebsite auth flows instead */}

            {/* Service Dashboard Onboarding */}
            <Route path="/service-dashboard/welcome" element={<Welcome />} />
            <Route path="/service-dashboard/select-profession" element={<SelectProfession />} />
            <Route path="/service-dashboard/profession-details" element={<ProfessionDetails />} />

            {/* Service Dashboard Routes */}
            <Route element={<ServiceDashboardLayout />}>
              <Route path="/service-dashboard" element={<ServiceProtectedRoute><ServiceDashboard /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/requests" element={<ServiceProtectedRoute><ServiceRequests /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/requests/:id" element={<ServiceProtectedRoute><ServiceRequestDetail /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/requests-board" element={<ServiceProtectedRoute><ServiceRequestsBoard /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/accounting" element={<ServiceProtectedRoute><ServiceAccounting /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/accounting/transaction/:id" element={<ServiceProtectedRoute><ServiceTransactionDetail /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings" element={<ServiceProtectedRoute><ServiceDashboardSettings /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings/profile" element={<ServiceProtectedRoute><ServiceDashboardProfileSettings /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings/security" element={<ServiceProtectedRoute><ServiceDashboardSecuritySettings /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings/integrations" element={<ServiceProtectedRoute><ServiceDashboardIntegrationSettings /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings/notifications" element={<ServiceProtectedRoute><ServiceDashboardNotificationSettings /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings/business-profile" element={<ServiceProtectedRoute><ServiceBusinessProfile /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings/online-payment" element={<ServiceProtectedRoute><ServiceOnlinePayment /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings/bank-account" element={<ServiceProtectedRoute><ServiceOnlinePayment /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings/entities" element={<ServiceProtectedRoute><ServiceOnlinePayment /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/settings/tax-forms" element={<ServiceProtectedRoute><ServiceOnlinePayment /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/contacts" element={<ServiceProtectedRoute><ServiceContacts /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/calendar" element={<ServiceProtectedRoute><ServiceDashboardCalendar /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/file-manager" element={<ServiceProtectedRoute><ServiceFileManager /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/messages" element={<ServiceProtectedRoute><ServiceMessages /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/find-job" element={<ServiceProtectedRoute><FindJob /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/find-job/:id" element={<ServiceProtectedRoute><JobDetail /></ServiceProtectedRoute>} />
              <Route path="/service-dashboard/notifications" element={<ServiceProtectedRoute><ServiceNotification /></ServiceProtectedRoute>} />
            </Route>

            <Route path="/preview/:id" element={<ListingPreview />} />
            <Route path="/renter-profile/:slug" element={<PublicRenterProfilePage />} />

            {/* Auth routes — no navbar/footer */}
            <Route path="/signup/oauth-complete" element={<OAuthCompletePage />} />
            <Route path="/signup/tenant-onboarding-flow" element={<TenantOnboardingFlow />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/auth/callback" element={<OAuthCallbackPage />} />
            <Route path="/auth/mobile-login" element={<MobileAutoLogin />} />
            <Route path="/onboarding/plan" element={<SelectPlanPage />} />
            <Route element={<AppLayout />}>
              <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/forgot-password" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />
              <Route path="/" element={<GuestRoute><HomePage /></GuestRoute>} />
              <Route path="/usecases/landlord" element={<GuestRoute><LandlordUseCasesPage /></GuestRoute>} />
              <Route path="/usecases/tenant" element={<GuestRoute><TenantPage /></GuestRoute>} />
              <Route path="/usecases/servicepros" element={<GuestRoute><ServiceProsPage /></GuestRoute>} />
              <Route path="/become-service-provider" element={<GuestRoute><BecomeServiceProvider /></GuestRoute>} />
              <Route path="/features/screening" element={<GuestRoute><ScreeningPage /></GuestRoute>} />
              <Route path="/features/lease" element={<GuestRoute><LeasePage /></GuestRoute>} />
              <Route path="/features/finance" element={<GuestRoute><FinancePage /></GuestRoute>} />
              <Route path="/features/leads" element={<GuestRoute><LeadsPage /></GuestRoute>} />
              <Route path="/features/team" element={<GuestRoute><TeamPage /></GuestRoute>} />
              <Route path="/resources" element={<GuestRoute><ResourcePage /></GuestRoute>} />
              <Route path="/pricing" element={<GuestRoute><PricingPage /></GuestRoute>} />
              {/* Legal pages remain accessible regardless of auth state */}
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
            </Route>
            <Route path="/team/accept-invitation" element={<AcceptInvitation />} />
            <Route element={<DashboardLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route element={<TeamPermissionGuard module="property-units"><Outlet /></TeamPermissionGuard>}>
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
                <Route path="/dashboard/equipments" element={<Equipments />} />
                <Route path="/dashboard/equipments/add" element={<CreateEquipment />} />
                <Route path="/dashboard/equipments/edit/:id" element={<CreateEquipment />} />
                <Route path="/dashboard/equipments/:id" element={<EquipmentDetail />} />
                <Route path="/dashboard/properties" element={<Properties />} />
                <Route path="/dashboard/properties/import" element={<ImportProperties />} />
                <Route path="/dashboard/property-detail/:id" element={<PropertyDetail />} />
              </Route>

              <Route element={<TeamPermissionGuard module="listing"><Outlet /></TeamPermissionGuard>}>
                <Route path="/dashboard/portfolio/listing" element={<Listing />} />
                <Route path="/dashboard/listings/:id" element={<ListingDetail />} />
              </Route>

              <Route path="/dashboard/calendar" element={<TeamPermissionGuard module="calendar"><Calendar /></TeamPermissionGuard>} />
              <Route path="/dashboard/tasks" element={<Tasks />} />
              <Route element={<TeamPermissionGuard module="accounting"><Outlet /></TeamPermissionGuard>}>
                <Route path="/dashboard/accounting/transactions" element={<Transactions />} />
                <Route path="/dashboard/accounting/transactions/clone" element={<CloneTransaction />} />
                <Route path="/dashboard/accounting/transactions/:id" element={<TransactionDetail />} />
                <Route path="/dashboard/accounting/transactions/income/add" element={<AddIncomeInvoice />} />
                <Route path="/dashboard/accounting/transactions/income-payments" element={<IncomePayments />} />
                <Route path="/dashboard/accounting/transactions/expense/add" element={<AddExpenseInvoice />} />
                <Route path="/dashboard/accounting/transactions/return-deposit" element={<ReturnDeposit />} />
                <Route path="/dashboard/accounting/transactions/apply-deposit" element={<ApplyDepositAndCredit />} />
                {/* Bulk Payments — Growth+ */}
                <Route element={<PlanRouteGuard feature="bulk-payments" />}>
                  <Route path="/dashboard/accounting/transactions/bulk-payments-income" element={<BulkPaymentsIncome />} />
                  <Route path="/dashboard/accounting/transactions/bulk-payments-expense" element={<BulkPaymentsExpense />} />
                </Route>
                <Route path="/dashboard/accounting/transactions/deposit/add" element={<Deposit />} />
                <Route path="/dashboard/accounting/transactions/credits/add" element={<Credits />} />
                <Route path="/dashboard/accounting/transactions/expense-payments" element={<ExpensePayments />} />
                <Route path="/dashboard/accounting/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
                {/* Growth+ — recurring transactions */}
                <Route element={<PlanRouteGuard feature="recurring-transactions" />}>
                  <Route path="/dashboard/accounting/transactions/recurring-income/add" element={<RecurringIncome />} />
                  <Route path="/dashboard/accounting/transactions/recurring-expense/add" element={<RecurringExpense />} />
                  <Route path="/dashboard/accounting/recurring" element={<ProtectedRoute><Recurring /></ProtectedRoute>} />
                  <Route path="/dashboard/accounting/transactions/recurring-clone" element={<ProtectedRoute><RecurringClone /></ProtectedRoute>} />
                  <Route path="/dashboard/accounting/recurring/:id" element={<ProtectedRoute><RecurringDetail /></ProtectedRoute>} />
                </Route>
              </Route>
              <Route element={<TeamPermissionGuard module="maintenance"><Outlet /></TeamPermissionGuard>}>
                <Route path="/dashboard/maintenance/request" element={<AddMaintenanceRequest />} />
                <Route path="/dashboard/maintenance/requests" element={<Requests />} />
                <Route path="/dashboard/maintenance/requests/:id" element={<MaintenanceRequestsDetail />} />
                {/* Growth+ — maintenance board */}
                <Route element={<PlanRouteGuard feature="maintenance-board" />}>
                  <Route path="/dashboard/maintenance/recurring" element={<MaintenanceRecurring />} />
                  <Route path="/dashboard/maintenance/recurring/:id" element={<MaintenanceRecurringDetail />} />
                </Route>
              </Route>
              <Route path="/dashboard/movein" element={<MoveIn />} />
              <Route element={<TeamPermissionGuard module="contacts"><Outlet /></TeamPermissionGuard>}>
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
              </Route>

              <Route element={<TeamPermissionGuard module="rental-applications"><Outlet /></TeamPermissionGuard>}>
                <Route path="/dashboard/leasing/applications" element={<Application />} />
                <Route path="/dashboard/application/new" element={<NewApplication />} />
                <Route path="/dashboard/application/:id" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
              </Route>
              <Route path="/dashboard/leasing/leases" element={<Leases />} />
              <Route path="/dashboard/leasing/leases/import" element={<ImportLeases />} />
              <Route element={<TeamPermissionGuard module="leads"><Outlet /></TeamPermissionGuard>}>
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
              </Route>
              <Route path="/dashboard/leasing/leases/:id" element={<LeaseDetail />} />
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
                path="/dashboard/ai-chat"
                element={
                  <ProtectedRoute>
                    <AIChatPage />
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

              {/* Personal Account Settings — always accessible, no module guard */}
              <Route
                path="/dashboard/settings/profile"
                element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/settings/security"
                element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>}
              />
              {/* Growth+ — integrations */}
              <Route element={<PlanRouteGuard feature="integrations" />}>
                <Route
                  path="/dashboard/settings/integrations"
                  element={<ProtectedRoute><IntegrationSettings /></ProtectedRoute>}
                />
              </Route>
              <Route
                path="/dashboard/settings/notifications"
                element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>}
              />

              {/* Settings Routes */}
              <Route element={<TeamPermissionGuard module="settings"><Outlet /></TeamPermissionGuard>}>
                <Route
                  path="/dashboard/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
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

                {/* Accounting Settings — Growth+ */}
                <Route element={<PlanRouteGuard feature="invoice-customization" />}>
                  <Route
                    path="/dashboard/settings/accounting/invoice"
                    element={
                      <ProtectedRoute>
                        <InvoiceSettings />
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
                </Route>

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
                  {/* Pro+ — custom application forms */}
                  <Route element={<PlanRouteGuard feature="custom-application-forms" />}>
                    <Route path="form-configuration" element={<FormConfiguration />} />
                  </Route>
                </Route>

                {/* Background Questions — available on all plans */}
                <Route path="/dashboard/settings/rental-application/background-questions" element={
                  <ProtectedRoute>
                    <BackgroundQuestions />
                  </ProtectedRoute>
                } />

                {/* Team Management Settings — Pro+ */}
                <Route element={<PlanRouteGuard feature="team-management" />}>
                  <Route
                    path="/dashboard/settings/team-management/roles-permissions"
                    element={<ProtectedRoute><RolesPermissions /></ProtectedRoute>}
                  />
                  <Route
                    path="/dashboard/settings/team-management/property-permissions"
                    element={<ProtectedRoute><PropertyPermissions /></ProtectedRoute>}
                  />
                </Route>

                {/* Request Settings */}
                <Route
                  path="/dashboard/settings/request-settings/request-settings"
                  element={
                    <ProtectedRoute>
                      <RequestSettings />
                    </ProtectedRoute>
                  }
                />
                {/* Auto-assign Maintenance — Pro+ */}
                <Route element={<PlanRouteGuard feature="auto-assign-maintenance" />}>
                  <Route
                    path="/dashboard/settings/request-settings/automation-settings"
                    element={<ProtectedRoute><AutomationSettings /></ProtectedRoute>}
                  />
                </Route>
              </Route>

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
              <Route element={<TeamPermissionGuard module="document-templates"><Outlet /></TeamPermissionGuard>}>
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
                {/* Growth+ — custom document templates */}
                <Route element={<PlanRouteGuard feature="custom-document-templates" />}>
                  <Route
                    path="/dashboard/documents/my-templates"
                    element={<ProtectedRoute><MyTemplates /></ProtectedRoute>}
                  />
                  <Route
                    path="/dashboard/documents/my-templates/create-wizard"
                    element={<ProtectedRoute><CreateTemplateWizard /></ProtectedRoute>}
                  />
                  <Route
                    path="/dashboard/documents/my-templates/:id"
                    element={<ProtectedRoute><MyTemplateDetail /></ProtectedRoute>}
                  />
                  <Route
                    path="/dashboard/documents/my-templates/:id/edit"
                    element={<ProtectedRoute><EditTemplate /></ProtectedRoute>}
                  />
                </Route>
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
              </Route>

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
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route element={<TeamPermissionGuard module="reports"><Outlet /></TeamPermissionGuard>}>
                <Route
                  path="/dashboard/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                {/* Starter — free reports */}
                <Route
                  path="/dashboard/reports/rent-roll"
                  element={<ProtectedRoute><RentRoll /></ProtectedRoute>}
                />
                <Route
                  path="/dashboard/reports/vacant-rentals"
                  element={<ProtectedRoute><VacantRentals /></ProtectedRoute>}
                />
                {/* Growth+ reports */}
                <Route element={<PlanRouteGuard feature="report-income-expense" />}>
                  <Route path="/dashboard/reports/rentability" element={<ProtectedRoute><Rentability /></ProtectedRoute>} />
                  <Route path="/dashboard/reports/statement" element={<ProtectedRoute><ProviderStatement /></ProtectedRoute>} />
                  <Route path="/dashboard/reports/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                  <Route path="/dashboard/reports/maintenance-requests" element={<ProtectedRoute><MaintenanceRequestsReport /></ProtectedRoute>} />
                  <Route path="/dashboard/reports/renters-insurance" element={<ProtectedRoute><RentersInsurance /></ProtectedRoute>} />
                  <Route path="/dashboard/reports/tenant-statement" element={<ProtectedRoute><TenantStatement /></ProtectedRoute>} />
                  <Route path="/dashboard/reports/general-expenses" element={<ProtectedRoute><GeneralExpenses /></ProtectedRoute>} />
                  <Route path="/dashboard/reports/general-income" element={<ProtectedRoute><GeneralIncome /></ProtectedRoute>} />
                  <Route path="/dashboard/reports/property-expenses" element={<ProtectedRoute><PropertyExpenses /></ProtectedRoute>} />
                  <Route path="/dashboard/reports/property-statement" element={<ProtectedRoute><PropertyStatement /></ProtectedRoute>} />
                </Route>
              </Route>
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
            <Route element={<TenantProtectedRoute><UserDashboardLayout /></TenantProtectedRoute>}>
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
              <Route path="/userdashboard/notifications" element={<UserNotificationFeed />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </SubscriptionProvider>
          </TeamPermissionProvider>
          </AutoLoginProvider>
          </RoutedApp>
        </BrowserRouter>
        <ChatToast />
        <TanStackDevtools />
        </ToastProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
