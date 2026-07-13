import React, { useState } from "react";
import {
  EMPTY_LIGHT,
  type ILight,
  LightFrequencies,
  LightTypes,
} from "../../services/lights-management-service.types";
import {
  TextField,
  Select,
  type SelectChangeEvent,
  MenuItem,
  Grid,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLightEditValidationRules } from "./light-edit-component.rules";

export interface ILightEditComponentProps {
  light: ILight;
  allLights: ILight[];
  lightModified: (light: ILight) => void;
  saveLight: (light: ILight) => void;
  disabled: boolean;
}

export const LightEditComponent: React.FC<ILightEditComponentProps> = (
  props,
) => {
  const { t } = useTranslation("light-edit-component", {
    nsMode: "default",
    useSuspense: false,
  });
  const { validateLight } = useLightEditValidationRules();

  const [currentLight, setCurrentLight] = useState<ILight>(EMPTY_LIGHT);

  if (currentLight.lightId === "" && props.light.lightId !== "") {
    setCurrentLight(props.light);
  }

  function onChangeLightName(newLightName: string) {
    const newLight: ILight = { ...currentLight, lightName: newLightName };
    setCurrentLight(newLight);
    props.lightModified(newLight);
  }

  function onTypeChange(event: SelectChangeEvent<LightTypes>) {
    const newLight: ILight = { ...currentLight, type: event.target.value };
    setCurrentLight(newLight);
    props.lightModified(newLight);
  }

  function onFrequencyChange(event: SelectChangeEvent<LightFrequencies>) {
    const newLight: ILight = {
      ...currentLight,
      frequency: event.target.value,
    };

    setCurrentLight(newLight);
    props.lightModified(newLight);
  }

  function onProtocolChange(newValue: string) {
    try {
      const intValue = parseInt(newValue);
      const newLight: ILight = { ...currentLight, protocol: intValue };
      setCurrentLight(newLight);
      props.lightModified(newLight);
    } catch (error) {
      console.log("onProtocolChange: got error on parseInt : ", error);
    }
  }

  function onPulseDelayChange(newValue: string) {
    try {
      const intValue = parseInt(newValue);
      const newLight: ILight = { ...currentLight, pulseLength: intValue };
      setCurrentLight(newLight);
      props.lightModified(newLight);
    } catch (error) {
      console.log("onPulseDelayChange: got error on parseInt : ", error);
    }
  }

  function onSwitchOnCode(newValue: string) {
    try {
      const intValue = parseInt(newValue);
      const newLight: ILight = { ...currentLight, switchOnCode: intValue };
      setCurrentLight(newLight);
      props.lightModified(newLight);
    } catch (error) {
      console.log("onSwitchOnCode: got error on parseInt : ", error);
    }
  }

  function onSwitchOffCode(newValue: string) {
    try {
      const intValue = parseInt(newValue);
      const newLight: ILight = { ...currentLight, switchOffCode: intValue };
      setCurrentLight(newLight);
      props.lightModified(newLight);
    } catch (error) {
      console.log("onSwitchOffCode: got error on parseInt : ", error);
    }
  }

  const validationResult = validateLight(props.allLights, currentLight);

  const lightNameHelperText = validationResult.lightNameEmpty
    ? t("ErrorLightNameEmpty")
    : validationResult.lightNameAlreadyExists
      ? t("ErrorLightAlreadyExists")
      : undefined;

  return (
    <>
      <Typography variant="body1">{t("LightName")}</Typography>
      <TextField
        value={currentLight.lightName}
        onChange={(e) => onChangeLightName(e.target.value)}
        disabled={props.disabled}
        error={lightNameHelperText !== undefined}
        helperText={lightNameHelperText}
        fullWidth
      />
      <Typography variant="body1">{t("Description")}</Typography>
      <TextField
        value={currentLight.description}
        disabled={props.disabled}
        fullWidth
        onChange={(e) =>
          setCurrentLight({ ...currentLight, description: e.target.value })
        }
        error={currentLight.description === ""}
        helperText={
          currentLight.description === ""
            ? t("ErrorLightDescriptionEmpty")
            : undefined
        }
      />
      <Typography variant="body1">{t("Type")}</Typography>
      <Select<LightTypes>
        value={currentLight.type}
        onChange={onTypeChange}
        disabled={props.disabled}
      >
        <MenuItem value={LightTypes.TYPE_SWITCH}>{t("TypeSwitch")}</MenuItem>
        <MenuItem value={LightTypes.TYPE_TWO_BUTTONS}>
          {t("TypeTwoButtons")}
        </MenuItem>
      </Select>

      <Typography variant="body1">{t("Frequency")}</Typography>

      <Select<LightFrequencies>
        labelId="lightFrequencyLabel"
        id="frequency-select"
        value={currentLight.frequency}
        onChange={onFrequencyChange}
        disabled={props.disabled}
      >
        <MenuItem value={LightFrequencies.FREQ_315}>{t("315-Mhz")}</MenuItem>
        <MenuItem value={LightFrequencies.FREQ_433}>
          {t("433dot92Mhz")}
        </MenuItem>
        <MenuItem value={LightFrequencies.FREQ_868}>{t("868Mhz")}</MenuItem>
      </Select>
      <Typography variant="body1">{t("Protocol")}</Typography>
      <TextField
        defaultValue={"0"}
        onChange={(e) => onProtocolChange(e.target.value)}
        value={currentLight.protocol.toString()}
        disabled={props.disabled}
      />
      <Typography variant="body1">{t("PulseDelay")}</Typography>
      <TextField
        defaultValue={"150"}
        onChange={(e) => onPulseDelayChange(e.target.value)}
        value={currentLight.pulseLength.toString()}
        disabled={props.disabled}
        error={validationResult.pulseLengthZero}
        helperText={
          validationResult.pulseLengthZero ? t("PulseDelayNotZero") : undefined
        }
      />
      <Typography variant="body1">{t("SwitchOnCode")}</Typography>
      <TextField
        defaultValue={0}
        onChange={(e) => onSwitchOnCode(e.target.value)}
        value={currentLight.switchOnCode.toString()}
        disabled={props.disabled}
        error={validationResult.switchOnCodeZero}
        helperText={
          validationResult.switchOnCodeZero
            ? t("SwitchOnCodeNotZero")
            : undefined
        }
      />
      <Typography variant="body1">{t("SwitchOffCode")}</Typography>
      <TextField
        defaultValue={0}
        onChange={(e) => onSwitchOffCode(e.target.value)}
        value={currentLight.switchOffCode.toString()}
        disabled={props.disabled}
        error={validationResult.switchOffCodeZero}
        helperText={
          validationResult.switchOffCodeZero
            ? t("SwitchOffCodeNotZero")
            : undefined
        }
      />
      <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
        <Grid>
          <Button
            onClick={() => props.saveLight(currentLight)}
            title={t("SaveLight")}
            variant="contained"
            disabled={!validationResult.isLightValid || props.disabled}
          >
            {t("SaveLight")}
          </Button>
        </Grid>
      </Stack>
    </>
  );
};
