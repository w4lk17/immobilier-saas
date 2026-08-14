import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboardApi";
import {
	AdminDashboardData,
	ManagerDashboardData,
	OwnerDashboardData,
	TenantDashboardData,
} from "../types";

export const DASHBOARD_QUERY_KEY = ["dashboard"];

export function useAdminDashboard() {
	return useQuery<AdminDashboardData, Error>({
		queryKey: [...DASHBOARD_QUERY_KEY, "admin"],
		queryFn: dashboardService.getAdmin,
		staleTime: 1000 * 60 * 2,
	});
}

export function useManagerDashboard() {
	return useQuery<ManagerDashboardData, Error>({
		queryKey: [...DASHBOARD_QUERY_KEY, "manager"],
		queryFn: dashboardService.getManager,
		staleTime: 1000 * 60 * 2,
	});
}

export function useOwnerDashboard() {
	return useQuery<OwnerDashboardData, Error>({
		queryKey: [...DASHBOARD_QUERY_KEY, "owner"],
		queryFn: dashboardService.getOwner,
		staleTime: 1000 * 60 * 2,
	});
}

export function useTenantDashboard() {
	return useQuery<TenantDashboardData, Error>({
		queryKey: [...DASHBOARD_QUERY_KEY, "tenant"],
		queryFn: dashboardService.getTenant,
		staleTime: 1000 * 60 * 2,
	});
}

