import React, { useState, useRef } from 'react';
import DragIndicatorOutlinedIcon from '@material-ui/icons/DragIndicatorOutlined';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';


const Notes = () => {
  const [notes, setNotes] = useState(['']);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const textareaRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notePopupVisible, setNotePopupVisible] = useState(false); // New state for note popup visibility
  const [notePopupText, setNotePopupText] = useState(''); // New state for note popup text


  const handleNoteChange = (index, event) => {
    const { value, selectionStart, selectionEnd } = event.target;

    if (event.key === 'Enter' && value.trim() !== '') {
      event.preventDefault(); // Prevent the default behavior of moving to the next line

      const newNotes = [...notes];
      const beforeCursor = value.substring(0, selectionStart);
      const afterCursor = value.substring(selectionEnd);

      if (beforeCursor.trim() === '') {
        newNotes.splice(index + 1, 0, afterCursor);
      } else {
        const lines = beforeCursor.split('\n');
        const lastLine = lines[lines.length - 1];
        const leadingSpaces = lastLine.match(/^\s*/)[0]; // Match any whitespace characters
        newNotes.splice(index + 1, 0, leadingSpaces + afterCursor);
      }

      setNotes(newNotes);
      setTimeout(() => {
        const nextIndex = index + 1;
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          textarea.selectionStart = 0; // Set the cursor at the beginning of the textarea
          textarea.selectionEnd = 0;
        }
      }, 0);
    } else {
      const newNotes = [...notes];
      newNotes[index] = value;
      setNotes(newNotes);
    }

    adjustTextareaHeight();
  };





  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };



  const handleDragStart = (index, event) => {
    event.dataTransfer.setData('text/plain', index);
    setNotePopupVisible(false);
  };

  const handleDrop = (targetIndex, event) => {
    const sourceIndex = event.dataTransfer.getData('text/plain');
    const newNotes = [...notes];
    const [removed] = newNotes.splice(sourceIndex, 1);
    newNotes.splice(targetIndex, 0, removed);
    setNotes(newNotes);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = notes.map((note) => {
      const regex = new RegExp(searchTerm, 'gi');
      const match = note.match(regex);
      return match ? note.replace(regex, `<mark>${match[0]}</mark>`) : note;
    });

    setSearchResults(results);
  };

  const [hoveredRow, setHoveredRow] = useState(null);

  const handleMouseEnter = (rowIndex) => {
    setHoveredRow(rowIndex);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleDraggerMouseEnter = () => {
    setNotePopupVisible(true);
  };

  const handleDraggerMouseLeave = () => {
    setNotePopupVisible(false);
  };

  const handleNotePopupClick = () => {
    setNotePopupVisible(false);
  };

  const handleItemClick = (item) => {
    if (item === 'delete') {
      const newNotes = [...notes];
      newNotes.splice(hoveredRow, 1);
      setNotes(newNotes);
    } else if (item === 'insert') {
      const newNotes = [...notes];
      newNotes.splice(hoveredRow + 1, 0, '');
      setNotes(newNotes);
    }

    // Add other item click logic here

    // Close the dropdown menu
    setDropdownVisible(false);
  };




  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    setNotePopupVisible(false);
  };

  const renderDropdown = () => {
    if (!dropdownVisible) {
      return null;
    }

    const dropdownStyle = {
      position: 'absolute',
      left: '0',

      zIndex: '1',
    };

    return (
      <React.Fragment>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <style>
          {`
            .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
            }
          `}
        </style>
        <Paper sx={{ width: 200, maxWidth: '100%', }} style={dropdownStyle}>
          <MenuList>
            <MenuItem onClick={() => handleItemClick('delete')}>
              <ListItemIcon>
                <span className="material-symbols-outlined">delete</span>
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
            <MenuItem  onClick={() => handleItemClick('insert')}>
              <ListItemIcon>
                <span className="material-symbols-outlined">variables</span>
              </ListItemIcon>
              <ListItemText>Insert Bullet</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </React.Fragment>
    );
  };

  const renderNotePopup = () => {
    if (!notePopupVisible) {
      return null;
    }

    const notePopupStyle = {
      position: 'absolute',


      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      width: '100px',
      padding: '5px',
      background: '#d9d9d9',
      border: '1px solid #ababab',
      borderRadius: '5px',
      fontSize: '12px',
      lineHeight: '16px',
      marginTop: '80px',
      marginLeft:'70px',

      color: '#000000',
      zIndex: '1',
    };

    const lineStyle = {
      whiteSpace: 'nowrap',
    };

    return (
      <div style={notePopupStyle}>
        <div style={lineStyle}><strong>Drag</strong> to move</div>
        <div style={lineStyle}><strong>Click</strong> for options</div>
      </div>
    );
  };

  return (
    <div style={{marginLeft:'-30px'}}>
      <table>
        <tbody>
          {searchResults.length > 0
            ? searchResults.map((note, index) => (
                <tr
                  key={index}
                  onDrop={(event) => handleDrop(index, event)}
                  onDragOver={(event) => event.preventDefault()}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td>
                    <div
                      draggable
                      onDragStart={(event) => handleDragStart(index, event)}
                      onMouseEnter={handleDraggerMouseEnter} // Add this event handler
                      onMouseLeave={handleDraggerMouseLeave} // Add this event handler
                      onClick={toggleDropdown} 
                      style={{
                        visibility: hoveredRow === index ? 'visible' : 'hidden',
                        cursor: 'move',
                        width: '20px',
                        height: '20px',
                        background: '#eee',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <DragIndicatorOutlinedIcon
                        fontSize="small" // Set the desired size of the icon
                        style={{
                          background: 'white',
                          color: '#ababab'
                        }}
                      /> 
                      {renderDropdown()}
                      {renderNotePopup()}
                    </div>
                  </td>
                  <td>
                    <div
                      dangerouslySetInnerHTML={{ __html: note }}
                      style={{ padding: '5px' }}
                    />
                  </td>

                </tr>
              ))
            : notes.map((note, index) => (
                <tr
                  key={index}
                  onDrop={(event) => handleDrop(index, event)}
                  onDragOver={(event) => event.preventDefault()}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td>
  <div
    draggable
    onDragStart={(event) => handleDragStart(index, event)}
    onMouseEnter={handleDraggerMouseEnter} // Add this event handler
                      onMouseLeave={handleDraggerMouseLeave} // Add this event handler
    onClick={toggleDropdown}
    style={{
      visibility: hoveredRow === index ? 'visible' : 'hidden',
      cursor: 'move',
      width: '20px',
      height: '20px',
      background: '#eee',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
   <DragIndicatorOutlinedIcon
        fontSize="large" // Set the desired size of the icon
        style={{
          background: 'white',
          color: '#ababab'
        }}
      /> 
      {renderDropdown()}
      {renderNotePopup()}
  </div>
</td>
<td style={{ padding: '0 5px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
  {/* Render the circle at the top */}
  <div style={{ marginTop: '8px', width: '15px', height: '15px', backgroundColor: '#ff6404', borderRadius: '50%' }}></div>
</td>


<td>
  <textarea
    ref={textareaRef}
    value={note}
    onChange={(event) => handleNoteChange(index, event)}
    onKeyDown={(event) => handleNoteChange(index, event)}
    placeholder="Write here"
    style={{
      width: '213%',
      resize: 'none',
      overflow: 'hidden',
      wordWrap: 'break-word',
      padding: '3px 0px',
      fontWeight: 600,
      border: 'none',
      marginLeft: '5px',
      fontFamily: 'Gaegu, cursive',
      fontSize: '21px',

    }}
    autoFocus={index === notes.length - 1}
  />
</td>


                </tr>
              ))}
        </tbody>
      </table>

      {/* <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search..."
        />
        <button onClick={handleSearch}>Search</button>
      </div> */}
    </div>
  );
};

export default Notes;