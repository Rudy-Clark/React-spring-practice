import React, { useState } from 'react';
import { useSpring, animated as a } from 'react-spring'; 

const Basics = () => {
  const duration = 300;
  const [state, setState] = useState(true);
  
  const { x } = useSpring({ x: state ? 1 : 0, duration });
  const props = useSpring({ opacity: state ? 1 : 0, from: { opacity: state ? 0 : 1 }, duration });

  const style: React.CSSProperties = {
    transform: x.interpolate({
        range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
        output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1]
      })
      .interpolate(x => `scale(${x})`),
    border: 'none',
    background: 'transparent',
    textAlign: 'center',
    fontSize: '2rem',
    color: '#e9e9e9',
    cursor: 'pointer',
    opacity: state ? 1 : 0.4,
    outline: 'none',
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex', 
    justifyContent: 'space-between', 
    height: '100px',
    width: '300px',
    margin: '0 auto', 
    alignItems: 'center',
  };

  return (
    <div style={containerStyles}>
        <a.p style={props}>I will fade in</a.p>
        <a.button style={style} onClick={() => setState(!state)}>Change</a.button>
    </div>
  );
}

export default Basics;
