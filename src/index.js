import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux';



function Square(props) {
  return (
    <button className="square" onClick={props.onSelected}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(cellIndex) {
    return (
      <Square
        value={this.props.squares[cellIndex]}
        onSelected={() => this.props.onCellSelected(cellIndex)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    const DEFAULT_STATE = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };

    this.store = createStore((state = DEFAULT_STATE, action) => {
      switch (action.type) {
        case 'BUTTON_CLICKED':
          return this._buttonClickedReducer(state, action);

        case 'JUMP_TO':
          return this._jumpToReducer(state, action);

        default:
          return state;
      }
    });

    this.store.subscribe(() => {
      this.setState(this.store.getState());
    });

    this.state = DEFAULT_STATE;
  }

  handleClick(i) {
    this.store.dispatch({
      type: 'BUTTON_CLICKED',
      payload: i,
    });
  }

  _buttonClickedReducer(state, action) {
    const history = state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const i = action.payload;

    if (calculateWinner(squares) || squares[i]) {
      return state;
    }

    squares[i] = state.xIsNext ? 'X' : 'O';

    return {
      history: [
        ...history,
        { squares }
      ],
      stepNumber: history.length,
      xIsNext: !state.xIsNext
    };
  }

  jumpTo(step) {
    this.store.dispatch({
      type: 'JUMP_TO',
      payload: step,
    });
  }

  _jumpToReducer(state, action) {
    const step = action.payload;

    return {
      history: state.history.slice(0, step + 1),
      stepNumber: step,
      xIsNext: (step % 2) === 0
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onCellSelected={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
