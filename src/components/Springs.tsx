import React, { useRef, useCallback, useState } from 'react';
import { useSprings, animated as a } from 'react-spring';
import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

const listItems = ['Lorem', 'Ipsum', 'Amet', 'Dolor', 'Sit'];
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

const ListItem = styled.li`
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

type Props = {
  index: number;
  text: string;
  swap: (dragIndex: number, hoverIndex: number) => void;
  setSpring: any;
  y: any;
}
const Item = ({ index,  text, swap, setSpring, y }: Props) => {
  const li = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: 'item',
      index,
    },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });

  const [, drop] = useDrop({
    accept: 'item',
    hover(item: { type: string; index: number }) {
      if (!li.current) return;
      if (index === item.index) return;
      swap(item.index, index);
      setSpring((index: any) => ({ y: (index * 124) }));
      // !MUtATION
      item.index = index;
      // return item;
    },
  });

  drag(drop(li));
  return <ListItem ref={li} style={{ transform: y.interpolate((y: string | number | undefined) => `translateY(${y ? y : 0}px)` )}} children={text} />
}

const Springs = () => {
  const [list, setList] = useState(listItems);

  const swap = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragItem = list[dragIndex];
    setList(update(list, { $splice: [ [dragIndex, 1], [hoverIndex, 0, dragItem] ] }));
  }, [list, setList]);

  const [springs, set] = useSprings(list.length, index => ({ y: (index * 124) }));

  const handleClick = (currInd: number) => () => {
    // @ts-ignore
    set((springIndex: Partial<Merge<{ y: number; }>>) => ({ y: springIndex === currInd ? 0 : springIndex * 124 }));
  }

  return (
    <div>
      <h4>Drag and drop list</h4>
      <ul>
        <ListCont>
          <UL height={list.length * 124}>
            {springs.map((props, index) => {
              const AItem = a(Item);
              return <AItem key={index} swap={swap} y={props.y} index={index} text={list[index]} setSpring={set} />
            })}
          </UL>
        </ListCont>
      </ul>
    </div>
  );
}

export default Springs;
