// eslint-disable-next-line @typescript-eslint/no-var-requires
import json from './json.json';

export function data(): boolean {
  return json.third.property;
}
