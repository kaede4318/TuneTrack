// pages/api/save-song.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const newSong = req.body;

    // Define the path to save the file in the public/data directory
    const filePath = path.join(process.cwd(), 'public', 'data', 'songs.json');

    // Ensure the public/data directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Read the existing data from the file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading data' });
      }

      // Parse the existing data or initialize an empty array if the file doesn't exist
      const existingSongs = data ? JSON.parse(data) : [];

      // Check if the song already exists
      const songIndex = existingSongs.findIndex(song => song.title === newSong.title);

      if (songIndex !== -1) {
        // If the song exists, update it
        existingSongs[songIndex] = newSong;
      } else {
        // If the song does not exist, append it
        existingSongs.push(newSong);
      }

      // Convert the updated data to a JSON string
      const jsonString = JSON.stringify(existingSongs, null, 2);

      // Save the updated JSON string to the file
      fs.writeFile(filePath, jsonString, (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return res.status(500).json({ error: 'Error saving data' });
        }
        res.status(200).json({ message: 'Song saved successfully' });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
