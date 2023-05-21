import React from 'react'
import './DrawerModal.css'
import Navigation from '../../pages/Navigation';
import SearchMenu from '../../pages/SearchMenu';
import ShowMenu from '../../pages/ShowMenu';
import Filter from '../../pages/Filter';
import Template from '../../pages/Template';

export default function DrawerModal({title, setTitle}) {
  const closeHandle=()=>{
    setTitle(null);
  }
  const NavigationHandler=(title)=>{
    switch(title) {
      case 'Navigate':
        // code block
        return <Navigation/> ;
      case 'Search':
        // code block
        return <SearchMenu/>;
      case 'Show':
        // code block
     return <ShowMenu/>;
      case 'Filter':
        // code block
        return <Filter/>;
      case 'Template':
        // code block
       return <Template/>;
      default:
        return <span>Please Select Proper tab</span>
    }
  }
  return (
    <div className='DrawerModalParent'>
      <div className="headingSection">
        <span id='heading'>{title}</span>
        <span class="material-symbols-outlined" onClick={closeHandle} style={{cursor:'pointer', color:'#717171'}}> close</span>
      </div>
      <div className="contentsection">
      {NavigationHandler(title)}

      </div>
    </div>
  )
}
