import { type ILight } from "../../services/lights-management-service.types";

export interface ILightValidationRules {
  lightNameEmpty: boolean;
  lightNameAlreadyExists: boolean;
  descriptionEmpty: boolean;
  pulseLengthZero: boolean;
  switchOnCodeZero: boolean;
  switchOffCodeZero: boolean;
  isLightValid: boolean;
}

export const useLightEditValidationRules = () => {
  function validateLight(
    allLights: ILight[],
    light: ILight,
  ): ILightValidationRules {
    const lightNameEmpty = light.lightName === "";
    const lightNameAlreadyExists =
      allLights.filter(
        (l) => light.lightName === l.lightName && light.lightId !== l.lightId,
      ).length > 0;
    const descriptionEmpty = light.description === "";
    const pulseLengthZero = light.pulseLength === 0;
    const switchOnCodeZero = light.switchOnCode === 0;
    const switchOffCodeZero = light.switchOffCode === 0;
    const isLightValid =
      !lightNameEmpty &&
      !lightNameAlreadyExists &&
      !descriptionEmpty &&
      !pulseLengthZero &&
      !switchOnCodeZero &&
      !switchOffCodeZero;

    return {
      lightNameEmpty,
      lightNameAlreadyExists,
      descriptionEmpty,
      pulseLengthZero,
      switchOnCodeZero,
      switchOffCodeZero,
      isLightValid,
    };
  }

  return { validateLight };
};
