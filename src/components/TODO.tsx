import React, { useState, useCallback, useRef } from 'react';
// import { List, Map } from 'immutable';
import styled from 'styled-components';
import { useTransition, useSpring, animated as a } from 'react-spring';


const Input = styled.input`
  outline: none;
  border: 1px solid #f1f1f1;
  background-color: transparent;
  width: 140px;
  height: 30px;
  font-size: 14px;
  color: #000080;
  padding: 0 8px;
`;

const Ul = styled(a.ul)`
  padding: 0;
  list-style: none;
  width: 400px;
  border: 1px solid #e9e9e9;
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  position: relative;
  padding: 7px 0;
`;

const Item = styled(a.li)`
  flex-basis: 320px;
  width: 320px;
  background-color: #000080;
  color: #fff;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  position: absolute;
  left: 40px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3);
`;

const SubmitButton = styled.button`
  border: 1px solid #e9e9e9;
  outline: none;
  background: transparent;
  color: #000;
  font-size: 15px;
  display: inline-block;
  margin-left: 14px;
  padding: 5px;
  cursor: pointer;
`;

interface TodoList {
  id: string;
  text: string;
}

const Todo = () => {
  const [list, setList] = useState<TodoList[]>([]);
  const input = useRef<HTMLInputElement>(null);

  const [contProps, set] = useSpring(() => ({ height: list.length * 40 }));

  const handleSubmit = useCallback(() => {
    
    if (!input.current || !input.current!.value.trim()) return;
    const value = input.current!.value.trim();
    // console.log(value);
    console.log(list);
    setList(state => [...state, { id: Date.now().toString(16), text: value }]);
    input.current!.value = '';
  }, [list, setList]);

  const transitionMap: (data: TodoList, index: number) => { id: string; opacity: number; text: string, y: number } = (data, index) => ({
    id: data.id,
    opacity: 1,
    text: data.text,
    y: index * 35, 
  });

  const getId: (data: { id: string; opacity: number; text: string, y: number }) => string = data => data.id;

                      // @ts-ignore
  const transitions = useTransition(
    list.map(transitionMap), // created list object
    getId, // get id from list object
    {
      from: { opacity: 0, y: 0 },
      leave: { opacity: 0, y: 0 },
      enter: ({ opacity, y }: any) => ({ opacity, y }),
      update: ({ opacity, y }: any) => ({ opacity, y })
    },
  );

 
  return (
    <div style={{ height: '400px' }}>
      <label style={{ paddingRight: '4px' }} htmlFor="todo">Task:</label>
      <Input ref={input} id="todo" type="text" />
      <SubmitButton onClick={handleSubmit} type="button">Add</SubmitButton>
      <Ul style={contProps}>
        {list.length ? transitions.map(({ key, item, props }: any) => (
          <Item 
            style={{
              transform: props.y.interpolate((y: number | string | undefined) => `translateY(${y}px)`),
              ...props,
            }} 
            key={key}
          >
            {item.text}
          </Item>
        )) : null}
      </Ul>
    </div>
  );
}

export default Todo;
