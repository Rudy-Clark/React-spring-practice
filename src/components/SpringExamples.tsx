import React, { useState } from 'react'
import { useSpring, animated as a } from 'react-spring';

const SpringExamples = () => {
  const [state, setState] = useState(false);
  const baseStyles: React.CSSProperties = {
    height: '120px',
    backgroundColor: 'rgba(200, 127, 192, 1)',
    border: '1px solid #e9e9e9',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const props = useSpring({
    ...baseStyles,
    width: state ? 320 : 0,
    duration: 300,
  });

  const widthIntr: (x: number | string | undefined) => string = x => {
    if (!x) return '';   
    if ((x as number).toFixed) return (x as number).toFixed(0);
    return ''
  }

  return (
    <div>
      <h4>Animating Auto</h4>
      <div style={{ width: 320, height: 120 }} onClick={() => setState(!state)}>
        <a.div style={props}>{props.width.interpolate(widthIntr)}</a.div>
      </div>
      
    </div>
  );
}

export default SpringExamples;
