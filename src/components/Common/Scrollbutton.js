import React, { useState } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';
import { Button } from './Styles';

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    setVisible(scrolled > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <Button
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        position: 'fixed',
        bottom: '100px', // Adjust the distance from the bottom as needed
        left: '20px', // Adjust the distance from the left as needed
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      <FaArrowCircleUp onClick={scrollToTop} />
    </Button>
  );
};

export default ScrollButton;
