const fs = require("fs/promises");
const path = require("path");


// locate data file from the project root
const dataFilePath = path.join(__dirname, "../data/data.jsonl");

// Create a data directory and file if they don't exist
const initializeStorage = async () => {
  const dataDirectory = path.dirname(dataFilePath);

  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    // Use "wx" flag to create the file only if it doesn't exist.
    /*If you use "w" instead of "wx"(write-exclusive), Node.js will create the file if it doesn't exist, 
    but overwrite its contents if it already exists

    Use "wx" for your data-file initialization. 
    It protects existing JSONL data from accidental deletion during application startup.

    ===========
    Is "a" suitable for initialization?
    Yes! In this particular case, both "a" and "wx" preserve existing data.

    However, there is an important difference:
        - "a" silently succeeds if the file already exists.
        - "wx" explicitly fails with EEXIST if the file already exists.
    */
    await fs.writeFile(dataFilePath, "", { flag: "wx" });
  } catch (error) {
    // EEXIST means the file already exists.
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
};

module.exports = initializeStorage;