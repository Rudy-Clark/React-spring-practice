import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useTransition, useSpring, useChain, animated as a } from 'react-spring';
import update from 'immutability-helper';
import { compose, map, curry } from 'ramda'; 

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

const Ul = styled.ul`
  padding: 20px 0;
  list-style: none;
  width: 400px;
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  overflow: hidden;
  height: auto;
`;

const Item = styled(a.li)`
  flex-basis: 320px;
  width: 320px;
  color: #fff;
  border-radius: 4px;
  height: 30px;
  display: flex;
  flex: row nowrap;
  margin: 5px 0;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3);
  align-items: center;
  color: #fff;
`;

const ItemText = styled.p`
  font-weight: bold;
  flex-basis: 80%;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  background-color: #000080;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
`
const ItemIconButton = styled.button`
  height: 100%;
  cursor: pointer;
  flex-basis: 20%;
  line-height: 30px;
  vertical-align: middle;
  outline: none;
  border: none;
  background-color: #9f0000;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  &:focus {
    outline: none;
  }
`

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

type TodoList = {
  id: string;
  text: string;
}

type FilterOff = (filterStr: string) => (data: { id: string; opacity: number; text: string }) => string;

const Todo = () => {
  const [list, setList] = useState<TodoList[]>([]);
  const [filterText, setFilter] = useState('');
  const [reverse, setRev] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // // @ts-ignore
  // const contRef = useRef();
  // // @ts-ignore
  // const contProps = useSpring({
  //   ref: contRef,
  //   from: { height: 0 },
  //   to: { height: (list.length * 40 + 40)},
  // });

  const handleSubmit = useCallback(() => {
    if (!input.current || !input.current!.value.trim()) return;
    if (reverse) setRev(false);
    const value = input.current!.value.trim();
    setList(state => [...state, { id: Date.now().toString(16), text: value }]);
    input.current!.value = '';
  }, [list, setList, setRev, reverse]);

  const delItem = useCallback((index: number) => {
    if (!reverse) setRev(true);
    setList(update(list, { $splice: [[index, 1]] }));
  }, [list, setList, setRev, reverse]);

  const handleChange = useCallback((e: React.FormEvent) => {
    // @ts-ignore
    const value = e.target.value.trim();
    if (value) setFilter(value);
    else setFilter('');
  }, [filterText]);

  const transitionMap: (data: TodoList) => { id: string; opacity: number; text: string, x: string } = data => ({
    id: data.id,
    opacity: 1,
    text: data.text,
    x: '0%',
  });

  const getId: (data: { id: string; opacity: number; text: string }) => string = data => data.id;
  
  const filterByText = curry((filterText, list) => list.filter((data: TodoList) => data.text.toLowerCase().indexOf(filterText.toLowerCase()) !== -1));
  const filterOff = compose(map(transitionMap), filterByText(filterText));

  // @ts-ignore
  const transitions = useTransition(
    list.length ? filterOff(list) : [], // created list object
    getId, // get id from list object
    {
      duration: 100,
      from: { opacity: 0, x: '-50%' },
      leave: { opacity: 0, x: '-50%' },
      enter: ({ opacity, x }: any) => ({ opacity: 1, x: '0%' }),
      update: ({ opacity, x }: any) => ({ opacity: 1, x: '0%' }),
    },
  );

  return (
    <div style={{ height: '400px' }}>
      <label style={{ paddingRight: '4px' }} htmlFor="todo">Task:</label>
      <Input ref={input} id="todo" type="text" />
      <SubmitButton onClick={handleSubmit} type="button">Add</SubmitButton>
      <label style={{ paddingRight: '4px', marginLeft: '12px' }} htmlFor="filter">Filter:</label>
      <Input onChange={handleChange} placeholder="filter by text" id="filter" type="text" />
      <Ul>
        {transitions.map(({ key, item, props }: any, index: number) => (
          <Item 
            style={{
              transform: props.x.interpolate((x: number | string | undefined) => `translate3d(${x}, 0, 0)`),
              ...props,
            }} 
            key={key}
          >
            <ItemText>{item.text}</ItemText>
            <ItemIconButton type="button" onClick={() => delItem(index)}>X</ItemIconButton>
          </Item>
        ))}
      </Ul>
    </div>
  );
}

export default Todo;
