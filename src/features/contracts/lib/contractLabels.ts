import { ContractStatus, LeaseType } from "@/types/enums";

export const leaseTypeLabels: Record<LeaseType, string> = {
  [LeaseType.RESIDENTIAL_LEASE]: "Bail d'habitation",
  [LeaseType.COMMERCIAL_LEASE]: "Bail commercial",
  [LeaseType.OTHER]: "Autre",
};

export const contractStatusLabels: Record<ContractStatus, string> = {
  [ContractStatus.ACTIVE]: "Actif",
  [ContractStatus.PENDING]: "En attente",
  [ContractStatus.EXPIRED]: "Expiré",
  [ContractStatus.TERMINATED]: "Terminé",
};
