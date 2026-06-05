import * as dashboardModel from '../models/dashboard.model.js';

export async function getDashboard() {
  const [stats, recentBookings] = await Promise.all([
    dashboardModel.getStats(),
    dashboardModel.getRecentBookings(8),
  ]);
  return { stats, recentBookings };
}
