import { TableConfig } from "@/types/table";
import { useAppContext } from "./useAppContext";
import { State } from "../AppContext";

export const useTableConfig = <T,>(
    configBuilder: (context: State) => TableConfig<T>
): TableConfig<T> => {
    const context = useAppContext();
    return configBuilder(context);
};