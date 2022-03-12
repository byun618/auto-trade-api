import axios, { AxiosResponse, Method } from 'axios'

interface IRequestProps {
  method: Method
  url: string
  params?: {}
  data?: {}
  headers?: {}
}

export default class Api {
  private async request<T>({
    method,
    url,
    params,
    data,
    headers,
  }: IRequestProps): Promise<AxiosResponse<T>> {
    return await axios({
      method,
      url,
      params,
      data,
      headers,
    })
  }

  protected async get<T>(
    url: string,
    params?: {},
    headers?: {},
  ): Promise<AxiosResponse<T>> {
    return await this.request({
      method: 'GET',
      url,
      params,
      headers,
    })
  }

  protected async post<T>(
    url: string,
    data?: {},
    headers?: {},
  ): Promise<AxiosResponse<T>> {
    return await this.request({
      method: 'POST',
      url,
      data,
      headers,
    })
  }
}
