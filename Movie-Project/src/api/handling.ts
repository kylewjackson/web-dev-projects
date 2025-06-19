export default async function handleApi<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error(error);
    return null;
  }
}
