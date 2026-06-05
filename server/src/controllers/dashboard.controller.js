import * as dashboardService from '../services/dashboard.service.js';
import { success } from '../utils/response.js';

export async function getStats(req, res, next) {
  try {
    const data = await dashboardService.getDashboard();
    return success(res, data);
  } catch (err) {
    next(err);
  }
}
