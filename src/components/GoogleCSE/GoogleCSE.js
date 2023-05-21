import React, { useRef, useEffect } from 'react';

export const executeSearch = (searchQuery) => {
    return new Promise((resolve, reject) => {
      if (window.gapi && window.gapi.search && window.gapi.search.cse && window.gapi.search.cse.element) {
        const element = window.gapi.search.cse.element.getAllElements()[0];
        element.execute(searchQuery);
        element.setSearchCompleteCallback(null, () => {
          const results = element.getResults();
          resolve(results);
        });
      } else {
        reject(new Error('Google CSE not loaded'));
      }
    });
  };

const GoogleCSE = ({ searchQuery, onSelect }) => {
  const searchDiv = useRef(null);

  useEffect(() => {
    const gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = 'https://cse.google.com/cse.js?cx=9612d02eea3544b96';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);

    if (!window.gapi) {
        return;
      }

    gcse.onload = () => {
      if (searchDiv.current) {
        window.gapi.load('search', () => {
          window.gapi.search.cse.element.render({
            div: searchDiv.current,
            tag: 'searchbox-only',
            attributes: {
              resultsUrl: `/search?q=${searchQuery}`,
              newWindow: true,
              onSelect: onSelect,
            },
          });
        });
      }
    };
  }, [searchQuery, onSelect]);

  // new part
  useEffect(() => {
    const handleSearch = () => {
      if (window.gapi && window.gapi.search && window.gapi.search.cse && window.gapi.search.cse.element) {
        const elements = window.gapi.search.cse.element.getAllElements();
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          element.execute(searchQuery);
          element.setSearchCompleteCallback(null, () => {
            const results = element.getResults();
            console.log('search results:', results);
          });
        }
      }
    };
    handleSearch();
  }, [searchQuery]);
  // end new part

  return (
    <div className="gcse-search" ref={searchDiv} />
  );
};

export default GoogleCSE;