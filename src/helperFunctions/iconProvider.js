import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
    DynamicFeedOutlined,
    LibraryBooksOutlined,
    TagOutlined,
    LightbulbOutlined,
} from "@mui/icons-material";
import Identify_White from '../Assets/Identify_White';



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
        default:
            return null; // Return null or a default icon component if the icon name is not recognized
    }
};
