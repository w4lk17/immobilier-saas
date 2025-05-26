// src/app/(auth)/layout.tsx
import Link from 'next/link';
import { Building } from 'lucide-react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="absolute top-4 right-4" >
				<Link href="/" >
					<Building className="size-6" />
					<h1 className='sr-only'>landing</h1>
				</Link>
			</div>
			{children}
		</>

	);
}