import { AxiosRequestConfig } from 'axios';
export interface AxiosResponse<T = never> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig<T>;
  request?: any;
  results?: any;
}
export type unknownObj = {
  [key: string]: any;
};

export type buttonType = {
  color?: string | null;
  backgroundColor?: string | null;
  func?: Function | null;
  text?: string | null;
};
