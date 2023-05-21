import axios from "axios";
import { apiRoot } from "./apiRoot";

export const updateBook = (bookId, newData) => {
  console.log("updating book data: ", bookId, " -- ", newData);
  if (bookId && newData) {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${apiRoot.endpoint}/api/library/update?book_id=${bookId}`,
        newData,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        console.log("updateBook: success", res);
      })
      .catch((error) => {
        console.log("updateBook: ", error);
      });
  } else {
    console.log("updateBook: bookId or data missing");
  }
};

export const updateIdeaCard = (ideaCardId, newData) => {
  console.log("updating ideacard data: ", ideaCardId, " -- ", newData);
  if (ideaCardId && newData) {
    const token = localStorage.getItem("token");
    axios
      .put(`${apiRoot.endpoint}/api/ideas/update?_id=${ideaCardId}`, newData, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        console.log("updateIdeacard: success", res);
      })
      .catch((error) => {
        console.log("updateIdeacard: ", error);
      });
  } else {
    console.log("updateIdeacard: ideaCardId or data missing");
  }
};

export const fetchFullBookData = async (bookId) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const fullData = axios
    .get(
      `${apiRoot.endpoint}/api/library/metadata?title=&asin=&author=&book_id=${bookId}&user_id=${userId}`,
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => {
      console.log("full book data, ", res.data.data);
      return res.data.data;
    })
    .catch((err) => {
      console.log("error fetching full book data, ", err);
      return null;
    });
  return fullData;
};

export const fetchLibraryData = () => {
  const fetchPromise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    axios
      .get(`${apiRoot.endpoint}/api/library/fetch?user_id=${userId}`, {
        headers: {
          // 'Accept': 'application/json',
          // 'Content-Type': 'application/json',
          authorization: token,
        },
      })
      .then((res) => {
        console.log("fetch library data ", res.data.data);
        resolve(res.data.data);
      })
      .catch((err) => {
        console.log("error fetching library data", err);
        reject(err);
      });
  });
  return fetchPromise;
};

export const fetchAdjoiningHighlights = async (bookId, position, range = 3) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const fullData = axios
    .get(
      `${apiRoot.endpoint}/api/highlight/range?book_id=${bookId}&position=${position}&range=${range}`,
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => {
      console.log("adjoining higlights data, ", res.data.data);
      return res.data.data;
    })
    .catch((err) => {
      console.log("error fetching adjoining higlights data, ", err);
      return null;
    });
  return fullData;
};

export const updateLinkedHighlights = (ideaCardId, highlightsData) => {
  console.log(
    "updating linked highlights: ",
    ideaCardId,
    " -- ",
    highlightsData
  );
  if (ideaCardId && highlightsData) {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${apiRoot.endpoint}/api/ideas/update/linked-highlights?_id=${ideaCardId}`,
        highlightsData,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        console.log("updateLinkedHighlights: success", res);
      })
      .catch((error) => {
        console.log("updateLinkedHighlights: ", error);
      });
  } else {
    console.log("updateLinkedHighlights: ideaCardId or data missing");
  }
};

export const updateIdeaCardLabel = (ideaCardId, newData) => {
  console.log("updating ideacard label data: ", ideaCardId, " -- ", newData);
  if (ideaCardId && newData) {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${apiRoot.endpoint}/api/ideas/update_label_type?_id=${ideaCardId}`,
        newData,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        console.log("updateIdeaCardLabel: success", res);
      })
      .catch((error) => {
        console.log("updateIdeaCardLabel: ", error);
      });
  } else {
    console.log("updateIdeaCardLabel: ideaCardId or data missing");
  }
};

export const fetchIdeaCardData = async ({ cardId, title } = {}) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  let params = "";
  if (cardId) {
    params += "&_id=" + cardId;
  }
  if (title) {
    params += "&title=" + title;
  }
  const ideaCardData = axios
    .get(`${apiRoot.endpoint}/api/ideas/index?user_id=${userId}${params}`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      console.log("idea card data, ", res.data.data);
      return res.data.data;
    })
    .catch((err) => {
      console.log("error fetching idea card data, ", err);
      return null;
    });
  return ideaCardData;
};

export const updateIdeaCardRelation = (ideaCardId, newData) => {
  console.log("updating ideacard relation data: ", ideaCardId, " -- ", newData);
  if (ideaCardId && newData) {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${apiRoot.endpoint}/api/ideas/update/idea-relation?_id=${ideaCardId}`,
        newData,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        console.log("updateIdeaCardRelation: success", res);
      })
      .catch((error) => {
        console.log("updateIdeaCardRelation: ", error);
      });
  } else {
    console.log("updateIdeaCardRelation: ideaCardId or data missing");
  }
};
