import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useSprings, useSpring, animated  } from 'react-spring';
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

// const useDnD = (fn: () => void) => {
//   const li = React.useRef(null);
//   const [, drag] = useDrag({
//       item: {
//         type: 'item',
//         index: 0,
//       },
//       begin() {
//         console.log(li.current);
//       }
//     });

//   drag(li);
//   useEffect(() => console.log(li), [fn]);
//   return (index: number) => {
    
//     return {
//       ref: li,
//     }
//   }  
// }

type ItemProps = {
  index: number;
  text: string;
  swap: Swap;
  // set: (obj: any) => void;
}

type Swap = (dragIndex: number, hoverIndex: number) => void;
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
      // set((springIndex: number) => {
      //   // console.log(springIndex);
      //   //   if (springIndex === index)
      //   //     return ({ y: item.index * 124 });
      //     // } else if (springIndex === item.index) {
      //     //   return ({ y: index * 124 });
      //     // }
      // });
      swap(item.index, index);
    },
  })

  drop(drag(li));
  return (
    <div ref={li} style={{ height: '100%' }}>{text}</div>
  );
}


const Springs = () => {
  const [list, setList] = useState(listItems);

  const swap: Swap = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragItem = list[dragIndex];
    setList(update(list, { $splice: [ [dragIndex, 1], [hoverIndex, 0, dragItem] ] }));
  }, [list, setList]);

  const springs = useSprings(list.length, list.map((_, index) => ({ transform: `translateY(${index * 124}px)` })));

  return (
    <div>
      <h4>Drag and drop list</h4>
      <ul>
        <ListCont>
          <UL height={list.length * 124}>
            {springs.map((props, index) => 
              <AItem 
                key={index}
                style={props}
              >
                <Item  text={list[index]} index={index} swap={swap}  />
              </AItem >
            )}
          </UL>
        </ListCont>
      </ul>
    </div>
  );
}

export default Springs;
