const fs = require('fs').promises;
const path = require('path');

// Save and load functions for historical data management
async function saveHistoricalDataToFile(data) {
  try {
    const dataDir = path.join(__dirname, '../data');
    await fs.mkdir(dataDir, { recursive: true });
    
    const filePath = path.join(dataDir, 'marksix-historical-data.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    console.log(`Saved ${data.length} records to ${filePath}`);
    return filePath;
  } catch (error) {
    console.log("Save error: ", error.message);
  }
}

async function loadHistoricalDataFromFile() {
  try {
    const filePath = path.join(__dirname, '../data/marksix-historical-data.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log("Load file error: ", error.message);
    return [];
  }
}

// Initialize historical data from file on startup
async function initializeHistoricalData() {
  try {
    const fileData = await loadHistoricalDataFromFile();
    if (fileData.length > 0) {
      console.log(`Loaded ${fileData.length} historical records from file on startup`);
      return fileData;
    }
    return [];
  } catch (error) {
    console.log("Failed to load historical data on startup:", error.message);
    return [];
  }
}

module.exports = {
  saveHistoricalDataToFile,
  loadHistoricalDataFromFile,
  initializeHistoricalData
};