import axios from "axios";

import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import { store } from "../Utils/Store/Store";

const labelIconStyleInitial = {
  backgroundColor: "var(--primaryColor)",
  borderRadius: "33px",
  color: "white",
  padding: "3px",
};
export const fetchIdeacardIcons = () => {
  const apiRoot = process.env.REACT_APP_API_URL;
  const { token } = store.getState().auth;
  axios
    .get(`${apiRoot}/api/idea-label/index`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      localStorage.setItem("ideacardIcons", JSON.stringify(res.data.data));
    })
    .catch((err) => {
      console.log("err", err);
    });
};
export const dynamicBulletHandler = (
  option,
  fontSizeRequested,
  iconStyleRequested
) => {
  const fontSize = fontSizeRequested || "large";
  let labelIconStyle = labelIconStyleInitial;
  if (iconStyleRequested) {
    labelIconStyle = iconStyleRequested;
  }
  switch (option) {
    case "KEYWORDS":
      return <VpnKeyRoundedIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "MAIN CLAIMS":
      return (
        <KeyboardDoubleArrowRightRoundedIcon
          fontSize={fontSize}
          sx={labelIconStyle}
        />
      );
    case "QUOTES":
      return <FormatQuoteRoundedIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "EXAMPLES":
      return <ForumRoundedIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "ACTIONS ITEMS":
      return <CampaignRoundedIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "custom1":
      return <SettingsRoundedIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "custom2":
      return <SettingsRoundedIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "custom3":
      return <SettingsRoundedIcon fontSize={fontSize} sx={labelIconStyle} />;
  }
};

export const getIdeacardIcons = (
  label_id,
  fontSize = "small",
  fontStyle = labelIconStyleInitial
) => {
  const allIcons = JSON.parse(localStorage.getItem("ideacardIcons"));
  if (!label_id) {
    label_id = allIcons[0]._id;
  }
  if (allIcons) {
    const filteredIcon = allIcons.filter((item) => item._id === label_id);
    if (filteredIcon && filteredIcon[0]) {
      return dynamicBulletHandler(filteredIcon[0].label, fontSize, fontStyle);
    }
  }
};
export const getLabelId = (keyword = "KEYWORDS") => {
  const allIcons = JSON.parse(localStorage.getItem("ideacardIcons"));
  // console.log("keyword", keyword);

  if (allIcons) {
    const filteredLabelId = allIcons.filter((item) => item.label === keyword);
    // console.log("filteredLabelId", filteredLabelId);
    if (filteredLabelId) {
      return filteredLabelId[0]._id;
    }
  }
};
export default fetchIdeacardIcons;
