import {
	Controller,
	Delete,
	Get,
	Post,
	Put,
	Request as request,
	Response as response,
} from "@inversifyjs/http-core";
import { inject } from "inversify";
import "reflect-metadata";

import type { Request, Response } from "express";
import { checkUserRole } from "../middlewares/check-user-roles-middleware";
import { UserRole } from "../models/models";
import type {
	IAddUserRequest,
	IDeleteUserRequest,
	IModifyUserRequest,
} from "../models/requests";
import { addUserValidator, modifyUserValidator } from "../models/validators";
import { type IUserService, userServiceKey } from "../services/user-service";

export const usersControllerKey = Symbol.for("UsersController");

@Controller("/api/v1/user")
@checkUserRole(UserRole.UserManager)
export class UsersController {
	constructor(
    @inject(userServiceKey) private readonly userService: IUserService,
  ) {}

	@Post("/")
	async addUser(
		@request() req: Request,
		@response() res: Response,
	): Promise<void> {
		const basePayload: IAddUserRequest = {
			email: req.body.email,
			password: req.body.password,
			roles: req.body.roles,
		};

		const payload = await addUserValidator.validate(basePayload);
		const response = await this.userService.addUser(payload);
		res.status(201).json(response);
	}

	@Put("/")
	async modifyUser(
		@request() req: Request,
		@response() res: Response,
	): Promise<void> {
		const basePayload: IModifyUserRequest = {
			email: req.body.email,
			isActive: req.body.isActive,
			password: req.body.password,
			roles: req.body.roles,
		};
		const payload = await modifyUserValidator.validate(basePayload);
		const response = await this.userService.modifyUser(payload);
		res.status(200).json(response);
	}

	@Delete("/:email")
	async deleteUser(
		@request() req: Request,
		@response() res: Response,
	): Promise<void> {
		const basePayload: IDeleteUserRequest = {
			email: req.params.email as string,
		};
		const payload = await modifyUserValidator.validate(basePayload);
		const response = await this.userService.deleteUser(payload);
		res.status(200).json(response);
	}

	@Get("/")
	@checkUserRole(UserRole.UserManager)
	async listUsers(
		@request() _req: Request,
		@response() res: Response,
	): Promise<void> {
		const response = await this.userService.listUsers();
		res.status(200).json(response);
	}
}
