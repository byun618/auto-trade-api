import axios, { AxiosResponse, Method } from 'axios'
import AuthorizationToken from './authorization-token'

interface IAxiosProps {
  method: Method
  url: string
  params?: {}
}

export default class CustomAxios extends AuthorizationToken {
  constructor(UBIT_ACCESS_KEY?: string, UBIT_SECRET_KEY?: string) {
    super(UBIT_ACCESS_KEY, UBIT_SECRET_KEY)
  }

  /**
   * 업비트 ACCESS_KEY, SECRET_KEY 필요없이 사용가능한 API
   * @param IAxiosProps
   * @returns Promise<AxiosResponse<T>>
   */
  protected async getData<T>({
    method,
    url,
  }: IAxiosProps): Promise<AxiosResponse<T>> {
    return await axios({
      method,
      url,
    })
  }

  protected async getAuthData<T>({
    method,
    url,
  }: IAxiosProps): Promise<AxiosResponse<T>> {
    const token = super.getAuthorizationTokenNoParam()

    return await axios({
      method,
      url,
      headers: { Authorization: token },
    })
  }

  protected async getAuthParamData<T>({
    method,
    url,
    params = {},
  }: IAxiosProps): Promise<AxiosResponse<T>> {
    const { token, query } = super.getAuthorizationToken(params)

    return await axios({
      method,
      url: `${url}?${query}`,
      headers: { Authorization: token },
    })
  }
}
