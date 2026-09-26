import type { ComponentSnapshot, ComponentSpec, DiffRow } from './types';

const selectedFields: Array<Exclude<keyof ComponentSpec, 'snapshots'>> = [
  'name', 'category', 'status', 'purpose', 'usage', 'states', 'keyboardBehavior', 'screenReader', 'disabledScenarios'
];

const format = (value: unknown): string => {
  if (Array.isArray(value)) return value.map((item) => JSON.stringify(item)).join('\n');
  return String(value ?? '');
};

const formatDependencies = (ids: string[] | undefined, resolveName: (id: string) => string): string =>
  (ids ?? []).map(resolveName).join('\n');

export function diffAgainstSnapshot(
  component: ComponentSpec,
  snapshot?: ComponentSnapshot,
  resolveName: (id: string) => string = (id) => id
): DiffRow[] {
  if (!snapshot) return [];
  const rows: DiffRow[] = [];
  for (const field of selectedFields) {
    const before = format(snapshot.component[field]);
    const after = format(component[field]);
    if (before !== after) rows.push({ field: String(field), before, after });
  }
  const beforeProperties = format(snapshot.component.properties);
  const afterProperties = format(component.properties);
  if (beforeProperties !== afterProperties) rows.push({ field: 'properties', before: beforeProperties, after: afterProperties });
  const beforeExamples = format(snapshot.component.examples);
  const afterExamples = format(component.examples);
  if (beforeExamples !== afterExamples) rows.push({ field: 'examples', before: beforeExamples, after: afterExamples });
  const beforeDependencies = formatDependencies(snapshot.component.dependencies, resolveName);
  const afterDependencies = formatDependencies(component.dependencies, resolveName);
  if (beforeDependencies !== afterDependencies) rows.push({ field: 'dependencies', before: beforeDependencies, after: afterDependencies });
  return rows;
}
