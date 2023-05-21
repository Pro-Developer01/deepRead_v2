import axios from "axios";
import { apiRoot } from "./apiRoot";
import VpnKeySharpIcon from "@mui/icons-material/VpnKeySharp";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import SettingsIcon from "@mui/icons-material/Settings";
import CampaignIcon from "@mui/icons-material/Campaign";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

const labelIconStyleInitial = {
  backgroundColor: "var(--primaryColor)",
  borderRadius: "33px",
  color: "white",
  padding: "3px",
};
const fetchIdeacardIcons = () => {
  const token = localStorage.getItem("token");
  axios
    .get(`${apiRoot.endpoint}/api/idea-label/index`, {
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
      return <VpnKeySharpIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "MAIN CLAIMS":
      return (
        <KeyboardDoubleArrowRightIcon fontSize={fontSize} sx={labelIconStyle} />
      );
    case "QUOTES":
      return <FormatQuoteIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "EXAMPLES":
      return <HistoryEduIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "ACTIONS ITEMS":
      return <CampaignIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "custom1":
      return <SettingsIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "custom2":
      return <SettingsIcon fontSize={fontSize} sx={labelIconStyle} />;
    case "custom3":
      return <SettingsIcon fontSize={fontSize} sx={labelIconStyle} />;
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
