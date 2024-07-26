import './App.css';

const Home = () => {
    return (
      <div className="home-container">
        <h1 className="app-name">TuneTrack</h1>
        <div className="upload-container">
          <label htmlFor="file-upload" className="custom-file-upload">
            Upload Sheet Music
          </label>
          <input id="file-upload" type="file" accept="application/pdf" />
        </div>
      </div>
    );
  };
  
export default Home;
