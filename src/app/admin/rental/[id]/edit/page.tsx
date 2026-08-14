import { redirect } from "next/navigation";

export default function RentalEditRedirect({ params }: { params: { id: string } }) {
	redirect(`/admin/rentals/${params.id}/edit`);
}
