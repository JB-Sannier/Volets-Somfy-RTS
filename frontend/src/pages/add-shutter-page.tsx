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
import {
  addShutter,
  deleteShutter,
  listShutters,
} from "../services/shutters-service";
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
import { programShutter } from "../services/shutters-operations-service";
import { TitleComponent } from "../components/title-component";

const MSG_FILL_SHUTTER_NAME = "Please, fill a shutter name.";
const MSG_DUPLICATE_SHUTTER_NAME = "A shutter already exists with this name.";

export const AddShutterPage: React.FC = () => {
  const authContext = useAuthContext();
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
      callWithRemoteData(listShutters, undefined, (newRd) =>
        setListShuttersRD(newRd),
      );
    } else if (listShuttersRD.status === RemoteDataStatus.Loaded) {
      setAllShutters(listShuttersRD.payload);
    }
  }, [listShuttersRD]);

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [shutterName, setShutterName] = useState<string>("");
  const [shutterId, setShutterId] = useState<string | undefined>(undefined);
  const [errorText, setErrorText] = useState<string | undefined>(
    MSG_FILL_SHUTTER_NAME,
  );
  const [successfulEnd, setSuccessfulEnd] = useState<boolean | undefined>(
    undefined,
  );

  function onChangeShutterName(newValue: string) {
    setShutterName(newValue);
    for (const shutter of allShutters) {
      if (shutter.shutterName === newValue) {
        setErrorText(MSG_DUPLICATE_SHUTTER_NAME);
        return;
      }
    }
    if (newValue === "") {
      setErrorText(MSG_FILL_SHUTTER_NAME);
      return;
    }
    setErrorText(undefined);
  }

  async function addNewShutter() {
    try {
      const addShutterResponse = await addShutter({ shutterName });
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
        message:
          "An error occured while trying to create a shutter in the application.",
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
    programShutter({ shutterId });
    setSnackbarProps({
      message: "The program command has been sent.",
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
      await deleteShutter({ shutterId });
      setSnackbarProps({
        message: "The shutter has been deleted.",
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
        message: "An error occured while trying to delete the shutter...",
        severity: "error",
      });
    }
  }

  return (
    <GeneralLayout>
      <TitleComponent title="Add a shutter" />

      <Grid container justifyContent="center">
        <Grid sx={{ width: "50%", minWidth: "600px", maxWidth: "900px" }}>
          <Stepper activeStep={currentStep}>
            <Step key={1}>
              <StepLabel>Fill the shutter name</StepLabel>
            </Step>
            <Step key={2}>
              <StepLabel>Program the shutter name</StepLabel>
            </Step>
          </Stepper>
        </Grid>
      </Grid>
      {currentStep === 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Step 1 - Shutter name
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1">
            Before associating the shutter with the application, you need to
            fill the shutter name. Please, indicate which name you wish to use
            in the application :
          </Typography>
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            value={shutterName}
            onChange={(e) => onChangeShutterName(e.target.value)}
            error={errorText !== undefined}
            helperText={errorText}
            label="Shutter name:"
          />
          <Typography variant="body1">
            Once you are ready, add the shutter using the following button :
          </Typography>
          <Grid container justifyContent="center">
            <Grid>
              <Button
                disabled={errorText !== undefined || shutterId !== undefined}
                variant="contained"
                onClick={() => addNewShutter()}
              >
                Add shutter
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      {currentStep === 1 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Step 2 - Shutter programming
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1">
            Now, it's time to put your shutter into learning mode.
          </Typography>
          <Typography variant="body1">
            Using a physical remote, press the "Program" button during 3
            secondes.
          </Typography>
          <Typography variant="body1">
            The shutter should move down, then up. If so, press the program
            button below.
          </Typography>
          <Grid container justifyContent="center">
            <Grid sx={{ ml: 4, mr: 2, mt: 2 }}>
              <Button onClick={() => handleProgramEvent()} variant="contained">
                Send the Program Command
              </Button>
            </Grid>
          </Grid>
          <Typography variant="body1" sx={{ mt: 5, mb: 2 }}>
            Did the shutter move ? If not, you can retry the Program Command.
          </Typography>
          <Grid container justifyContent="center">
            <Grid sx={{ ml: 4, mr: 2 }}>
              <Button
                color="success"
                onClick={() => finalizeAddition()}
                variant="contained"
              >
                Yes, it moved !
              </Button>
            </Grid>
            <Grid sx={{ ml: 2, mr: 4 }}>
              <Button
                color="error"
                onClick={() => cancelAddingShutter()}
                variant="contained"
              >
                No, something is wrong. Cancel adding the shutter...
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
              <Typography variant="h5">Congrats !</Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1">
                Your shutter should now be ready to be used by this application.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h5">It sucks...</Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1">
                It seems something went wrong, while trying to associate your
                shutter with this application.
              </Typography>
              <Typography variant="body1">
                First, check if the transmitter is operational and can send
                instructions to your shutters.
              </Typography>
              <Typography variant="body1">
                Remember, this application only handles Somfy RTS shutters, not
                the IO shutters.
              </Typography>
            </>
          )}
          <Grid container justifyContent="center">
            <Grid>
              <Button onClick={() => navigate("/")} variant="contained">
                Home
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </GeneralLayout>
  );
};
