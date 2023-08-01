import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export const accordianBorder = {
  borderTop: "1px solid var(--borderColors)",
  color: "var(--fontColor)",
};
export const MenuItemStyles = {
  margin: "5px 1px",
  borderRadius: "30px",
};
export const headingStyle = {
  marginLeft: -2, // Set left margin to zero
};
export const iconStyling = {
  color: "#FF6600",
  width: 22,
  height: 22,
};
export const accordianDetailStyling = {
  padding: 0,
};
export const anchorIconStyle = {
  backgroundColor: "var(--primaryColor)",
  borderRadius: "33px",
  color: "white",
  width: 20,
  height: 20,
  padding: "2px",
};
export const MyNotesTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& .MuiInputBase": {
    padding: 0,
  },
  "& .MuiInputBase-input": {
    fontFamily: "Gaegu, cursive",
    fontSize: "21px",
    fontWeight: 600,
  },
  "& .MuiInput-underline:after": {
    border: "none",
  },
  "& .MuiInput-underline:before": {
    border: "none",
  },
  "& .MuiInput-underline:hover:before": {
    border: "none !important",
  },
}));
