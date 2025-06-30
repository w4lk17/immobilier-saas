
"use client";

import { Button } from "@/components/ui/button";


export function ReportListTable() {
	
	return (
		<div>
			<div className="md:col-span-3">
				<div className="col-span-1 flex flex-col gap-6 md:col-span-3">
					<div className="mt-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
						<div className="relative"><div className="flex items-center gap-2">
							<Button className="rounded px-3 py-2 text-sm bg-brand-dashboard-card text-brand-neutrals-500">
								1d
							</Button>
							<button className="rounded px-3 py-2 text-sm bg-brand-dashboard-card text-brand-neutrals-500">
								7d
							</button>
							<button className="rounded px-3 py-2 text-sm bg-brand-dashboard-card text-brand-neutrals-500">
								30d
							</button>
							<button className="rounded bg-brand-dashboard-card px-4 py-2 text-sm text-brand-foreground ">
								May 26 - Jun 02
							</button>
						</div>
						</div>
					</div>
					<div className="flex flex-col gap-4 border-0 bg-brand-dashboard-card p-6 dark:bg-brand-dashboard-card rounded-lg">
						<p className="[&amp;_b]:md:font-semibold [&amp;_strong]:md:font-semibold text-base/[1.5rem] mb-2 font-semibold">
							Filtered Usage Events
						</p>
						<div className="flex flex-col gap-4">
							<div className="overflow-x-auto">
								<table className="w-full min-w-[700px] border-collapse text-left text-sm font-mono">
									<thead className="text-xs uppercase text-brand-gray-600 dark:text-brand-gray-400">
										<tr className="border-b border-brand-borders dark:border-brand-neutrals-800">
											<th scope="col" className="w-[130px] px-3 py-2 font-semibold">
												Date
											</th>
											<th scope="col" className="px-3 py-2 font-semibold">
												User
											</th>
											<th scope="col" className="px-3 py-2 font-semibold">
												Kind
											</th><th scope="col" className="px-3 py-2 font-semibold">Max Mode</th>
											<th scope="col" className="px-3 py-2 font-semibold">Model</th>
											<th scope="col" className="w-[150px] px-3 py-2 text-right font-semibold">Cost (Requests)</th>
										</tr>
									</thead>
									<tbody className="text-xs">
										<tr className="bg-transparent hover:bg-brand-neutrals-50 dark:hover:bg-brand-neutrals-900">
											<td className="w-[130px] truncate px-3 py-2 text-left" title="Jun 2, 2025, 02:49:17 PM">
												Jun 2, 02:49 PM
											</td>
											<td className="max-w-[180px] truncate px-3 py-2 text-left" title="You">
												You</td>
											<td className="max-w-[150px] truncate px-3 py-2 text-left" title="free">
												free
											</td>
											<td className="px-3 py-2 text-left">
												No
											</td>
											<td className="max-w-[120px] truncate px-3 py-2 text-left" title="default">
												default
											</td>
											<td className="w-[150px] px-3 py-2 text-right relative">
												<div className="relative group">
													<span>1</span>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}