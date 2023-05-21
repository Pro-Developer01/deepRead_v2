import React from 'react'
import MyLibrary from '../MyLibrary/MyLibrary'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IdeaCardPage from '../IdeacardPage/IdeaCardPage';
import ListView from '../ListView/ListView';
import TileView from '../TileView/TileView';
import FeedView from '../FeedView/FeedView';
import BookView from '../bookView/BookView';

export default function DashBoard() {
  return (
    <div style={{ width: '100%' }} id='dashboard' >
      <Routes>
        <Route path="/library" element={<MyLibrary />} />
        {/* <Route path="/ideacard" element={<IdeaCardPage />} /> */}

        <Route path="/library/:bookName" element={<BookView />} />
        <Route path="/library/:bookName/listview" element={<ListView />} />
        <Route path="/library/:bookName/feedview" element={<FeedView />} />
        <Route path="/library/:bookName/tileview" element={<TileView />} />
      </Routes>
    </div>
  )
}
