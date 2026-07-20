"use client";

import Image from "next/image";
import { RentReceiptViewModel, formatReceiptCurrency } from "./rentReceiptViewModel";

type RentReceiptPreviewProps = {
	receipt: RentReceiptViewModel;
};

function AddressBlock({ lines }: { lines: string[] }) {
	return (
		<div>
			{lines.map((line, index) => (
				<div key={`${line}-${index}`}>{line}</div>
			))}
		</div>
	);
}

export function RentReceiptPreview({ receipt }: RentReceiptPreviewProps) {
	const declaration = receipt.isReceipt
		? `Je soussigné(e) ${receipt.ownerName} propriétaire du logement désigné ci-dessus, déclare avoir reçu de la part du locataire l'ensemble des sommes mentionnées au titre du loyer et des charges.`
		: `Ce document présente les sommes dues par le locataire au titre du loyer et des charges pour la période indiquée.`;

	const basDePage = receipt.isReceipt
		? `Cette quittance annule tous les reçus qui auraient pu être donnés pour acomptes versés au titre du loyer et des charges pour l'échéance correspondante.Le paiement de la présente quittance ne présume pas du paiement des termes précédents. À conserver 3 ans après échéance du bail.`
		: "";

	return (
		<div className="w-full overflow-x-auto">
			<div
				className="mx-auto bg-white text-black shadow-xl"
				style={{
					width: "210mm",
					minHeight: "297mm",
					padding: "18mm",
					fontFamily: "Arial, sans-serif",
				}}
			>
				<div className="flex justify-between pb-[24mm] text-[14px] leading-5">
					{/* <div className="flex justify-between pb-[34mm] text-[14px] leading-5"> */}
					<div className="max-w-[75mm]">
						<div>{receipt.ownerName}</div>
						<AddressBlock lines={receipt.ownerAddressLines} />
					</div>

					<div className="mt-[16mm] max-w-[75mm] text-left">
						<div>{receipt.tenantName}</div>
						<AddressBlock lines={receipt.tenantAddressLines} />
					</div>
				</div>

				<div className="border border-black">
					<div className="border-b border-black px-4 py-4 text-center">
						<h2 className="text-[26px] font-bold leading-none">
							{receipt.documentTitle}
						</h2>
						<div className="mt-3 text-[16px] leading-5">
							<span className="font-bold">Période : </span>
							{receipt.periodLabel}
						</div>
						<div className="text-[16px] leading-5">
							<span className="font-bold">Adresse du logement : </span>
							{receipt.housingAddress}
						</div>
					</div>

					<div className="grid grid-cols-2 border-b border-black">
						<div className="border-r border-black p-3">
							<div className="mb-1 text-[18px] font-bold">PROPRIÉTAIRE</div>
							<div className="text-[16px]">{receipt.ownerName}</div>
						</div>

						<div className="p-3">
							<div className="mb-1 text-[18px] font-bold">LOCATAIRE</div>
							<div className="text-[16px]">{receipt.tenantName}</div>
						</div>
					</div>

					<table className="w-full border-collapse text-[16px]">
						<thead>
							<tr className="border-b border-black">
								<th className="border-r border-black p-3 text-left font-bold">
									Détail du règlement
								</th>
								<th className="p-3 text-right font-bold">Montant</th>
							</tr>
						</thead>

						<tbody>
							<tr className="border-b border-black">
								<td className="border-r border-black p-3">Loyer</td>
								<td className="p-3 text-right">
									{formatReceiptCurrency(receipt.rentAmount)}
								</td>
							</tr>

							<tr className="border-b border-black">
								<td className="border-r border-black p-3">Charges</td>
								<td className="p-3 text-right">
									{formatReceiptCurrency(receipt.chargesAmount)}
								</td>
							</tr>

							<tr>
								<td className="border-r border-black p-3 font-bold">Total</td>
								<td className="p-3 text-right font-bold">
									{formatReceiptCurrency(receipt.totalAmount)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p className="mt-5 text-[15px] leading-6">{declaration}</p>

				<div className="mt-5 text-[15px]">
					Fait à {receipt.issuedCity}, le {receipt.issuedAtLabel}
				</div>

				<div className="mt-5 flex justify-end">
					<div className="min-w-[42mm] text-center text-[15px]">
						<div className="italic">Le bailleur</div>
						<div>{receipt.ownerName}</div>
						<div className="mt-7 flex flex-col items-center">
							<Image
								alt=""
								src="/fake_signature.png"
								width={100}
								height={30}
								className="object-contain"
							/>
							<div className="h-[4mm] w-full border-b border-black/70 " />
						</div>
					</div>
				</div>

				{/* <div className="mt-[38mm] text-[12px] leading-4"> */}
				<div className="mt-[10mm] text-[12px] leading-4">
					{basDePage}
				</div>
			</div>
		</div>
	);
}
