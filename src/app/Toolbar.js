export default function Toolbar() {
    function handleClick() {
        alert("You clicked me!");
    }

    return (
        <div className="toolbar">
            This is where the toolbar will go
            <button onClick={handleClick}>Button 1</button>
            <button onClick={handleClick}>Button 2</button>
            <button onClick={handleClick}>Button 3</button>
        </div>
    );
}