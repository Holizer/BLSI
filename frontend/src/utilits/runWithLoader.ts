export async function runWithLoader<T>(
     fetchFn: () => Promise<T>,
     setLoading: (loading: boolean) => void
): Promise<T | null> {
     setLoading(true);
     try {
          return await fetchFn();
     } catch (error) {
          console.error("Ошибка:", error);
          return null;
     } finally {
          setLoading(false);
     }
}