export const sortByDescription = (data: any[]) =>
    data?.slice().sort((a, b) => {
        const nameA = a.shortDescription?.toLowerCase() ?? "";
        const nameB = b.shortDescription?.toLowerCase() ?? "";
        return nameA.localeCompare(nameB);
    })