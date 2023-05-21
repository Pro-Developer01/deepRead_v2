import React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import { Link } from "react-router-dom";
const cardStyle = {
    border: "1px solid var(--borderColors)",
    padding: "10px",
    borderRadius: "var(--cardBorderRadius)",
    width: "217px",
    background: "var(--white)",
};
const cardSpanStyle = {
    marginBottom: "8px",
    display: "block",
    fontWeight: 600,
    color: "var(--fontColor)",
};
const cardChipStyle = {
    width: "126px",
    justifyContent: "flex-start",
    gap: "10px",
    paddingLeft: "12px",
    cursor: "pointer",
};
const SuggestedViews = [
    { label: "Feed", icon: <DynamicFeedIcon />, url: "feedview" },
    { label: "List", icon: <FormatListBulletedIcon />, url: "listview" },
    { label: "Tiles", icon: <GridViewIcon />, url: "tileview" },
];

export default function SuggestedView({ bookId, userId, bookName }) {
    return (
        <div style={cardStyle}>
            <span style={cardSpanStyle}>Suggested View</span>
            <Stack direction="column" spacing={1} alignItems="flex-start">
                {SuggestedViews.map((item) => {
                    return (
                        <Link
                            to={`/library/${bookName + "/" + item.url}`}
                            state={{ bookId: bookId, userId }}
                        >
                            {" "}
                            <Chip
                                sx={cardChipStyle}
                                icon={item.icon}
                                label={item.label}
                                onClick={() => { }}
                            />
                        </Link>
                    );
                })}
            </Stack>
        </div>
    );
}
