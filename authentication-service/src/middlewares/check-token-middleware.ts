import type * as express from "express";
import { UnauthorizedError } from "../models/app-error";
import { container } from "../ioc/container";
import { type ITokenService, tokenServiceKey } from "../services/token-service";
import {
	UseInterceptor,
	type InterceptorTransformObject,
} from "@inversifyjs/http-core";
import type { ExpressInterceptor } from "@inversifyjs/http-express";
import type { ITokenInformations } from "../models/requests";
import { provide } from "@inversifyjs/binding-decorators";

export const tokenCheckInterceptorKey = Symbol.for("TokenCheckInterceptor");

export interface IAuthentifiedRequest extends express.Request {
	tokenInfos: ITokenInformations;
}

@provide(tokenCheckInterceptorKey)
export class TokenCheckInterceptor implements ExpressInterceptor {
	public async intercept(
		request: express.Request,
		_response: express.Response,
		next: () => Promise<InterceptorTransformObject>,
	): Promise<void> {
		if (!request.headers.authorization) {
			throw new UnauthorizedError();
		}
		const tokenService = container.get<ITokenService>(tokenServiceKey);
		const tokenInfos = await tokenService.validateToken(
			request.headers.authorization,
		);
		if (tokenInfos) {
			(request as IAuthentifiedRequest).tokenInfos = tokenInfos;
			await next();
		}
	}
}

export function checkToken() {
	return UseInterceptor(tokenCheckInterceptorKey);
}
