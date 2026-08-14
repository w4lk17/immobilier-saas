
"use client";

import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { isLoading, user } = useAuth();
	const pathname = usePathname();

	// Explicitly list public/auth routes (landing, login, register, forgot-password)
	const authRoutes = ['/', '/login', '/register', '/forgot-password'];
	const isAuthPage = authRoutes.includes(pathname || '');

	// Show loading spinner only on protected routes during auth hydration (never on public/auth pages)
	if (isLoading && !isAuthPage && !user) {
		return (
			<div className='flex flex-col justify-center items-center gap-4 h-screen'>
				<Spinner className='size-6 text-gray-300' />
				<p className='text-gray-300 text-sm'>Loading Dashboard...</p>
			</div>
		);
	}

	return <>{children}</>;
}