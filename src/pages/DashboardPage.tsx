import { AlertsPanel } from '../features/alerts/AlertsPanel';
import { FleetStatusCard } from '../features/fleet/FleetStatusCard';
import { OrdersCard } from '../features/orders/OrdersCard';
import { ShiftStaffingCard } from '../features/staffing/ShiftStaffingCard';

export function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="dashboard__col dashboard__col--alerts">
        <AlertsPanel />
        <ShiftStaffingCard />
      </div>
      <div className="dashboard__col dashboard__col--ops">
        <FleetStatusCard />
        <OrdersCard />
      </div>
    </div>
  );
}
