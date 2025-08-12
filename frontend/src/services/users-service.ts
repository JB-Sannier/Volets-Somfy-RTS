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

export async function addUser(
  request: IAddUserRequest,
): Promise<IAddUserResponse> {
  const url = "/api/v1/user";
  try {
    const response = await axios.post<IAddUserResponse>(url, request);
    return response.data;
  } catch (error: unknown) {
    console.error("Error occured when trying to do : addUser : ", error);
    throw error;
  }
}

export async function modifyUser(
  request: IModifyUserRequest,
): Promise<IModifyUserResponse> {
  const url = "/api/v1/user";
  try {
    const response = await axios.put<IModifyUserResponse>(url, request);
    return response.data;
  } catch (error: unknown) {
    console.error("Error occured when trying to do : modifyUser : ", error);
    throw error;
  }
}

export async function deleteUser(
  request: IDeleteUserRequest,
): Promise<IDeleteUserResponse> {
  const url = `/api/v1/user/${encodeURI(request.email)}`;
  try {
    const response = await axios.delete<IModifyUserResponse>(url);
    return response.data;
  } catch (error: unknown) {
    console.error("Error occured when trying to do : addUser : ", error);
    throw error;
  }
}

export async function listUsers(): Promise<IListUsersResponse> {
  const url = "/api/v1/user";
  try {
    const response = await axios.get<IListUsersResponse>(url);
    return response.data;
  } catch (error: unknown) {
    console.error("Eror occured when trying to do : listUsers : ", error);
    throw error;
  }
}
