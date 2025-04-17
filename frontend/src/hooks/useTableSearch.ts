// hooks/useTableSearch.ts
import { useState } from 'react';

export const useTableSearch = () => {
    const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

    const handleSearch = (tableId: string, query: string) => {
        setSearchQueries(prev => ({
            ...prev,
            [tableId]: query.toLowerCase(),
        }));
    };

    const getFilteredData = <T extends Record<string, any>>(
        tableId: string,
        data: T[],
        config?: {
            columns: Array<{
                key: string;
                searchable?: boolean;
            }>;
        }
    ): T[] => {
        const query = searchQueries[tableId] || '';
        if (!query || !data?.length) return data;

        return data.filter(item =>
            config?.columns?.some(column => {
                // Ищем только по колонкам с searchable: true
                if (column.searchable === false) return false;
                const value = item[column.key];
                return String(value).toLowerCase().includes(query);
            })
        );
    };

    return { handleSearch, getFilteredData };
};