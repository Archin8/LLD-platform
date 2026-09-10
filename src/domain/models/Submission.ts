export interface ClassDefinition {
  name: string;
  type: 'class' | 'interface' | 'abstract_class' | 'enum';
  responsibility: string;
  fields?: string[];
  methods?: string[];
}

export type RelationshipKind =
  | 'inherits'
  | 'implements'
  | 'composes'
  | 'aggregates'
  | 'uses';

export interface RelationshipDefinition {
  from: string;
  to: string;
  kind: RelationshipKind;
}

export interface Submission {
  id?: string;
  attemptId?: string;
  classes: ClassDefinition[];
  relationships: RelationshipDefinition[];
  rationale?: string | null;
  submittedAt?: Date;
}
