import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InvoiceWithRelations } from "@/types";
import { buildRentReceiptViewModel } from "./rentReceiptViewModel";
import { RentReceiptPreview } from "./RentReceiptPreview";

interface InvoiceDetailsModalProps {
  invoice: InvoiceWithRelations | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function InvoicePreviewDialog({ invoice, isOpen, onOpenChange }: InvoiceDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
     
      <DialogContent
        className="flex max-h-[92vh] flex-col gap-0 overflow-auto p-0 sm:max-w-4xl"
      >
        {/* Ajout d'un DialogTitle pour l'accessibilité */}
        <DialogTitle className="sr-only">Prévisualisation du reçu de loyer</DialogTitle>
   
        <div className="flex justify-center py-8">
          {/* On affiche l'aperçu du reçu de loyer si une facture est sélectionnée */}
          <div className="w-full flex justify-center">
            {typeof window !== "undefined" && !!invoice ? (
              <RentReceiptPreview
                receipt={buildRentReceiptViewModel(invoice)}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
