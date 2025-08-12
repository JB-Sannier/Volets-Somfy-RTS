import React, { useState } from "react";
import {
  UserRole,
  type IDeleteUserRequest,
  type IUserResponse,
} from "../../services/users-service.types";
import { deleteUser } from "../../services/users-service";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../snackbar-component";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface IUserComponentProps {
  user: IUserResponse;
  onUserModified: (user: IUserResponse) => void;
  onUserDeleted: (user: IUserResponse) => void;
}

export const UserComponent: React.FC<IUserComponentProps> = (props) => {
  const { setSnackbarProps, SnackbarComponent } = useSnackbar();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const navigate = useNavigate();

  async function modifyUser() {
    navigate(`/users-management/modify-user/${props.user.email}`);
  }

  function toRoleStrings(): string[] {
    const result: string[] = [];
    props.user.roles.forEach((role) => {
      if (role === UserRole.ShuttersProgrammer) {
        result.push("shutters programmer");
      } else if (role === UserRole.UserManager) {
        result.push("user manager");
      }
    });
    if (result.length === 0) {
      result.push("no role set");
    }
    return result;
  }

  async function confirmDeletion() {
    const request: IDeleteUserRequest = {
      email: props.user.email,
    };
    await deleteUser(request);
    setSnackbarProps({
      message: `The user ${props.user.email} has been deleted.`,
      severity: "success",
    });
    props.onUserDeleted(props.user);
  }

  return (
    <>
      <Card sx={{ mb: 3 }} raised>
        <CardHeader
          title={
            <>
              <PersonIcon />
              email: {props.user.email}
            </>
          }
        >
          <Typography variant="body1">
            <PersonIcon />
            Email: <b>{props.user.email}</b>
          </Typography>
        </CardHeader>
        <CardContent>
          <Typography variant="body1" sx={{ ml: 3 }}>
            Roles : <b>{toRoleStrings().join(", ")}</b>
          </Typography>
          <Typography
            variant="body1"
            sx={{ ml: 3 }}
            color={props.user.isActive ? "success" : "warning"}
          >
            {props.user.isActive ? (
              <>
                User is <b>active</b>
              </>
            ) : (
              <>
                User is <b>inactive</b>
              </>
            )}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={modifyUser} startIcon={<EditIcon />}>
            Modify User
          </Button>
          <Button
            onClick={() => setOpenModal(true)}
            color="warning"
            startIcon={<DeleteIcon />}
          >
            Delete user
          </Button>
        </CardActions>
      </Card>
      <SnackbarComponent />
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirm user deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user {props.user.email} ?
          </DialogContentText>
          <DialogActions>
            <Button onClick={confirmDeletion} color="warning">
              Yes, delete the user
            </Button>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Fab
        color="primary"
        sx={{ position: "absolute", bottom: 10, right: 5 }}
        onClick={() => navigate("/users-management/add-user")}
      >
        <AddIcon />
      </Fab>
    </>
  );
};
