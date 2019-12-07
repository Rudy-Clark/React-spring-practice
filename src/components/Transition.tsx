import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useTransition, useSpring, animated  } from 'react-spring';
import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

import Todo from './TODO';

const ListCont = styled.div`
  border: 1px solid #f1f1f1;
  padding-top: 12px;
  width: 480px;
  margin: 0 auto;
`;

const UL = styled.ul`
  height: ${(props: { height: number }) => props.height ? props.height : 0}px;
  position: relative;
`;

const AItem = styled(animated.li)`
  position: absolute;
  left: 40px;
  height: 100px;
  width: 400px;
  vertical-align: middle;
  line-height: 100px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.4);
  background-color: #000090;
  border-radius: 4px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  cursor: grab;
`;

type DragItem = { 
  type: string; 
  index: number, 
  dragSet?: (index: number) => void 
}

type Swap = (dragIndex: number, hoverIndex: number) => void;

type ItemProps = {
  index: number;
  text: string;
  swap: Swap;
}

const Item = ({ index, text, swap }: ItemProps) => {
  const li = React.useRef(null);
  const [, drag] = useDrag({
      item: {
        type: 'item',
        index,
      },
    });

  const [, drop] = useDrop({
    accept: 'item',
    drop(item: DragItem) {
      if (item.index === index) return;
      swap(item.index, index);
    },
    // hover(item: DragItem) {
    //   if (item.index === index) return;
    //   swap(item.index, index);
    // }
  });

  drop(drag(li));
  return (
    <div ref={li} style={{ height: '100%' }}>{text}</div>
  );
}

const listItems = ['Lorem', 'Ipsum', 'Amet', 'Dolor', 'Sit'];
const Springs = () => {
  const [list, setList] = useState(listItems);

  const swap: Swap = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragItem = list[dragIndex];
    setList(update(list, { $splice: [ [dragIndex, 1], [hoverIndex, 0, dragItem] ] }));
  }, [list, setList]);

  // @ts-ignore
  const transitions = useTransition(
    list.map((text, index) => ({ y: index * 124, index, text })),
    item => item.text,
    {
      // @ts-ignore
      from: { opacity: 0, y: 0 },
      // @ts-ignore
      leave: { opacity: 0, y: 0 },
      // @ts-ignore
      enter: ({ y }) => ({ opacity: 1, y }),
      // @ts-ignore
      update: ({ y }) => ({ y }),
      duration: 100,
    }
  );

  return (
    <div>
      <h4>Drag and drop list</h4>
      <ul>
        <ListCont>
          <UL height={list.length * 124}>
            {transitions.map(({ key, props: { y, opacity }, item }: {[key: string]: any}, index: number) => 
              <AItem 
                key={key}
                style={{
                   transform: y.interpolate((t: number | string | undefined) => `translateY(${t}px)`),
                   opacity,
                   zIndex: list.length - index,
                }}
              >
                <Item  text={item.text} index={item.index} swap={swap}  />
              </AItem >
            )}
          </UL>
        </ListCont>
      </ul>
      <Todo />
    </div>
  );
}

export default Springs;
