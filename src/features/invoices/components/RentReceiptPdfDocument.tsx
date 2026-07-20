import {
	Document,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { RentReceiptViewModel, formatReceiptCurrency } from "./rentReceiptViewModel";

type RentReceiptPdfDocumentProps = {
	receipt: RentReceiptViewModel;
};

const styles = StyleSheet.create({
	page: {
		backgroundColor: "#ffffff",
		color: "#000000",
		fontFamily: "Helvetica",
		fontSize: 11,
		padding: "18mm",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: "34mm",
	},
	addressBlock: {
		width: "72mm",
		lineHeight: 1.25,
	},
	tenantAddress: {
		marginTop: "16mm",
	},
	box: {
		border: "1px solid #000000",
	},
	titleBlock: {
		borderBottom: "1px solid #000000",
		padding: 12,
		textAlign: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: 700,
		marginBottom: 8,
	},
	bold: {
		fontWeight: 700,
	},
	identityRow: {
		flexDirection: "row",
		borderBottom: "1px solid #000000",
	},
	identityCell: {
		width: "50%",
		padding: 10,
	},
	identityCellLeft: {
		borderRight: "1px solid #000000",
	},
	identityTitle: {
		fontSize: 15,
		fontWeight: 700,
		marginBottom: 4,
	},
	tableRow: {
		flexDirection: "row",
		borderBottom: "1px solid #000000",
	},
	tableRowLast: {
		flexDirection: "row",
	},
	tableCellLabel: {
		width: "50%",
		padding: 10,
		borderRight: "1px solid #000000",
	},
	tableCellAmount: {
		width: "50%",
		padding: 10,
		textAlign: "right",
	},
	bodyText: {
		fontSize: 12,
		lineHeight: 1.4,
		marginTop: 16,
	},
	madeAt: {
		fontSize: 12,
		marginTop: 16,
	},
	signatureWrap: {
		alignItems: "flex-end",
		marginTop: 16,
	},
	signature: {
		width: "42mm",
		textAlign: "center",
		fontSize: 12,
	},
	signatureLine: {
		height: "22mm",
		borderBottom: "1px solid #000000",
		marginTop: 18,
	},
	footer: {
		fontSize: 9,
		lineHeight: 1.25,
		marginTop: "38mm",
	},
});

function Lines({ lines }: { lines: string[] }) {
	return (
		<View>
			{lines.map((line, index) => (
				<Text key={`${line}-${index}`}>{line}</Text>
			))}
		</View>
	);
}

export function RentReceiptPdfDocument({ receipt }: RentReceiptPdfDocumentProps) {
	const declaration = receipt.isReceipt
		? `Je soussigné(e) ${receipt.ownerName} propriétaire du logement désigné ci-dessus, déclare avoir reçu de la part du locataire l'ensemble des sommes mentionnées au titre du loyer et des charges.`
		: "Ce document présente les sommes dues par le locataire au titre du loyer et des charges pour la période indiquée.";

	const basDePage = receipt.isReceipt
		? `Cette quittance annule tous les reçus qui auraient pu être donnés pour acomptes versés au titre du loyer et des charges pour l'échéance correspondante.Le paiement de la présente quittance ne présume pas du paiement des termes précédents. À conserver 3 ans après échéance du bail.`
		: "";

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<View style={styles.addressBlock}>
						<Text>{receipt.ownerName}</Text>
						<Lines lines={receipt.ownerAddressLines} />
					</View>

					<View style={[styles.addressBlock, styles.tenantAddress]}>
						<Text>{receipt.tenantName}</Text>
						<Lines lines={receipt.tenantAddressLines} />
					</View>
				</View>

				<View style={styles.box}>
					<View style={styles.titleBlock}>
						<Text style={styles.title}>{receipt.documentTitle}</Text>
						<Text>
							<Text style={styles.bold}>Période : </Text>
							{receipt.periodLabel}
						</Text>
						<Text>
							<Text style={styles.bold}>Adresse du logement : </Text>
							{receipt.housingAddress}
						</Text>
					</View>

					<View style={styles.identityRow}>
						<View style={[styles.identityCell, styles.identityCellLeft]}>
							<Text style={styles.identityTitle}>PROPRIÉTAIRE</Text>
							<Text>{receipt.ownerName}</Text>
						</View>
						<View style={styles.identityCell}>
							<Text style={styles.identityTitle}>LOCATAIRE</Text>
							<Text>{receipt.tenantName}</Text>
						</View>
					</View>

					<View style={styles.tableRow}>
						<Text style={[styles.tableCellLabel, styles.bold]}>
							Détail du règlement
						</Text>
						<Text style={[styles.tableCellAmount, styles.bold]}>Montant</Text>
					</View>
					<View style={styles.tableRow}>
						<Text style={styles.tableCellLabel}>Loyer</Text>
						<Text style={styles.tableCellAmount}>
							{formatReceiptCurrency(receipt.rentAmount)}
						</Text>
					</View>
					<View style={styles.tableRow}>
						<Text style={styles.tableCellLabel}>Charges</Text>
						<Text style={styles.tableCellAmount}>
							{formatReceiptCurrency(receipt.chargesAmount)}
						</Text>
					</View>
					<View style={styles.tableRowLast}>
						<Text style={[styles.tableCellLabel, styles.bold]}>Total</Text>
						<Text style={[styles.tableCellAmount, styles.bold]}>
							{formatReceiptCurrency(receipt.totalAmount)}
						</Text>
					</View>
				</View>

				<Text style={styles.bodyText}>{declaration}</Text>
				<Text style={styles.madeAt}>
					Fait à {receipt.issuedCity}, le {receipt.issuedAtLabel}
				</Text>

				<View style={styles.signatureWrap}>
					<View style={styles.signature}>
						<Text>Le bailleur</Text>
						<Text>{receipt.ownerName}</Text>
						{/* <View style={styles.signatureLine} /> */}
						<Image
							src="/fake_signature.png"
							style={styles.signatureLine}
						/>
					</View>
				</View>

				<Text style={styles.footer}>{basDePage}	</Text>
			</Page>
		</Document>
	);
}
