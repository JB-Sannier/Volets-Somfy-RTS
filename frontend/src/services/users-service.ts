import type {
  IAddUserRequest,
  IAddUserResponse,
  IDeleteUserRequest,
  IDeleteUserResponse,
  IListUsersResponse,
  IModifyUserRequest,
  IModifyUserResponse,
} from "./users-service.types";
import axios from "axios";

declare const BACKEND_URL: string;
const BASE_PATH = `${BACKEND_URL}/api/v1/user`;

export const useUserApis = () => {
  async function addUser(request: IAddUserRequest): Promise<IAddUserResponse> {
    const url = BASE_PATH;
    try {
      const response = await axios.post<IAddUserResponse>(url, request);
      return response.data;
    } catch (error: unknown) {
      console.error("Error occured when trying to do : addUser : ", error);
      throw error;
    }
  }

  async function modifyUser(
    request: IModifyUserRequest,
  ): Promise<IModifyUserResponse> {
    const url = BASE_PATH;
    try {
      const response = await axios.put<IModifyUserResponse>(url, request);
      return response.data;
    } catch (error: unknown) {
      console.error("Error occured when trying to do : modifyUser : ", error);
      throw error;
    }
  }

  async function deleteUser(
    request: IDeleteUserRequest,
  ): Promise<IDeleteUserResponse> {
    const url = `${BASE_PATH}/${encodeURI(request.email)}`;
    try {
      const response = await axios.delete<IModifyUserResponse>(url);
      return response.data;
    } catch (error: unknown) {
      console.error("Error occured when trying to do : addUser : ", error);
      throw error;
    }
  }

  async function listUsers(): Promise<IListUsersResponse> {
    const url = BASE_PATH;
    try {
      const response = await axios.get<IListUsersResponse>(url);
      return response.data;
    } catch (error: unknown) {
      console.error("Eror occured when trying to do : listUsers : ", error);
      throw error;
    }
  }

  return { addUser, modifyUser, deleteUser, listUsers };
};
