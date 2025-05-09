
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import employeesService from '../services/employeesApi';
import { EmployeeFormData, EmployeeUpdateFormData } from '../schemas/employeeSchemas'; // Importer les types de formulaire
import { toast } from "sonner";
import { FrontendEmployee } from '@/types';

export const EMPLOYEES_QUERY_KEY = ['employees'];

export function useEmployees() {
	return useQuery<FrontendEmployee[], Error>({
		queryKey: EMPLOYEES_QUERY_KEY,
		queryFn: employeesService.getEmployees,
		staleTime: 1000 * 60 * 5,
	});
}

export function useEmployee(employeeId: number | null | undefined) {
	return useQuery<FrontendEmployee, Error>({
		queryKey: [...EMPLOYEES_QUERY_KEY, employeeId],
		queryFn: () => {
			if (!employeeId) throw new Error("ID employé invalide");
			return employeesService.getEmployeeById(employeeId);
		},
		enabled: !!employeeId,
	});
}

export function useCreateEmployee() {
	const queryClient = useQueryClient();
	return useMutation<FrontendEmployee, Error, EmployeeFormData>({
		mutationFn: (data) => employeesService.createEmployee(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
			toast.success("Profil employé créé avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la création du profil employé.");
		},
	});
}

export function useUpdateEmployee() {
	const queryClient = useQueryClient();
	return useMutation<FrontendEmployee, Error, { id: number; data: EmployeeUpdateFormData }>({
		mutationFn: ({ id, data }) => employeesService.updateEmployee(id, data),
		onSuccess: (updatedEmployee, variables) => {
			queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
			queryClient.setQueryData([...EMPLOYEES_QUERY_KEY, variables.id], updatedEmployee);
			toast.success("Profil employé mis à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil employé.");
		},
	});
}

export function useDeleteEmployee() {
	const queryClient = useQueryClient();
	return useMutation<FrontendEmployee, Error, number>({
		mutationFn: (id) => employeesService.deleteEmployee(id),
		onSuccess: (deletedEmployee, id) => {
			toast.success(`Profil employé ${id} supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
			queryClient.removeQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du profil employé.");
		},
	});
}