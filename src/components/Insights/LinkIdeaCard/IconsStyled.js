import { styled } from "@mui/material/styles";

import UpgradeIcon from "@mui/icons-material/Upgrade";
import HeightIcon from "@mui/icons-material/Height";
import VpnKeySharpIcon from "@mui/icons-material/VpnKeySharp";

export const ParentLinkIcon = styled(UpgradeIcon)(() => ({
  backgroundColor: "grey",
  borderRadius: "33px",
  color: "white",
  width: 19,
  height: 19,
}));

export const ChildLinkIcon = styled(UpgradeIcon)(() => ({
  backgroundColor: "grey",
  borderRadius: "33px",
  color: "white",
  width: 19,
  height: 19,
  transform: "rotateZ(180deg)",
}));

export const NeutralLinkIcon = styled(HeightIcon)(() => ({
  backgroundColor: "grey",
  borderRadius: "33px",
  color: "white",
  width: 19,
  height: 19,
  transform: "rotateZ(90deg)",
}));

export const IdeaCardIcon = styled(VpnKeySharpIcon)(
  ({ fontSize = "small" }) => ({
    backgroundColor: "#FF6600",
    borderRadius: "33px",
    color: "white",
    width: 19,
    height: 19,
    padding: "3px",
  })
);
