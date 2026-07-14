import { Container } from "inversify";
import {
	AppConfigServiceFromEnv,
	appConfigServiceKey,
	type IAppConfigService,
} from "../services/app-config-service";
import "../controllers/authentication-controller";
import "../controllers/shutters-controller";
import "../controllers/shutters-operations-controller";
import {
	type IUserService,
	UserService,
	userServiceKey,
} from "../services/user-service";
import {
	type ITokenService,
	TokenService,
	tokenServiceKey,
} from "../services/token-service";
import "../controllers/authentication-controller";
import "../controllers/users-controller";
import {
	type IShuttersProxyService,
	ShuttersProxyService,
	shuttersProxyServiceKey,
} from "../services/shutters-proxy-service";
import { AuthenticationController } from "../controllers/authentication-controller";
import { ShuttersController } from "../controllers/shutters-controller";
import { ShuttersOperationsController } from "../controllers/shutters-operations-controller";
import { errorFilterList } from "../middlewares/error-middleware";
import {
	CheckLightManagerRole,
	checkLightManagerRoleKey,
	CheckLightOperatorRole,
	checkLightOperatorRoleKey,
	CheckShutterManagerRole,
	checkShutterManagerRoleKey,
	CheckUserManagerRole,
	checkUserManagerRoleKey,
} from "../middlewares/check-user-roles-middleware";
import {
	TokenCheckInterceptor,
	tokenCheckInterceptorKey,
} from "../middlewares/check-token-middleware";
import {
	CorsMiddleware,
	corsMiddlewareKey,
} from "../middlewares/cors-middleware";
import { UsersController } from "../controllers/users-controller";
import { LightsManagementController } from "../controllers/lights-management-controller";
import { LightsOperationsController } from "../controllers/lights-operations-controller";
import {
	ILightsProxyService,
	LightsProxyService,
	lightsProxyServiceKey,
} from "../services/lights-proxy-service";

export function setupContainer(): Container {
	const c: Container = new Container();

	c.bind<CorsMiddleware>(corsMiddlewareKey)
		.to(CorsMiddleware)
		.inSingletonScope();

	c.bind(AuthenticationController).toSelf().inSingletonScope();
	c.bind(ShuttersController).toSelf().inSingletonScope();
	c.bind(ShuttersOperationsController).toSelf().inSingletonScope();
	c.bind(UsersController).toSelf().inSingletonScope();
	c.bind(LightsManagementController).toSelf().inSingletonScope();
	c.bind(LightsOperationsController).toSelf().inSingletonScope();

	errorFilterList.forEach((efl) => {
		c.bind(efl).toSelf().inSingletonScope();
	});

	c.bind<CheckUserManagerRole>(checkUserManagerRoleKey)
		.to(CheckUserManagerRole)
		.inSingletonScope();
	c.bind<CheckShutterManagerRole>(checkShutterManagerRoleKey)
		.to(CheckShutterManagerRole)
		.inSingletonScope();
	c.bind<CheckLightManagerRole>(checkLightManagerRoleKey)
		.to(CheckLightManagerRole)
		.inSingletonScope();
	c.bind<CheckLightOperatorRole>(checkLightOperatorRoleKey)
		.to(CheckLightOperatorRole)
		.inSingletonScope();
	c.bind<TokenCheckInterceptor>(tokenCheckInterceptorKey)
		.to(TokenCheckInterceptor)
		.inSingletonScope();

	c.bind<IAppConfigService>(appConfigServiceKey)
		.to(AppConfigServiceFromEnv)
		.inSingletonScope();

	c.bind<IUserService>(userServiceKey).to(UserService).inSingletonScope();

	c.bind<ITokenService>(tokenServiceKey).to(TokenService).inSingletonScope();

	c.bind<IShuttersProxyService>(shuttersProxyServiceKey)
		.to(ShuttersProxyService)
		.inSingletonScope();
	c.bind<ILightsProxyService>(lightsProxyServiceKey)
		.to(LightsProxyService)
		.inSingletonScope();
	return c;
}

const container = setupContainer();
console.log("Container initialized");
export { container };
