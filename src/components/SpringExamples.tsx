import React, { useState } from 'react'
import { useSpring, animated as a } from 'react-spring';
import styled from 'styled-components';

// Animate Auto
const AnimatedContainer = styled(a.div)`
  height: 120px;
  background-color: rgba(200, 127, 192, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0;
`;
const AnimAutoTitle = styled.h4`
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  z-index: ${(props: { state: boolean }) => props.state ? -1 : 0};
  margin: 12px 0 0;
`
const AnimAutoCont = styled.div`
  width: 320px; 
  height: 120px; 
  position: relative; 
  cursor: pointer;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
`;

// Flip Card
const CardCont = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 2px auto;
  cursor: pointer;
`;

const ACard = styled(a.div)`
  position: absolute;
  top: 40px;
  left: 40px;
  width: 320px;
  height: 320px;
  background-size: cover;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  will-change: transform, opacity;
`;

const AFront = styled(ACard)`
  background-image: url(https://images.unsplash.com/photo-1540206395-68808572332f?ixlib=rb-1.2.1&w=1181&q=80&auto=format&fit=crop);
`;

const ABack = styled(ACard)`
  background-image: url(https://images.unsplash.com/photo-1544511916-0148ccdeb877?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1901&q=80i&auto=format&fit=crop);
`

const SpringExamples = () => {
  const [animateAuto, setAnimAuto] = useState(false);
  const [flip, set] = useState(false);

  const props = useSpring({
    width: animateAuto ? 320 : 0,
    duration: 300,
  });

  const cardProps = useSpring({
    opacity: flip ? 1 : 0,
    transform: `perspective(600px) rotateX(${flip ? 180 : 0}deg)`,
    config: { mass: 12, tension: 500, friction: 80 }
  });

  const widthIntr: (x: number | string | undefined) => string = x => {
    if (!x) return '';   
    if ((x as number).toFixed) return (x as number).toFixed(0);
    return ''
  }

  return (
    <div>
      <h4>Animating Auto</h4>
      <AnimAutoCont onClick={() => setAnimAuto(!animateAuto)}>
        <AnimatedContainer style={props}>{props.width.interpolate(widthIntr)}</AnimatedContainer>
        <AnimAutoTitle state={animateAuto}>
          Click
        </AnimAutoTitle>
      </AnimAutoCont>
      <h4>Flip Card</h4>
      <CardCont onClick={() => set(!flip)}>
        <ABack 
          style={{
            opacity: cardProps.opacity.interpolate((o: number | string | undefined) => 1 - (o as number)),
            transform: cardProps.transform,
          }} 
        />
        <AFront
          style={{
            opacity: cardProps.opacity,
            transform: cardProps.transform,
          }}
        />
      </CardCont>
    </div>
  );
}

export default SpringExamples;
