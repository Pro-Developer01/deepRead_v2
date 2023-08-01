import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const apiRoot = apiUrl + "/api";
const getHeaders = (token) => {
  return {
    headers: {
      authorization: token,
    },
  };
};

export const LoadingStatus = {
  Loading: "loading",
  Success: "success",
  Failed: "failed",
};

export const fetchLibrary = createAsyncThunk(
  "library/fetchBooks",
  async (dummy, thunkAPI) => {
    const userId = thunkAPI.getState().auth.userId;
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(
      `${apiRoot}/library/fetch/progress?user_id=${userId}`,
      getHeaders(token)
    );
    return response.data.data;
  }
);

export const fetchBook = createAsyncThunk(
  "library/fetchBook",
  async (bookId, thunkAPI) => {
    const userId = thunkAPI.getState().auth.userId;
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(
      `${apiRoot}/library/fetch/progress?book_id=${bookId}&user_id=${userId}`,
      getHeaders(token)
    );
    return response.data.data;
  }
);

export const fetchListViewData = createAsyncThunk(
  "library/fetchListViewData",

  async (bookId, thunkAPI) => {
    const userId = thunkAPI.getState().auth.userId;
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(
      `${apiRoot}/content/highlights?user_id=${userId}&book_id=${bookId}`,
      getHeaders(token)
    );
    const responseIdeas = await axios.get(
      `${apiRoot}/ideas/index?user_id=${userId}&book_id=${bookId}`,
      getHeaders(token)
    );
    return {
      highlights: response.data.data[0],
      ideas: responseIdeas.data.data,
    };
  }
);

