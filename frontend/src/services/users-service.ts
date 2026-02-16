import { processRequest, type IHttpEndpoint } from "./base-api-calls";
import type {
  IAddUserRequest,
  IAddUserResponse,
  IDeleteUserRequest,
  IDeleteUserResponse,
  IListUsersResponse,
  IModifyUserRequest,
  IModifyUserResponse,
} from "./users-service.types";

declare const BACKEND_URL: string;
const BASE_PATH = `${BACKEND_URL}/api/v1/user`;

export const useUserApis = () => {
  async function addUser(request: IAddUserRequest): Promise<IAddUserResponse> {
    const addUserEndpoint: IHttpEndpoint = {
      url: BASE_PATH,
      method: 'post',
      needsAuth: true,
    }
    try {
      const response = await processRequest<IAddUserRequest, IAddUserResponse>(addUserEndpoint, request);
      return response;
    } catch (error: unknown) {
      console.error("Error occured when trying to do : addUser : ", error);
      throw error;
    }
  }

  async function modifyUser(
    request: IModifyUserRequest,
  ): Promise<IModifyUserResponse> {
    const modifyUserEndpoint: IHttpEndpoint = {
      url: BASE_PATH,
      method: 'put',
      needsAuth: true,
    }
    try {
      const response = await processRequest<IModifyUserRequest, IModifyUserResponse>(modifyUserEndpoint, request);
      return response;
    } catch (error: unknown) {
      console.error("Error occured when trying to do : modifyUser : ", error);
      throw error;
    }
  }

  async function deleteUser(
    request: IDeleteUserRequest,
  ): Promise<IDeleteUserResponse> {
    const deleteUserEndpoint: IHttpEndpoint = {
      url: `${BASE_PATH}/${encodeURI(request.email)}`,
      method: 'delete',
      needsAuth: true,
    }
    try {
      const response = await processRequest<void, IDeleteUserResponse>(deleteUserEndpoint);
      return response;
    } catch (error: unknown) {
      console.error("Error occured when trying to do : addUser : ", error);
      throw error;
    }
  }

  async function listUsers(): Promise<IListUsersResponse> {
    const listUsersEndpoint: IHttpEndpoint = {
      url: BASE_PATH,
      method: 'get',
      needsAuth: true,
    }
    try {
      const response = await processRequest<void, IListUsersResponse>(listUsersEndpoint);
      return response;
    } catch (error: unknown) {
      console.error("Eror occured when trying to do : listUsers : ", error);
      throw error;
    }
  }

  return { addUser, modifyUser, deleteUser, listUsers };
};
