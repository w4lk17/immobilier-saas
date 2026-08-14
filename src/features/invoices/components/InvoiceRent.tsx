export default function InvoiceRent() {
  return (
    <div
      className="
        bg-white
        shadow-xl
        mx-auto
        text-black
      "
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Entêtes */}
      <div className="flex justify-between mb-24">
        <div className="text-[18px] leading-8">
          <div>Jean Martin</div>
          <div>1 Grande Rue</div>
          <div>69007 Lyon</div>
        </div>

        <div className="text-[18px] leading-8 text-left mt-10">
          <div>Marie Leroy</div>
          <div>100 avenue des Frères Lumière</div>
          <div>69008 Lyon</div>
        </div>
      </div>

      {/* Bloc principal */}
      <div className="border border-black">
        <div className="border-b border-black py-6 text-center">
          <h1 className="text-5xl font-bold tracking-wide">
            QUITTANCE DE LOYER
          </h1>

          <div className="mt-4 text-2xl">
            <span className="font-bold">Période :</span> du 01/04/2022 au
            30/04/2022
          </div>

          <div className="text-2xl">
            <span className="font-bold">Adresse du logement :</span>
            {" "}
            100 avenue des Frères Lumière, 69008 Lyon
          </div>
        </div>

        {/* Propriétaire / Locataire */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-4">
            <div className="font-bold text-3xl mb-2">
              PROPRIÉTAIRE
            </div>
            <div className="text-2xl">Jean Martin</div>
          </div>

          <div className="p-4">
            <div className="font-bold text-3xl mb-2">
              LOCATAIRE
            </div>
            <div className="text-2xl">Marie Leroy</div>
          </div>
        </div>

        {/* Tableau */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left p-4 border-r border-black text-2xl font-bold">
                Détail du règlement
              </th>

              <th className="text-right p-4 text-2xl font-bold">
                Montant
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-black">
              <td className="p-4 border-r border-black text-2xl">
                Loyer
              </td>
              <td className="p-4 text-right text-2xl">
                860,00 €
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="p-4 border-r border-black text-2xl">
                Charges
              </td>
              <td className="p-4 text-right text-2xl">
                55,00 €
              </td>
            </tr>

            <tr>
              <td className="p-4 border-r border-black font-bold text-2xl">
                Total
              </td>
              <td className="p-4 text-right font-bold text-2xl">
                915,00 €
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Texte */}
      <div className="mt-8 text-[22px] leading-relaxed">
        Je soussigné(e) Jean Martin propriétaire du logement désigné
        ci-dessus, déclare avoir reçu de la part du locataire
        l’ensemble des sommes mentionnées au titre du loyer et des
        charges.
      </div>

      <div className="mt-10 text-[22px]">
        Fait à Lyon, le 02/04/2022
      </div>

      {/* Signature */}
      <div className="flex justify-end mt-8">
        <div className="text-center">
          <div className="italic text-[22px]">
            Le bailleur
          </div>

          <div className="text-[22px]">
            Jean Martin
          </div>

          <div className="text-8xl rotate-[-12deg] mt-2">
            ✍
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-40 text-[18px] leading-snug">
        Cette quittance annule tous les reçus qui auraient pu être
        donnés pour acomptes versés au titre du loyer et des charges
        pour l’échéance correspondante. Le paiement de la présente
        quittance ne présume pas du paiement des termes précédents.
        À conserver 3 ans après échéance du bail.
      </div>
    </div>
  );
}