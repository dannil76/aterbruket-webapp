export default function remove(array: string[], name: string): string[] {
    return array.filter((value) => value !== name);
}
