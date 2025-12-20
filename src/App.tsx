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
import PricingPage from './pages/basewebsite/pricing';
import LoginPage from './pages/basewebsite/auth/login';
import SignUpPage from './pages/basewebsite/auth/signUp';
import OtpPage from './pages/basewebsite/auth/otp';
import OAuthCallbackPage from './pages/basewebsite/auth/oauth-callback';
import OAuthCompletePage from './pages/basewebsite/auth/signUp/oauth-complete';
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
import AddMaintenanceRequest from './pages/Dashboard/features/Maintenance/AddMaintenanceRequest';
import Requests from './pages/Dashboard/features/Maintenance/MaintenanceRequests';
import MaintenanceRequestsDetail from './pages/Dashboard/features/Maintenance/MaintenanceRequestsDetail';
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
import AddEditTenant from './pages/Dashboard/features/Tenants/AddEditTenant';
import TenantDetail from './pages/Dashboard/features/Tenants/TenantDetail';
import Units from './pages/Dashboard/features/Units/Units';
import KeysLocks from './pages/Dashboard/features/KeysLocks/KeysLocks';
import KeyDetail from './pages/Dashboard/features/KeysLocks/KeyDetail';
import Leases from './pages/Dashboard/features/Leases/Leases';
import LeaseDetail from './pages/Dashboard/features/Leases/LeaseDetail';
import AddKey from './pages/Dashboard/features/KeysLocks/AddKey';
import ServicePros from './pages/Dashboard/features/ServicePros/ServicePros';
import AddEditServicePro from './pages/Dashboard/features/ServicePros/AddEditServicePro';
import ServiceProsDetail from './pages/Dashboard/features/ServicePros/ServiceProsDetail';
import Application from './pages/Dashboard/features/Application/Application';
import NewApplication from './pages/Dashboard/features/Application/NewApplication';
import ProviderStatement from './pages/Dashboard/features/ServicePros/ProviderStatement';
import TransactionDetail from './pages/Dashboard/features/Transactions/TransactionDetail';
// import ListUnit from './pages/Dashboard/features/ListUnit/ListUnit';

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
import RolesPermissions from './pages/Dashboard/settings/team-management/RolesPermissions';
import PropertyPermissions from './pages/Dashboard/settings/team-management/PropertyPermissions';
import RequestSettings from './pages/Dashboard/settings/request-settings/RequestSettings';
import AutomationSettings from './pages/Dashboard/settings/request-settings/AutomationSettings';
import GeneralReports from './pages/Dashboard/settings/report/general';

// Create a QueryClient instance
export const queryClient = new QueryClient({
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
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signup/oauth-complete" element={<OAuthCompletePage />} />
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
              <Route path="*" element={<HomePage />} />
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
              <Route path="/dashboard/accounting/payments" element={<Payments />} />
              <Route path="/dashboard/accounting/recurring" element={<Recurring />} />
              <Route path="/dashboard/maintenance/request" element={<AddMaintenanceRequest />} />
              <Route path="/dashboard/maintenance/requests" element={<Requests />} />
              <Route path="/dashboard/maintenance/requests/:id" element={<MaintenanceRequestsDetail />} />
              <Route path="/dashboard/movein" element={<MoveIn />} />
              <Route path="/dashboard/contacts/tenants" element={<Tenants />} />
              <Route path="/dashboard/contacts/tenants/add" element={<AddEditTenant />} />
              <Route path="/dashboard/contacts/tenants/edit/:id" element={<AddEditTenant />} />
              <Route path="/dashboard/contacts/tenants/:id" element={<TenantDetail />} />
              <Route path="/dashboard/contacts/service-pros" element={<ServicePros />} />
              <Route path="/dashboard/contacts/service-pros/add" element={<AddEditServicePro />} />
              <Route path="/dashboard/contacts/service-pros/edit/:id" element={<AddEditServicePro />} />
              <Route path="/dashboard/contacts/service-pros/:id" element={<ServiceProsDetail />} />
              <Route path="/dashboard/leasing/applications" element={<Application />} />
              <Route path="/dashboard/application/new" element={<NewApplication />} />
              <Route path="/dashboard/leasing/leases" element={<Leases />} />
              <Route path="/dashboard/portfolio/leases/:id" element={<LeaseDetail />} />

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
              <Route
                path="/dashboard/settings/rental-application/online-application"
                element={
                  <ProtectedRoute>
                    <OnlineApplication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/rental-application/form-configuration"
                element={
                  <ProtectedRoute>
                    <FormConfiguration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/rental-application/terms-signature"
                element={
                  <ProtectedRoute>
                    <TermsSignature />
                  </ProtectedRoute>
                }
              />

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
              <Route
                path="/documents"
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
                path="/dashboard/reports/statement"
                element={
                  <ProtectedRoute>
                    <ProviderStatement />
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
          </Routes>
        </BrowserRouter>
        <TanStackDevtools />
      </QueryClientProvider>
    </>
  );
};

export default App;
