import React from 'react';

export function Square(props) {
  return (
    <button className="square" onClick={props.onSelected}>
      {props.value}
    </button>
  );
}