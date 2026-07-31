import AdminLogin from "./AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import DashboardView from "./admin/views/DashboardView";
import AppointmentsView from "./admin/views/AppointmentsView";
import ClientsView from "./admin/views/ClientsView";
import FinanceView from "./admin/views/FinanceView";
import CMSView from "./admin/views/CMSView";
import AnalyticsView from "./admin/views/AnalyticsView";
import WhatsAppView from "./admin/views/WhatsAppView";

export default function AdminDashboard() {
  const isLoggedIn = localStorage.getItem("adminToken") === "true";

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      {(view) => {
        if (view === "dashboard")    return <DashboardView />;
        if (view === "appointments") return <AppointmentsView />;
        if (view === "clients")      return <ClientsView />;
        if (view === "finance")      return <FinanceView />;
        if (view === "cms")          return <CMSView />;
        if (view === "analytics")    return <AnalyticsView />;
        if (view === "whatsapp")     return <WhatsAppView />;
        return null;
      }}
    </AdminLayout>
  );
}
