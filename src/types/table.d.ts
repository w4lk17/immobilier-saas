import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    // Générique pour voir les détails d'une ligne (utilisé par User, Expense, etc.)
    viewDetails?: (rowData: TData) => void;

    // Spécifique à User (optionnel, donc pas d'erreur sur les autres tables)
    toggleStatus?: (id: number, isActive: boolean) => void;
    isUpdatingStatus?: boolean;

    // Tu peux ajouter d'autres actions globales ici...
    // deleteRow?: (id: number) => void;
  }
}