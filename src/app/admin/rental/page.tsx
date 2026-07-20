import { redirect } from "next/navigation";

export default function RentalPageRedirect() {
	redirect("/admin/rentals");
}
