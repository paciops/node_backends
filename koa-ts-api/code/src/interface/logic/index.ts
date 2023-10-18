import { Deployment, Project, Status, User } from '../models/index';

export interface UserLogic {
  getById(id: User['id']): User | Promise<User>;
}

export interface ProjectLogic {
  getById(id: Project['id']): Project | Promise<Project>;
  getAll(limit?: number, skip?: number): Array<Project> | Promise<Array<Project>>;
}

export interface DeploymentLogic {
  getById(id: Deployment['id']): Deployment | Promise<Deployment>;
  getAll(limit?: number, skip?: number): Array<Deployment> | Promise<Array<Deployment>>;
  create(id: Project['id']): Deployment | Promise<Deployment>;
  cancel(id: Deployment['id']): Deployment | Promise<Deployment>;
  generateProjectURL(id: Deployment['id']): Deployment | Promise<Deployment>;
  setDeployTime(id: Deployment['id']): void | Promise<void>;
  isAuthenticated(id: Deployment['id'], appSecret: string): boolean | Promise<boolean>;
  updateStatus(id: Deployment['id'], status: Status): void | Promise<void>;
}
