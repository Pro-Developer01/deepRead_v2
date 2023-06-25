import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useDispatch, useSelector } from "react-redux";
import { updateBreadcumArray } from "../../Utils/Features/breadcumSlice";
import Menu from "@mui/material/Menu";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { iconProvider } from "../../helperFunctions/iconProvider";

const breadcrumbStyle = {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    position: "sticky",
    top: "0",
    zIndex: ["10px", 3],
    background: "var(--BackgroundColor)",
    padding: "16px 0",
    zIndex: "10",
    borderRadius: "2px",
};
const dropdownChipStyle = {
    width: "6.9rem",
    justifyContent: "flex-start",
    fontWeight: 600,
    textTransform: "capitalize",
    // gap: "10px",dww
    paddingLeft: "2px",
    cursor: "pointer",
    background: "var(--borderColors)",
};
const cardChipStyle = {
    justifyContent: "flex-start",
    fontWeight: 600,
    textTransform: "capitalize",
    // gap: "10px",dww
    paddingLeft: "2px",
    cursor: "pointer",
    background: "var(--borderColors)",
    fontSize: "var(--fontSizeRegular)",

};

let breadcrumbMenuItems = [
    { label: "List view", icon: <FormatListBulletedIcon />, href: "listview" },
    { label: "Tile view", icon: <GridViewIcon />, href: "tileview" },
    { label: "Feed view", icon: <DynamicFeedIcon />, href: "feedview" },
    { label: "Tree view", icon: iconProvider('AccountTreeOutlined'), href: "treeview" },
    { label: "Nodes view", icon: iconProvider('HubOutlined'), href: "nodeview" },
];

export default function Breadcum({ state }) {
    const [breadcrumbs, setBreadcrumbs] = React.useState([]);
    const [isMenuVisible, setIsMenuVisible] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(breadcrumbMenuItems[1]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const currentLocation = window.location.pathname;
    const breadcumArray = useSelector((state) => state.breadcumReducer.value);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const dispatch = useDispatch();

    const renderMenu = (viewType) => {
        setIsMenuVisible(true);
        const modifiedBreadcrum = breadcrumbMenuItems.map((item) => {
            if (item.href === viewType) {
                return { ...item, activeNow: true };
            } else {
                return { ...item, activeNow: false };
            }
        });
        breadcrumbMenuItems = modifiedBreadcrum;
        setSelectedItem(breadcrumbMenuItems.find((item) => item.href === viewType));
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelectChange = (index) => {
        const url = currentLocation.split("/");
        url[url.length - 1] = breadcrumbMenuItems[index].href;
        setSelectedItem(breadcrumbMenuItems[index]);
        navigate(url.join("/"), { state });
        setAnchorEl(null);
    };
    const getBreadcumIcon = (title) => {
        switch (title) {
            case "library":
                return <LibraryBooksIcon />;
            default:
                return <ImportContactsIcon />;
        }
    };
    const urlChecker = () => {
        const locationArray = currentLocation.split("/");
        let path = "";
        let resultedArray = [];
        for (let i = 1; i < locationArray.length; i++) {
            if (
                locationArray[i] === "listview" ||
                locationArray[i] === "tileview" ||
                locationArray[i] === "feedview"
            ) {
                renderMenu(locationArray[i]);
            } else {
                path += "/" + locationArray[i];
                let title = locationArray[i];
                let icon = getBreadcumIcon(locationArray[i]);
                if (locationArray[i].length > 15) {
                    title = title.slice(0, 15) + "...";
                }
                const LocationObj = {
                    path,
                    title: title,
                    icon,
                };
                resultedArray.push(LocationObj);
            }
        }
        dispatch(updateBreadcumArray(resultedArray));
    };

    const breadcumCreator = () => {
        const newBreadcumData = breadcumArray.map((item, index) => {
            return (
                <Chip
                    avatar={item.icon}
                    sx={cardChipStyle}
                    label={item.title}
                    onClick={(e) => handleClick(e, item.path, item.title)}
                />
            );
        });

        setBreadcrumbs(newBreadcumData);
    };
    function handleClick(event, path, title) {
        navigate(path);
        console.info(path, title);
    }
    useEffect(() => {
        urlChecker();
        console.info("currentLocation", currentLocation);
    }, [currentLocation]);
    useEffect(() => {
        breadcumCreator();
    }, [breadcumArray]);
    return (
        <div className="breadcumContainer" style={breadcrumbStyle}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
                {isMenuVisible && (
                    <Chip
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleMenuClick}
                        sx={cardChipStyle}
                        icon={selectedItem?.icon}
                        label={selectedItem?.label}
                    />
                )}
            </Breadcrumbs>
            <Menu
                elevation={0}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
                sx={{
                    "& .MuiPaper-root": {
                        background: "transparent",
                        "& .MuiMenuItem-root": {
                            paddingLeft: 0,
                            "&:hover": {
                                backgroundColor: "transparent",
                            },
                        },
                    },
                }}
            >
                {breadcrumbMenuItems.map((item, index) => {
                    return (
                        !item.activeNow && <MenuItem
                            sx={{ paddingTop: "0" }}
                            key={item.href + index}
                            value={index}
                            onClick={() => handleSelectChange(index)}
                        >
                            <Chip
                                sx={dropdownChipStyle}
                                icon={item.icon}
                                label={item.label}
                            />
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
}
