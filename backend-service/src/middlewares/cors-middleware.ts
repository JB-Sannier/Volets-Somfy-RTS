import type * as express from "express";
import { provide } from "@inversifyjs/binding-decorators";
import type { ExpressMiddleware } from "@inversifyjs/http-express";
import cors from "cors";

export const corsMiddlewareKey = Symbol.for("CorsInterceptor");

export const appCors = cors({ origin: "*" });

@provide(corsMiddlewareKey)
export class CorsMiddleware implements ExpressMiddleware {
	public execute(
		request: express.Request,
		response: express.Response,
		next: express.NextFunction,
	): void {
		appCors(request, response, next);
	}
}
