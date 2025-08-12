import { Divider, Typography } from "@mui/material";
import React from "react";

export interface TitleComponentProps {
  title: string;
}

export const TitleComponent: React.FC<TitleComponentProps> = (props) => {
  return (
    <>
      <Typography variant="h5">{props.title}</Typography>
      <Divider sx={{ mb: 3 }} />
    </>
  );
};
