import { useState } from "react";

import { ImageList, ImageListItem } from "@mui/material";
import { TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import GoogleImages from "googleimg";

import "./GoogleImageSelect.css";
import { customLog } from "../../helperFunctions/customLogger";

export const GoogleImageSelect = ({ onImageSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(null);
  const imagesPerPage = 10;
  const numberOfPages = 10;
  const pageArray = [...Array(numberOfPages).keys()].map((i) => i + 1);

  const client = new GoogleImages(
    process.env.REACT_APP_GOOGLE_CSE_ID,
    process.env.REACT_APP_GOOGLE_API_KEY_FOR_CSE
  );

  const handleUpload = () => {
    customLog("TODO");
  };
  const handleSearch = () => {
    fetchPage(1);
    var searchDiv = document.getElementById("searchDiv");
    searchDiv.style.height = "500px";
  };
  const clearSearch = () => {
    setSearchQuery("");
    setResult([]);
    var searchDiv = document.getElementById("searchDiv");
    searchDiv.style.height = "70px";
  };
  const handleSelect = (imageLink) => {
    clearSearch();
    selectImage(imageLink);
  };
  const fetchPage = (page) => {
    if (page) {
      client
        .search(searchQuery, {
          page: page * imagesPerPage,
        })
        .then((images) => {
          setResult(images.map((image) => image.link));
          setPage(page);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const selectImage = (link) => {
    onImageSelect(link);
    setResult([]);
  };

  const selectPage = (pageIndex) => {
    fetchPage(pageIndex);
  };

  return (
    <div className="searchContainer" id="searchDiv">
      <div className="searchBar">
        <div className="uploadContainer">
          <IconButton onClick={handleUpload} style={{ color: "white" }}>
            <FileUploadOutlinedIcon />
          </IconButton>
        </div>
        <div className="searchField">
          <TextField
            fullWidth
            size="small"
            variant="standard"
            placeholder="Search Google Image"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <>
                  <IconButton edge="end" onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={clearSearch}>
                    <ClearIcon />
                  </IconButton>
                </>
              ),
            }}
          />
        </div>
      </div>
      {result?.length === 0 && (
        <div className="searchInfo">
          <span className="infoText">Search and select an Image</span>
        </div>
      )}
      {result?.length > 0 && (
        <ImageList
          sx={{
            marginTop: "12px",
            width: "100%",
            height: "100%",
          }}
          cols={3}
          rowHeight={164}
        >
          {result.map((imageLink) => (
            <ImageListItem key={imageLink}>
              <img
                src={`${imageLink}`}
                onClick={() => handleSelect(imageLink)}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      {result.length > 0 && (
        <div className="searchResult" style={{}}>
          {[...pageArray].map((pageIndex) => (
            <span
              style={{ color: pageIndex === page ? "blue" : "black" }}
              onClick={() => selectPage(pageIndex)}
              key={pageIndex}
            >
              &nbsp; {pageIndex}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
