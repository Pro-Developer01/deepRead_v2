import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useSelector, useDispatch } from 'react-redux'
import IdeaCardPage from "../../pages/IdeacardPage/IdeaCardPage";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { updateIdeacardData } from "../../Utils/Features/IdeacardSlice";
import CreateIdeaCardPage from "../../pages/CreateIdeaCardPage/CreateIdeaCardPage";
import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateIdentifyIdeaCardData } from "../../Utils/Features/IdentifyIdeaCardSlice";

const drawerWidth = 590;
const clossDoubleArrowStyle = {
    background: "var(--white)",
    borderRadius: "33px",
    border: "1px solid var(--borderColors)",
    position: "fixed",
    top: "38px",
    right: "34.8rem",
    cursor: "pointer",
    color: "var(--fontColor)",
};
const closeCrossButtonStyle = {
    borderRadius: "33px",
    position: "fixed",
    top: "71px",
    right: "12px",
    zIndex: 13,
    cursor: "pointer",
    color: "var(--fontColor)",
};
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: "10",
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        }),
    })
);

export default function PersistentDrawerRight({ open, resizableWidth, childrenx }) {
    const theme = useTheme();
    // const [open, setOpen] = React.useState(false);
    const ideacardData = useSelector((state) => state.ideacardReducer.value)
    const dataType = useSelector((state) => state.persistentDrawerReducer.value)
    const dispatch = useDispatch();
    const dataTypeChangeHandler = () => {
        if (dataType) {
            if (dataType === 'ideaCard') {
                return <IdeaCardPage />

            }
            else if (dataType === 'identify Ideacard') {
                return <CreateIdeaCardPage />
            }
        }
    }
    const handleDrawerClose = () => {
        if (dataType === 'ideaCard') {
            dispatch(updateIdeacardData(null))
        }
        else if (dataType === 'identify Ideacard') {
            dispatch(updateIdentifyIdeaCardData(null))
        }
        dispatch(updatePersistentDrawer(null))
    };

    return (
        <Box sx={{
            display: "flex", height: '100%', width: open ? "100%" : (resizableWidth ? resizableWidth + 'px' : '48%'),

        }}>
            <Main open={dataType}>{childrenx}</Main>
            <Drawer
                sx={{
                    width: 573,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        background: "transparent",
                        border: "none",
                        top: '64px',
                    },
                }}
                variant="persistent"
                anchor="right"
                open={dataType}
            >
                <KeyboardDoubleArrowRightIcon
                    fontSize="medium"
                    style={clossDoubleArrowStyle}
                    onClick={handleDrawerClose}
                />
                <CloseIcon
                    fontSize="medium"
                    style={closeCrossButtonStyle}
                    onClick={handleDrawerClose}
                />
                {dataTypeChangeHandler()}
            </Drawer>
        </Box>
    );
}
