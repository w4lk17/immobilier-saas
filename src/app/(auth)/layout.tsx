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
			<div className="flex min-h-svh flex-col items-center justify-center bg-background md:bg-muted p-6 md:p-10">
				{children}
			</div>
		</>

	);
}