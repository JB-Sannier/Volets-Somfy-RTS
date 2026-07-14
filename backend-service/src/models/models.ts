export enum UserRole {
	UserManager = "user_manager",
	ShuttersProgrammer = "shutters_programmer",
	LightsUser = "lights_user",
	LightsProgrammer = "lights_programmer",
}

export interface IUser {
	email: string;
	password: string;
	isActive: boolean;
	roles: UserRole[];
}
