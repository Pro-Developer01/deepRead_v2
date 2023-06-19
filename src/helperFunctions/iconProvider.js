import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import {
    DynamicFeedOutlined,
    LibraryBooksOutlined,
    TagOutlined,
    LightbulbOutlined,
} from "@mui/icons-material";
import Identify_White from '../Assets/Identify_White';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
export const iconProvider = (iconName) => {
    switch (iconName) {
        case "DynamicFeedOutlined":
            return <DynamicFeedOutlined sx={{ strokeWidth: '1px' }} />;
        case "LibraryBooksOutlined":
            return <LibraryBooksOutlined />;
        case "TagOutlined":
            return <TagOutlined />;
        case "LightbulbOutlined":
            return <LightbulbOutlined />;
        case "FormatListBulletedOutlined":
            return <FormatListBulletedOutlinedIcon />;
        case "GridViewOutlined":
            return <GridViewOutlinedIcon />;
        case "AccountTreeOutlined":
            return <AccountTreeOutlinedIcon />;
        case "HubOutlined":
            return <HubOutlinedIcon />;
        case "TipsAndUpdatesOutlined":
            return <TipsAndUpdatesOutlinedIcon />;
        case "MenuRounded":
            return <MenuRoundedIcon />;
        case "Identify_White":
            return <Identify_White />;


        case "Playlist_Add":
            return <PlaylistAddRoundedIcon />;

        //Keywords+ideacar+highlights
        case "highlights":
            return <StopRoundedIcon />;
        case "ideaCards":
            return <LightbulbOutlinedIcon />;
        case "KEYWORDS":
            return <VpnKeyRoundedIcon />;
        case "MAIN CLAIMS":
            return <KeyboardDoubleArrowRightRoundedIcon />;
        case "QUOTES":
            return <KeyboardDoubleArrowRightRoundedIcon />;
        case "EXAMPLES":
            return <ForumRoundedIcon />;
        case "ACTIONS ITEMS":
            return <CampaignRoundedIcon />;
        case "CUSTOM":
            return <SettingsRoundedIcon />;
        default:
            return null; // Return null or a default icon component if the icon name is not recognized
    }
};
