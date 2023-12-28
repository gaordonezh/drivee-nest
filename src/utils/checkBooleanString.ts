export class CheckBooleanString {
  parseBoolean(value: string): boolean | undefined {
    if (/^true$/.test(value)) return true;
    if (/^false$/.test(value)) return false;
    return undefined;
  }
}
