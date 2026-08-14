import api from "@/lib/api";
import {
	AdminDashboardData,
	ManagerDashboardData,
	OwnerDashboardData,
	TenantDashboardData,
} from "../types";

const dashboardService = {
	async getAdmin(): Promise<AdminDashboardData> {
		const response = await api.get<AdminDashboardData>("/dashboard/admin");
		return response.data;
	},

	async getManager(): Promise<ManagerDashboardData> {
		const response = await api.get<ManagerDashboardData>("/dashboard/manager");
		return response.data;
	},

	async getOwner(): Promise<OwnerDashboardData> {
		const response = await api.get<OwnerDashboardData>("/dashboard/owner");
		return response.data;
	},

	async getTenant(): Promise<TenantDashboardData> {
		const response = await api.get<TenantDashboardData>("/dashboard/tenant");
		return response.data;
	},
};

export default dashboardService;

