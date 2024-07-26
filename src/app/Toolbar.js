import './App.css';

export default function Toolbar() {
    function handleClick() {
        alert("You clicked me!");
    }

    return (
        <div className="toolbar">
          <button id="home-button" role="button">
            Home
          </button>
        </div>
    );
  }