export const updateBook = createAsyncThunk(
  "library/updateBook",
  async ({ bookId, newData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    await axios.put(
      `${apiRoot}/library/update?book_id=${bookId}`,
      newData,
      getHeaders(token)
    );
    return { bookId, newData };
  }
);
export const updateIdeaCard = createAsyncThunk(
  "library/updateIdeaCard",
  async ({ ideaCardId, newData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    axios.put(
      `${apiRoot}/ideas/update?_id=${ideaCardId}`,
      newData,
      getHeaders(token)
    );
    return { ideaCardId, newData };
  }
);
export const updateIdeaCardLabel = createAsyncThunk(
  "library/updateIdeaCardLabel",
  async ({ ideaCardId, newData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    axios.put(
      `${apiRoot}/ideas/update_label_type?_id=${ideaCardId}`,
      newData,
      getHeaders(token)
    );
    return { ideaCardId, newData };
  }
);

export const addIdeaCard = createAsyncThunk(
  "library/addIdeaCard",
  async ({ data }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.post(
      `${apiRoot}/ideas/store`,
      data,
      getHeaders(token)
    );

    return {
      newId: response.data.data,
      data: data,
    };
  }
);

// TODO: test after backend changed
export const deleteIdeaCard = createAsyncThunk(
  "library/deleteIdeaCard",
  async ({ ideaCardId }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    axios.delete(
      `${apiRoot}/ideas/delete/one?id=${ideaCardId}`,
      getHeaders(token)
    );

    return ideaCardId;
  }
);

export const updateIdeaCardRelation = createAsyncThunk(
  "library/updateIdeaCardRelation",
  async ({ ideaCardId, newData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    axios.put(
      `${apiRoot}/ideas/update/idea-relation?_id=${ideaCardId}`,
      newData,
      getHeaders(token)
    );
    return { ideaCardId, newData };
  }
);

export const updateLinkedHighlights = createAsyncThunk(
  "library/updateLinkedHighlights",
  async ({ ideaCardId, newData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    axios.put(
      `${apiRoot}/ideas/update/linked-highlights?_id=${ideaCardId}`,
      newData,
      getHeaders(token)
    );
    return { ideaCardId, newData };
  }
);

export const librarySlice = createSlice({
  name: "librarySlice",
  initialState: {
    libraryData: null,
    libraryStatus: null,
    libraryError: null,
    currentBookIndex: null,
    currentIdeaCardId: null,
    listViewData: null,
    viewStatus: null,
    viewError: null,
    ideaCards: null,
  },
  reducers: {
    reset: (state) => {
      state.libraryData = null;
      state.libraryStatus = null;
      state.libraryError = null;
      state.currentBookIndex = null;
      state.currentIdeaCardId = null;
      state.listViewData = null;
      state.viewStatus = null;
      state.viewError = null;
      state.ideaCards = null;
    },
    resetViewData: (state) => {
      state.currentIdeaCardId = null;
      state.listViewData = null;
      state.viewStatus = null;
      state.viewError = null;
      state.ideaCards = null;
    },
    selectBook: (state, action) => {
      state.currentBookIndex = action.payload;
      state.currentIdeaCardId = null;
      state.listViewData = null;
      state.ideaCards = null;
    },
    selectIdeaCard: (state, action) => {
      state.currentIdeaCardId = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLibrary.pending, (state, action) => {
        state.libraryStatus = LoadingStatus.Loading;
      })
      .addCase(fetchLibrary.fulfilled, (state, action) => {
        state.libraryData = action.payload;
        state.libraryStatus = LoadingStatus.Success;
      })
      .addCase(fetchLibrary.rejected, (state, action) => {
        state.libraryStatus = LoadingStatus.Failed;
        state.libraryError = action.error.message;
      })
      .addCase(fetchBook.pending, (state, action) => {})
      .addCase(fetchBook.fulfilled, (state, action) => {
        const book = action.payload[0];
        if (book) {
          const bookIndex = getBookIndexById(state, book._id);
          if (bookIndex !== null) {
            state.libraryData[bookIndex] = book;
          }
        }
      })
      .addCase(fetchBook.rejected, (state, action) => {
        console.log("fetch book failed", action.error.message);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const bookIndex = getBookIndexById(state, action.payload.bookId);
        const book = getBookByIndex(state, bookIndex);

        if (book) {
          state.libraryData[bookIndex] = { ...book, ...action.payload.newData };
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        alert("error updating book");
      })
      .addCase(fetchListViewData.pending, (state, action) => {
        state.viewStatus = LoadingStatus.Loading;
      })
      .addCase(fetchListViewData.fulfilled, (state, action) => {
        state.listViewData = action.payload.highlights;
        state.ideaCards = action.payload.ideas;
        state.viewStatus = LoadingStatus.Success;
      })
      .addCase(fetchListViewData.rejected, (state, action) => {
        state.viewStatus = LoadingStatus.Failed;
        state.viewError = action.error.message;
      })
      .addCase(updateIdeaCard.fulfilled, (state, action) => {
        const ideaCardIndex = getIdeaCardIndexById(
          state,
          action.payload.ideaCardId
        );
        const ideaCard = getIdeaCardById(state, action.payload.ideaCardId);

        if (ideaCard) {
          state.ideaCards[ideaCardIndex] = {
            ...ideaCard,
            ...action.payload.newData,
          };
        }
      })
      .addCase(updateIdeaCard.rejected, (state, action) => {
        alert("error updating ideacard");
      })
      .addCase(updateIdeaCardLabel.fulfilled, (state, action) => {
        const ideaCardIndex = getIdeaCardIndexById(
          state,
          action.payload.ideaCardId
        );
        const ideaCard = getIdeaCardById(state, action.payload.ideaCardId);

        if (ideaCard) {
          state.ideaCards[ideaCardIndex] = {
            ...ideaCard,
            ...action.payload.newData,
          };
        }
      })
      .addCase(updateIdeaCardLabel.rejected, (state, action) => {
        alert("error updating ideacard label");
      })
      .addCase(addIdeaCard.fulfilled, (state, action) => {
        if (action.payload.newId) {
          const addIdeaCardToListViewData = (item, newCard) => {
            item.entries?.forEach((entry, i) => {
              addIdeaCardToListViewData(entry, newCard);
            });
            item.highlights?.forEach((highlight, i) => {
              if (highlight._id === newCard.highlight_id) {
                highlight.idea_cards.push(newCard);
              }
            });
          };

          let newData = { ...action.payload.data };
          newData._id = action.payload.newId;

          if (!state.ideaCards) {
            state.ideaCards = [];
          }
          state.ideaCards.push(newData);
          state.currentIdeaCardId = action.payload.newId;

          if (state.listViewData) {
            state.listViewData.data.forEach((entry, i) => {
              addIdeaCardToListViewData(entry, newData);
            });
          }

          updateIdeaCardCountForCurrentBook(state, 1);
        }
      })
      .addCase(addIdeaCard.rejected, (state, action) => {
        console.log("error adding ideacard", action.error);
        state.currentIdeaCardId = null;
      })

      .addCase(deleteIdeaCard.fulfilled, (state, action) => {
        const deleteIdeaCardFromListViewData = (item, deletedId) => {
          item.entries?.forEach((entry, i) => {
            deleteIdeaCardFromListViewData(entry, deletedId);
          });
          item.highlights?.forEach((highlight, i) => {
            const ideaCardToRemoveIndex = highlight.idea_cards.findIndex(
              (ideacard) => ideacard._id === deletedId
            );
            if (ideaCardToRemoveIndex > -1) {
              highlight.idea_cards.splice(ideaCardToRemoveIndex, 1);
            }
          });
        };

        const deletedId = action.payload;
        state.ideaCards = state.ideaCards.filter((ideacard) => {
          return ideacard._id !== deletedId;
        });

        if (state.listViewData) {
          state.listViewData.data.forEach((entry, i) => {
            deleteIdeaCardFromListViewData(entry, deletedId);
          });
        }
        state.currentIdeaCardId = null;

        updateIdeaCardCountForCurrentBook(state, -1);
      })
      .addCase(deleteIdeaCard.rejected, (state, action) => {
        console.log("error removing ideacard", action.error);
      })
      .addCase(updateIdeaCardRelation.fulfilled, (state, action) => {
        const ideaCardIndex = getIdeaCardIndexById(
          state,
          action.payload.ideaCardId
        );
        const ideaCard = getIdeaCardById(state, action.payload.ideaCardId);

        if (ideaCard) {
          state.ideaCards[ideaCardIndex] = {
            ...ideaCard,
            ...action.payload.newData,
          };
        }
      })
      .addCase(updateIdeaCardRelation.rejected, (state, action) => {
        alert("error updating ideacard relation");
      })
      .addCase(updateLinkedHighlights.fulfilled, (state, action) => {
        const ideaCardIndex = getIdeaCardIndexById(
          state,
          action.payload.ideaCardId
        );
        const ideaCard = getIdeaCardById(state, action.payload.ideaCardId);

        if (ideaCard) {
          state.ideaCards[ideaCardIndex] = {
            ...ideaCard,
            ...action.payload.newData,
          };
        }
      })
      .addCase(updateLinkedHighlights.rejected, (state, action) => {
        alert("error updating ideacard relation");
      });
  },
});

export const { selectBook, selectIdeaCard, reset, resetViewData } =
  librarySlice.actions;
export default librarySlice.reducer;

const updateIdeaCardCountForCurrentBook = (state, changeAmount) => {
  const book = getBookByIndex(state, state.currentBookIndex);

  if (book) {
    state.libraryData[state.currentBookIndex] = {
      ...book,
      i_progress: book.i_progress + changeAmount,
    };
  }
};

export const getCurrentBook = (state) => {
  return getBookByIndex(state, state.library.currentBookIndex);
};
export const getCurrentIdeaCard = (state) => {
  return getIdeaCardById(state, state.library.currentIdeaCardId);
};
export const getCurrentIdeaCardId = (state) => {
  return state.library.currentIdeaCardId;
};

export const getBookByIndex = (state, bookIndex) => {
  if (bookIndex !== null) {
    if (state.library) return state.library.libraryData[bookIndex];
    if (state.libraryData) return state.libraryData[bookIndex];
  } else {
    return null;
  }
};
export const getBookIndexById = (state, bookId) => {
  const libraryData = state.libraryData
    ? state.libraryData
    : state.library.libraryData;
  const bookIndex = libraryData?.findIndex((book) => {
    return book._id === bookId;
  });
  return bookIndex;
};
export const getBookById = (state, bookId) => {
  const libraryData = state.libraryData
    ? state.libraryData
    : state.library.libraryData;
  const bookIndex = getBookIndexById(state, bookId);
  if (bookIndex !== null) {
    return libraryData[bookIndex];
  } else {
    return null;
  }
};
export const getIdeaCardIndexById = (state, ideaCardId) => {
  const ideaCards = state.ideaCards
    ? state.ideaCards
    : state.library?.ideaCards;
  const ideaCardIndex = ideaCards?.findIndex((ideaCard) => {
    return ideaCard._id === ideaCardId;
  });
  return ideaCardIndex;
};

export const getIdeaCardById = (state, ideaCardId) => {
  const ideaCardIndex = getIdeaCardIndexById(state, ideaCardId);
  const ideaCards = state.ideaCards
    ? state.ideaCards
    : state.library?.ideaCards;
  if (ideaCardIndex !== null && ideaCards) {
    return ideaCards[ideaCardIndex];
  } else {
    return null;
  }
};
