"use client";

import { Download } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContractWithRelations } from "@/types";
import { formatOptionalDate } from "@/lib";
import { formatPhone } from "@/lib/utils";
import { toCardinal } from 'n2words/fr-FR'

interface ContractDetailsModalProps {
  contract: ContractWithRelations | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function formatFrDate(date?: string | Date | null) {
  if (!date) return "Non renseigné";
  try {
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
  } catch {
    return "Non renseigné";
  }
}

export function ContractDetailsModal({ contract, isOpen, onOpenChange }: ContractDetailsModalProps) {
  if (!contract) return null;

  // Préparation des données
  const data = {
    reference: contract.reference || contract.id || "",
    ownerFullName:
      (contract.owner?.user?.lastName ? contract.owner?.user?.lastName + " " : "") +
      (contract.owner?.user?.firstName || ""),
    ownerAddress: contract.owner?.user?.address || "",
    ownerPhoneNumber: contract.owner?.user?.phoneNumber || "",
    ownerCivility: contract.owner?.user?.civility || "",
    tenantFullName:
      (contract.tenant?.user?.lastName ? contract.tenant?.user?.lastName + " " : "") +
      (contract.tenant?.user?.firstName || ""),
    tenantBirthDate: contract.tenant?.user?.dateOfBirth
      ? formatOptionalDate(contract.tenant.user.dateOfBirth)
      : "",
    tenantAddress: contract.address ? contract.address || contract.property?.address : "-",
    tenantPhoneNumber: contract.tenant?.user?.phoneNumber || "",
    tenantCivility: contract.tenant?.user?.civility || "",
    designation: contract.designation || "",
    address: contract.address || contract.property?.address || "",
    startDate: contract.startDate ? formatFrDate(contract.startDate) : "",
    rentAmount: contract.rentAmount !== undefined ? contract.rentAmount : "-",
    paymentDay: contract.dayAddToPaymentDay,
    chargesAmount:
      typeof contract.chargesAmount !== "undefined" && contract.chargesAmount !== null
        ? contract.chargesAmount
        : "-",
    depositAmount:
      typeof contract.depositAmount !== "undefined" && contract.depositAmount !== null
        ? contract.depositAmount
        : "-",
    advanceAmount:
      typeof contract.advanceAmount !== "undefined" && contract.advanceAmount !== null
        ? contract.advanceAmount
        : "-",
  };
  const moisDepot = contract.rentAdvance + contract.rentDeposit;
  const montantDepot = (Number(data.depositAmount ?? 0) + Number(data.advanceAmount ?? 0)).toLocaleString('fr-FR');

  // Télécharge le contrat
  const exportToPDF = () => {
  };
 
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {/* <h1>Contrat de bail à usage d&apos;habitation</h1> */}
            {/* <h1>Contrat de bail</h1> */}
            Contrat de bail
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-muted/30 px-3 py-4 sm:px-8 sm:py-6">
          <article className="mx-auto max-w-3xl bg-background px-5 py-7 text-[13px] leading-7 text-foreground shadow-sm sm:px-10 sm:py-10 sm:text-sm">
            <header className="mb-8 text-center">
              <h1 className="border-b-2 border-foreground pb-3 text-xl font-bold uppercase leading-tight tracking-wide sm:text-2xl">
                Contrat de bail
              </h1>
              <p className="mt-3 italic text-muted-foreground">
                Conforme au décret n° 2022-001/PR du 05 janvier 2022 (République Togolaise)
              </p>
              <p className="mt-5 text-right font-medium">
                <span className="font-bold">Référence :</span> {data.reference || "-"}
              </p>
            </header>

            <section className="mb-6">
              <h2 className="mb-3 border-b pb-1 text-base font-bold uppercase">1. Entre les soussignés</h2>
              <p className="mb-3">
                <strong>Le bailleur :</strong>{" "}
                <span className="font-semibold">{data.ownerCivility} {data.ownerFullName || "Non renseigné"}</span>,
                demeurant à {data.ownerAddress || "Non renseignée"}, téléphone{" "}
                {formatPhone(data.ownerPhoneNumber) || "Non renseigné"}.
              </p>
              <p>
                <strong>Le locataire :</strong>{" "}
                <span className="font-semibold">{data.tenantCivility} {data.tenantFullName || "Non renseigné"}</span>,
                demeurant à {data.tenantAddress || "Non renseigné"}, téléphone{" "}
                {formatPhone(data.tenantPhoneNumber) || "Non renseigné"}.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="mb-3 border-b pb-1 text-base font-bold uppercase">2. Désignation et destination des lieux</h2>
              <p className="mb-2">
                Le bailleur donne en location au locataire, qui accepte, le bien désigné comme suit :
                <strong> {data.designation || "Non renseignée"}</strong>.
              </p>
              <p className="mb-2">
                Le bien est situé à l&apos;adresse / quartier suivant(e) :
                <strong> {data.address || "Non renseignée"}</strong>.
              </p>
              <p className="italic">
                Les locaux loués sont destinés exclusivement à l&apos;usage d&apos;habitation .
              </p>
            </section>

            <section className="mb-6">
              <h2 className="mb-3 border-b pb-1 text-base font-bold uppercase">3. Durée et prise d&apos;effet</h2>
              <p>
                Le présent contrat est conclu pour une durée indéterminée. Il prend effet à compter du{" "}
                <strong>{data.startDate || "Non renseigné"}</strong>.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="mb-3 border-b pb-1 text-base font-bold uppercase">4. Conditions financières</h2>
              <p className="mb-2">
                Le présent bail est consenti et accepté moyennant un loyer mensuel fixé à{" "}
                <strong>{data.rentAmount} Francs CFA</strong>.
              </p>
              <p className="mb-2">
                Les provisions sur charges sont fixées à <strong>{data.chargesAmount} F CFA</strong>.
              </p>
              <p className="mb-2">
                Le dépôt de garantie et avance de loyer d'un montant total correspondant à {toCardinal(moisDepot)} ({moisDepot}) mois, {" "}
                <strong>{montantDepot} F CFA</strong>.

              </p>
              <p>Le loyer est payable d&apos;avance à terme échu au plus tard le {toCardinal(data.paymentDay)} ({data.paymentDay}) de chaque mois.</p>
            </section>

            <section className="mb-6">
              <h2 className="mb-3 border-b pb-1 text-base font-bold uppercase">5. Résiliation et préavis</h2>
              <p>
                Chacune des parties peut mettre fin au présent contrat à tout moment sous réserve de
                notifier à l&apos;autre partie un préavis écrit de <strong>deux (02) mois</strong> minimum,
                conformément à la réglementation togolaise en vigueur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 border-b pb-1 text-base font-bold uppercase">6. Enregistrement et litiges</h2>
              <p>
                Le présent contrat sera obligatoirement soumis à la formalité de l&apos;enregistrement auprès de
                l&apos;Office Togolais des Recettes (OTR). Tout litige né de l&apos;exécution du présent bail sera
                porté devant les tribunaux compétents du Togo.
              </p>
            </section>

            <p className="mt-8">
              Fait à Lomé, le ......................................... en trois (03) exemplaires originaux.
            </p>

            <div className="mt-16 grid gap-10 sm:grid-cols-2">
              <div className="border-t border-dashed border-foreground pt-3">
                <p className="font-bold">Le Bailleur</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mention manuscrite &quot;Lu et approuvé&quot; + Signature
                </p>
              </div>
              <div className="border-t border-dashed border-foreground pt-3">
                <p className="font-bold">Le Locataire</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mention manuscrite &quot;Lu et approuvé&quot; + Signature
                </p>
              </div>
            </div>
          </article>
        </div>

        <DialogFooter className="shrink-0 flex-col-reverse gap-2 border-t bg-background px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fermer
            </Button>
          </DialogClose>
          <Button variant="default" onClick={exportToPDF}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

