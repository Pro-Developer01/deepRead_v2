import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

export const Loading = () => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ height: "100vh" }}
    >
      <CircularProgress sx={{ color: "var(--primaryColor)" }} />
    </Stack>
  );
};
