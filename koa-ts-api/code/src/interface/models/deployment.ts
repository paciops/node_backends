import { Project } from './project';

export const Statuses = [
  'pending',
  'building',
  'deploying',
  'failed',
  'cancelled',
  'done',
] as const;

export type Status = (typeof Statuses)[number];

export interface Deployment {
  id: number;

  deployedIn?: number;

  status: Status;

  createdAt: Date;

  projectId: Project['id'];
}
