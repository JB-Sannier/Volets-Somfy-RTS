import {
  Button,
  Divider,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { useAuthContext } from "../contexts/auth-context.types";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../services/users-service.types";
import { GeneralLayout } from "../layouts/general-layout";
import { useShuttersManagementApis } from "../services/shutters-service";
import type {
  IListShuttersResponse,
  IShutter,
} from "../services/shutters-service.types";
import {
  callWithRemoteData,
  REMOTE_DATA_INIT,
  type RemoteData,
  RemoteDataStatus,
} from "../services/remote-data";
import { useSnackbar } from "../components/snackbar-component";
import { useShuttersOperationApis } from "../services/shutters-operations-service";
import { TitleComponent } from "../components/title-component";
import { useTranslation } from "react-i18next";

export const AddShutterPage: React.FC = () => {
  const shuttersManagementApis = useShuttersManagementApis();
  const shuttersOperationApis = useShuttersOperationApis();
  const authContext = useAuthContext();
  const { t } = useTranslation("add-shutter-page");
  const navigate = useNavigate();
  const { setSnackbarProps, SnackbarComponent } = useSnackbar();
  useEffect(() => {
    if (!authContext.hasRole(UserRole.ShuttersProgrammer)) {
      navigate("/");
    }
  }, [authContext, navigate]);

  const [allShutters, setAllShutters] = useState<IShutter[]>([]);
  const [listShuttersRD, setListShuttersRD] =
    useState<RemoteData<IListShuttersResponse>>(REMOTE_DATA_INIT);

  useEffect(() => {
    if (listShuttersRD.status === RemoteDataStatus.Init) {
      callWithRemoteData(
        shuttersManagementApis.listShutters,
        undefined,
        (newRd) => setListShuttersRD(newRd),
      );
    } else if (listShuttersRD.status === RemoteDataStatus.Loaded) {
      setAllShutters(listShuttersRD.payload);
    }
  }, [shuttersManagementApis.listShutters, listShuttersRD]);

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [shutterName, setShutterName] = useState<string>("");
  const [shutterId, setShutterId] = useState<string | undefined>(undefined);
  const [errorText, setErrorText] = useState<string | undefined>(
    t("MessageFillShutterName"),
  );
  const [successfulEnd, setSuccessfulEnd] = useState<boolean | undefined>(
    undefined,
  );

  function onChangeShutterName(newValue: string) {
    setShutterName(newValue);
    for (const shutter of allShutters) {
      if (shutter.shutterName === newValue) {
        setErrorText(t("MessageDuplicateShutterName"));
        return;
      }
    }
    if (newValue === "") {
      setErrorText(t("MessageFillShutterName"));
      return;
    }
    setErrorText(undefined);
  }

  async function addNewShutter() {
    try {
      const addShutterResponse = await shuttersManagementApis.addShutter({
        shutterName,
      });
      setShutterId(addShutterResponse.shutterId);
      setShutterName(addShutterResponse.shutterName);
      setCurrentStep(1);
      setSnackbarProps({
        message: `The shutter named ${addShutterResponse.shutterName} has been successfully created.`,
        severity: "success",
      });
    } catch (error) {
      console.error("While trying to add a new shutter, got error : ", error);
      setSnackbarProps({
        message: t("MessageErrorCreation"),
        severity: "error",
      });
    }
  }

  function handleProgramEvent() {
    if (!shutterId) {
      console.error(
        "CANNOT SEND Program COMMAND WHEN THE NEW SHUTTER IS NOT CREATED YET.",
      );
      return;
    }
    shuttersOperationApis.programShutter({ shutterId });
    setSnackbarProps({
      message: t("MessageProgramCommandSent"),
      severity: "info",
    });
  }

  function finalizeAddition() {
    setSuccessfulEnd(true);
    setCurrentStep(2);
  }

  async function cancelAddingShutter() {
    if (!shutterId) {
      console.error("CANNOT DELETE A SHUTTER THAT IS NOT CREATED YET.");
      return;
    }
    try {
      await shuttersManagementApis.deleteShutter({ shutterId });
      setSnackbarProps({
        message: t("MessageShutterDeletedSuccessfully"),
        severity: "info",
      });
      setSuccessfulEnd(false);
      setCurrentStep(2);
    } catch (error: unknown) {
      console.error(
        `While deleting the shutter ${shutterId} - ${shutterName}, got the following error : `,
        error,
      );
      setSnackbarProps({
        message: t("MessageShutterDeletedError"),
        severity: "error",
      });
    }
  }

  return (
    <GeneralLayout>
      <TitleComponent title={t("PageTitle")} />

      <Grid container justifyContent="center">
        <Grid sx={{ width: "50%", minWidth: "100px", maxWidth: "900px" }}>
          <Stepper activeStep={currentStep}>
            <Step key={1}>
              <StepLabel>{t("StepFillShutterName")}</StepLabel>
            </Step>
            <Step key={2}>
              <StepLabel>{t("StepProgramShutter")}</StepLabel>
            </Step>
          </Stepper>
        </Grid>
      </Grid>
      {currentStep === 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            {t("StepOneFillShutterName")}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1">{t("StepOneInstructions1")}</Typography>
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            value={shutterName}
            onChange={(e) => onChangeShutterName(e.target.value)}
            error={errorText !== undefined}
            helperText={errorText}
            label={t("StepOneHelperText")}
          />
          <Typography variant="body1">{t("StepOneInstructions2")}</Typography>
          <Grid container justifyContent="center">
            <Grid>
              <Button
                disabled={errorText !== undefined || shutterId !== undefined}
                variant="contained"
                onClick={() => addNewShutter()}
              >
                {t("ButtonAddShutter")}
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      {currentStep === 1 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            {t("Step2Title")}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1">{t("Step2Instructions1")}</Typography>
          <Typography variant="body1">{t("Step2Instructions2")}</Typography>
          <Typography variant="body1">{t("Step2Instructions3")}</Typography>
          <Grid container justifyContent="center">
            <Grid sx={{ ml: 4, mr: 2, mt: 2 }}>
              <Button onClick={() => handleProgramEvent()} variant="contained">
                {t("Step2SendProgramButton")}
              </Button>
            </Grid>
          </Grid>
          <Typography variant="body1" sx={{ mt: 5, mb: 2 }}>
            {t("Step2Instructions4")}
          </Typography>
          <Grid container justifyContent="center">
            <Grid sx={{ ml: 4, mr: 2 }}>
              <Button
                color="success"
                onClick={() => finalizeAddition()}
                variant="contained"
              >
                {t("Step2ConfirmButton")}
              </Button>
            </Grid>
            <Grid sx={{ ml: 2, mr: 4 }}>
              <Button
                color="error"
                onClick={() => cancelAddingShutter()}
                variant="contained"
              >
                {t("Step2CancelButton")}
              </Button>
            </Grid>
          </Grid>
          <SnackbarComponent />
        </>
      )}
      {currentStep === 2 && (
        <>
          {successfulEnd ? (
            <>
              <Typography variant="h5">{t("FinalStepCongrats")}</Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1">
                {t("FinalStepSuccessfulInstructions")}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h5">{t("FinalStepFailedTitle")}</Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1">
                {t("FinalStepFailedInstructions1")}
              </Typography>
              <Typography variant="body1">
                {t("FinalStepFailedInstructions2")}
              </Typography>
              <Typography variant="body1">
                {t("FinalStepFailedInstructions3")}
              </Typography>
            </>
          )}
          <Grid container justifyContent="center">
            <Grid>
              <Button onClick={() => navigate("/")} variant="contained">
                {t("ButtonHome")}
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </GeneralLayout>
  );
};
