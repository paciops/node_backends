export interface Project {
  id: number;

  name: string;

  hasOngoingDeployment: boolean;

  hasLiveDeployment: boolean;

  url?: string;

  createdAt: Date;
}
