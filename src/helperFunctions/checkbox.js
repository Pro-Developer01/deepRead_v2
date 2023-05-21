import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'var(--primaryColor)', // Set desired checked color
          '&.Mui-checked': {
            color: 'var(--primaryColor)', // Set desired checked color
          },
        },
        typography: {
          fontFamily: [
            "Lato",
            'sans-serif',
          ].join(','),
        }
      },
    },
  },
});

const MyCheckbox = ({ label }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        }
        label={
          <Typography variant="body1" style={{
            fontSize: '14px', fontWeight: 'bold', fontFamily: [
              "Lato",
              'sans-serif',
            ].join(','),
            color: 'var(--fontColor)'

          }}>
            {label}
          </Typography>
        }
      />
    </ThemeProvider>
  );
};

export default MyCheckbox;
