import React, { useState, useCallback, useRef } from 'react';
// import { List, Map } from 'immutable';
import styled from 'styled-components';
import { useTransition, useSpring, animated as a, useChain } from 'react-spring';


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
  overflow: hidden;
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
  margin: 5px 0;
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

  // @ts-ignore
  const contRef = useRef();
  // @ts-ignore
  const contProps = useSpring({
    ref: contRef,
    from: { height: 0 },
    to: { height: (list.length * 40 + 20)},
    duration: 1000,
  });

  const handleSubmit = useCallback(() => {
    
    if (!input.current || !input.current!.value.trim()) return;
    const value = input.current!.value.trim();
    setList(state => [...state, { id: Date.now().toString(16), text: value }]);
    input.current!.value = '';
  }, [list, setList]);

  const transitionMap: (data: TodoList, index: number) => { id: string; opacity: number; text: string, x: string } = (data, index) => ({
    id: data.id,
    opacity: 1,
    text: data.text,
    x: '0%',
  });

  const getId: (data: { id: string; opacity: number; text: string }) => string = data => data.id;

  const transRef = useRef();
                      // @ts-ignore
  const transitions = useTransition(
    list.map(transitionMap), // created list object
    getId, // get id from list object
    {
      ref: transRef,
      unique: true,

      from: { opacity: 0, x: '-50%' },
      leave: { opacity: 0, x: '-50%' },
      enter: ({ opacity, x }: any) => ({ opacity: 1, x: '0%' }),
      // update: ({ opacity, x }: any) => ({ opacity: 1, x: '0%' }),
    },
  );

  // @ts-ignore
  useChain([contRef, transRef], [0, 0.9]);
 
  return (
    <div style={{ height: '400px' }}>
      <label style={{ paddingRight: '4px' }} htmlFor="todo">Task:</label>
      <Input ref={input} id="todo" type="text" />
      <SubmitButton onClick={handleSubmit} type="button">Add</SubmitButton>
      <Ul style={contProps}>
        {list.length ? transitions.map(({ key, item, props }: any) => (
          <Item 
            style={{
              transform: props.x.interpolate((x: number | string | undefined) => `translate3d(${x}, 0, 0)`),
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
