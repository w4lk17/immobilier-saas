"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ContractForm } from "@/features/contracts/components/ContractForm";
import { ContractUpdateFormData } from "@/features/contracts/schemas/contractSchemas";
import { useContract, useUpdateContract } from "@/features/contracts/hooks/useContracts.hooks";
import { PageHeader } from "@/components/shared/PageHeader";

export default function EditContractPage() {
  const router = useRouter();
  const params = useParams();
  const contractId =
    typeof params.id === "string"
      ? Number(params.id)
      : Array.isArray(params.id)
        ? Number(params.id[0])
        : undefined;

  const {
    data: contract,
    isLoading,
    isError,
    error,
  } = useContract(contractId);
  const { mutateAsync: updateContract, isPending } = useUpdateContract();

  const handleSubmit = async (data: ContractUpdateFormData) => {
    if (!contractId) return;
    await updateContract({ id: contractId, data });
    router.push("/admin/contracts");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger les données du contrat. {error?.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        title="Modifier le contrat"
        description=""
        actions={
          <Button variant="secondary" size="sm" asChild>
            <Link href="/admin/contracts">
              <ArrowLeftCircle />
              Liste des contrats
            </Link>
          </Button>
        }
      />
      <ContractForm
        mode="edit"
        initialData={contract}
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitButtonText="Mettre à jour"
      />
    </div>
  );
}