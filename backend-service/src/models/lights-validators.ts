import { string, object, ObjectSchema, number, array, mixed } from "yup";
import {
	ILight,
	ILightWithoutId,
	IAddLightRequest,
	IDeleteLightRequest,
	IGetLightRequest,
	IImportLightsRequest,
	ISwitchLightRequest,
	LightFrequencies,
	LightTypes,
} from "../models/lights-requests";

export const lightIdValidator: ObjectSchema<{ lightId: string }> = object({
	lightId: string().required("lightId is required"),
});

export const lightWithoutIdValidator: ObjectSchema<ILightWithoutId> = object({
	lightName: string().required("lightName is required"),
	description: string().required("description is required"),
	type: mixed<LightTypes>()
		.required("type is required")
		.oneOf(
			[LightTypes.TYPE_SWITCH, LightTypes.TYPE_TWO_BUTTONS],
			"type must be a valid light type",
		),
	switchOnCode: number().required("switchOnCode is required"),
	switchOffCode: number().required("switchOffCode is required"),
	pulseLength: number().optional().default(200),
	protocol: number().optional().default(0),
	frequency: mixed<LightFrequencies>()
		.optional()
		.default(LightFrequencies.FREQ_433)
		.oneOf(
			Object.values(LightFrequencies) as number[],
			"frequency must be one of 315, 433, or 868",
		),
});

export const switchLightValidator: ObjectSchema<ISwitchLightRequest> =
	lightIdValidator;

export const addLightValidator: ObjectSchema<IAddLightRequest> =
	lightWithoutIdValidator;

export const modifyLightValidator: ObjectSchema<ILight> =
	lightIdValidator.concat(lightWithoutIdValidator);

export const deleteLightValidator: ObjectSchema<IDeleteLightRequest> =
	lightIdValidator;

export const getLightValidator: ObjectSchema<IGetLightRequest> =
	lightIdValidator;

export const importLightsValidator: ObjectSchema<IImportLightsRequest> = object(
	{
		lights: array()
			.of(lightWithoutIdValidator.concat(lightIdValidator))
			.min(1, "At least one light is required")
			.required("Lights array is required"),
	},
).defined();
