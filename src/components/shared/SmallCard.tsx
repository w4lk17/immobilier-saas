import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
 interface SmallCardProps {
	title: string;
	value: string;
	 icon:  React.ElementType;
}

export function SmallCard({ title, value, icon:Icon }: SmallCardProps ) {
	return (
		<div className="">
			<Card className="flex-row items-center justify-between ">
				<CardHeader className="h-10 pr-4">
				{/* <Image src={icon} alt={title} fill className="object-cover" /> */}
					<div className="flex items-center justify-center w-8 h-8 rounded-full">
						<Icon className=" text-muted-foreground" />
						</div>
			</CardHeader>
			<CardContent className="flex-1 p-0">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<div className="text-xl font-bold ">{value}</div>
				</CardContent>
			</Card>
		</div>
	);
}