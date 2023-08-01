import { styled, css } from "@mui/material/styles";

export const CardBook = styled("div")(
  ({ theme }) =>
    css`
      border: 1px solid var(--borderColors);
      // padding: 7px;
      border-radius: 12px;
      background-color: var(--cardBackgraoundColor);
      position: sticky;
      top: 62px;
      z-index: 10;
    `
);

export const CardBookImg = styled("img")(
  ({ theme }) =>
    css`
      width: 54px;
      height: 50px;
      object-fit: cover;
      object-position: center;
      border-radius: 5px;
    `
);

export const CardBookContent = styled("div")(
  ({ theme }) =>
    css`
      padding: 5px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    `
);

export const CardBookTitle = styled("h4")(
  ({ theme }) =>
    css`
      // font-size: 15px;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    `
);

export const CardBookAuthor = styled("span")(({ theme }) => css``);

export const CardBookRating = styled("div")(
  ({ theme }) =>
    css`
      margin: 5px 0 20px 0;
      display: flex;
      width: 100%;
      justify-content: space-between;
      padding-left: 5px;
      padding-right: 5px;
      align-items: center;
    `
);

export const CardBookRatingImg = styled("img")(
  ({ theme }) =>
    css`
      height: 1.45em;
      width: 6.7em;
      filter: invert(49%) sepia(63%) saturate(4753%) hue-rotate(2deg)
        brightness(106%) contrast(103%);
    `
);

export const CardBookGridOne = styled("div")(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
  `
);

export const CardBookGridTwo = styled("div")(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    padding: 5px;
  `
);
export const CardBookGridThree = styled("div")(
  ({ theme }) => css`
    min-width: 400px;
    display: flex;
    align-items: center;
    padding: 5px;
  `
);

export const CardBookTags = styled("ul")(
  ({ theme }) =>
    css`
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      width: 100%;
      height: auto;
    `
);

export const CardBookTagItem = styled("li")(
  ({ theme }) => css`
    list-style: none;
    margin-right: 0.7em;
    margin-bottom: 0.5em;
    padding: 0.3em 1em;
    border-radius: 0.3em;
    font-size: 0.8em;
    background-color: rgb(235, 235, 235);
  `
);

export const CardBookProgress = styled("div")(
  ({ theme }) =>
    css`
      text-align: center;
      width: 100%;
    `
);

export const CardBookReadProgress = styled("ul")(
  ({ theme }) => css`
    padding: 0;
    list-style: none;
    width: 100%;
  `
);

export const CardBookProgressTitle = styled("div")(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.65em;
    width: 100%;
    align-items: center;

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    div a {
      font-size: 0.8em;
      color: grey;
    }
  `
);

export const CardBookProgressIcons = styled("div")(
  ({ theme }) => css`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;

    a {
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    a:nth-child(1)::after {
      /* margin-left: 2em; */
      content: "";
      display: block;
      background-image: var(--afterColor, grey);
      width: 75%;
      height: 3px;
      position: absolute;
      left: 3.2em;
      top: 39%;
      z-index: -1;
    }
  `
);

export const CardBookProgressIconsAnchor = styled("a")(
  ({ theme }) => css`
    width: 20%;
  `
);

export const CardBookProgressIconsImg = styled("img")(
  ({ theme }) => css`
    display: block;
    position: relative;
  `
);

export const CardBookProgressPercentage = styled("div")(
  ({ theme }) =>
    css`
      display: flex;
      justify-content: space-between;
      width: 100%;
      text-align: center;
      p {
        font-size: 0.6em;
        font-weight: bold;
        margin-top: 0.7em;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
    `
);
