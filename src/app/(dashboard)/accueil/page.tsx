import AppBarChart from "@/components/shared/AppBarChart";
import AppPieChart from "@/components/shared/AppPieChart";
import { KPICard } from "@/components/shared/KPICard";
import { SmallCard } from "@/components/shared/SmallCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCheck, DollarSign, FileClock, FileText, Hourglass, House, Users } from "lucide-react";

export default function DashboardHomePage() {
	return (

		<div className="grid grid-cols-1 lg:grid-cols-8 2xl:grid-cols-16 gap-4 p-4">
			{/* Large Part */}
			<div className="grid grid-cols-1 lg:col-span-6 2xl:col-span-12 gap-4">
				{/* Large Cards Row */}
				<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
					<KPICard
						title="Factures Générées (Août)"
						value={"120 000,0"}
						description={"Total facturé ce mois"}
						icon={DollarSign}
						progressValue={100}
					/>

					<KPICard
						title="Factures Payées (Août)"
						value={"90 000,0"}
						description={`${90}% du total généré`}
						icon={CheckCheck}
						progressValue={90}
					/>

					<KPICard
						title="Factures Impayées (Août)"
						value={"30 000,0"}
						description={`${20}% du total généré`}
						icon={FileClock}
						progressValue={20}
					/>
				</div>
				{/* Small Cards Row */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* August Expenses */}
					<SmallCard title="Dépenses (Août)" value={"30 000,0"} icon={Hourglass} />
					{/* Active Contracts */}
					<SmallCard title="Contrats Actifs" value={"122"} icon={FileText} />
					{/* Inactive Contracts */}
					<SmallCard title="Contrats Inactifs" value={"1"} icon={FileText} />
					{/* Terminated Contracts */}
					<SmallCard title="Contrats Terminés" value="0" icon={FileText} />
				</div>
				{/* Chart Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
					<div className="bg-primary-foreground rounded-lg p-4 lg:col-span-2">
						<AppBarChart />
					</div>
					<div className="bg-primary-foreground rounded-lg p-4 lg:col-span-1">
						<AppPieChart />
					</div>
				</div>
			</div>
			{/* Pay Button and Past Invoices */}
			<div className="grid-cols-1 lg:col-span-2 2xl:col-span-4 gap-4">
				<div className="bg-primary-foreground rounded-lg p-4">
					<div className="mb-4">
						<Button
							className="w-full"
						>
							<Check className="h-4 w-4 text-blue-600" />
							Payer
						</Button>
					</div>
					<div className="mb-4 ">
						<h3 className="mb-2 text-lg font-medium">Factures passées</h3>
						<Card className="py-0">
							<CardContent className="p-4">
								<div className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded-md">
									<div className="flex items-center gap-2">
										<div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="text-green-500"
											>
												<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
												<polyline points="22 4 12 14.01 9 11.01" />
											</svg>
										</div>
										<div>
											<div className="text-xs font-medium text-gray-700">PAYÉES</div>
											<div className="text-xs text-gray-500">Factures Septembre</div>
										</div>
									</div>
									<div className="text-green-500 font-medium">8</div>
								</div>
								<div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
									<div className="flex items-center gap-2">
										<div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="text-red-500"
											>
												<circle cx="12" cy="12" r="10" />
												<line x1="15" y1="9" x2="9" y2="15" />
												<line x1="9" y1="9" x2="15" y2="15" />
											</svg>
										</div>
										<div>
											<div className="text-xs font-medium text-gray-700">IMPAYÉES</div>
											<div className="text-xs text-gray-500">Factures Juillet</div>
										</div>
									</div>
									<div className="text-red-500 font-medium">0</div>
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="">
						<h3 className="mb-2 text-lg font-medium">Résumés</h3>
						<div className="grid grid-cols-1 gap-4">
							{/* Owners */}
							<Card className="py-0">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full">
												<Users className="w-4 h-4 text-amber-500" />
											</div>
											<div>
												<div className="text-sm font-medium">PROPRIÉTAIRES</div>
												<div className="text-xs text-gray-500">Total: 1</div>
											</div>
										</div>
										<div className="text-green-500 font-medium">0</div>
										<div className="text-red-500 font-medium">0</div>
									</div>
								</CardContent>
							</Card>

							{/* Tenants */}
							<Card className="py-0">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-8 h-8 bg-gray-900 rounded-full">
												{/* <svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="text-white"
												>
													<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
													<circle cx="9" cy="7" r="4" />
													<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
													<path d="M16 3.13a4 4 0 0 1 0 7.75" />
												</svg> */}
												<Users className="w-4 h-4 text-white" />
											</div>
											<div>
												<div className="text-sm font-medium">LOCATAIRES</div>
												<div className="text-xs text-gray-500">Total: 1</div>
											</div>
										</div>
										<div className=" font-medium">0</div>
										<div className=" font-medium">0</div>
									</div>
								</CardContent>
							</Card>

							{/* Locatives Rentals */}
							<Card className="py-0">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-8 h-8 bg-teal-900 rounded-full">
												{/* <svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="text-white"
												>
													<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
													<circle cx="9" cy="7" r="4" />
													<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
													<path d="M16 3.13a4 4 0 0 1 0 7.75" />
												</svg> */}
												<House className="w-4 h-4 text-white" />
											</div>
											<div>
												<div className="text-sm font-medium">LOCATIVES</div>
												<div className="text-xs text-gray-500">Total: 1</div>
											</div>
										</div>
										<div className=" font-medium">0</div>
										<div className=" font-medium">0</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}