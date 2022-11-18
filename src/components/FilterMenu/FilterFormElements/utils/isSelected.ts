export default function isSelected(array: string[], name: string): boolean {
    return array.some((value) => value === name);
}
