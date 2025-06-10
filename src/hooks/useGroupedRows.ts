import { useMemo } from "react";

type GroupedRow = any & {
    isGroup?: boolean;
    groupLabel?: string;
};

export function useGroupedRows(
    originalRows: any[],
    groupBy: string | null
): GroupedRow[] {
    return useMemo(() => {
        if (!groupBy) return originalRows;

        const grouped = new Map<string, any[]>();

        for (const row of originalRows) {
            const key = row[groupBy] ?? "(No Group)";

            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key)!.push(row);
        }

        const seen = new Set<string>();
        const groupOrder: string[] = [];

        for (const row of originalRows) {
            const key = row[groupBy] ?? "(No Group)";
            if (!seen.has(key)) {
                seen.add(key);
                groupOrder.push(key);
            }
        }

        const flatRows: any[] = [];
        let idCounter = -1;
        for (const key of groupOrder) {
            flatRows.push({
                id: idCounter--,
                isGroup: true,
                groupLabel: key,
                [groupBy]: key,
            });
            flatRows.push(...grouped.get(key)!);
        }
        return flatRows;
    }, [groupBy, originalRows]);
}