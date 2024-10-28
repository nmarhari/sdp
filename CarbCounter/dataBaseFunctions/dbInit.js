import * as SQLite from 'expo-sqlite';
// Open or create a database


const initDB = () => {
    const db = SQLite.openDatabase('CarbCounter.db');
    createTables(db);
    return db;
}


const createTables = (db) => {
    db.transaction(tx => {
      // Create User table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS User (
            carb_to_insulin_ratio REAL NOT NULL,
            DexComLogin TEXT NOT NULL
        );`,
        [],
        () => console.log("User table created successfully"),
        (txObj, error) => console.log("Error creating User table", error)
      );
  
      // Create Meal table with foreign key referencing User table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Meal (
            meal_id INTEGER PRIMARY KEY AUTOINCREMENT,
            time TEXT NOT NULL,
            meal TEXT NOT NULL,
            glucose REAL NOT NULL,
        );`,
        [],
        () => console.log("Meal table created successfully"),
        (txObj, error) => console.log("Error creating Meal table", error)
      );
    });
  };

// Function to insert a new user into the User table
const insertUser = (db, carbToInsulinRatio, dexComLogin) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO User (carb_to_insulin_ratio, DexComLogin) VALUES (?, ?)`,
        [carbToInsulinRatio, dexComLogin],
        (_, resultSet) => {
          console.log("User inserted successfully with ID:", resultSet.insertId);
        },
        (_, error) => {
          console.log("Error inserting user", error);
          return false; // indicates failure
        }
      );
    });
  };


// Function to insert a new meal into the Meal table
const insertMeal = (db, time, meal, glucose) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO Meal (time, meal, glucose) VALUES (?, ?, ?)`,
        [time, meal, glucose],
        (_, resultSet) => {
          console.log("Meal inserted successfully with ID:", resultSet.insertId);
        },
        (_, error) => {
          console.log("Error inserting meal", error);
          return false; // indicates failure
        }
      );
    });
  };


// Function to retrieve a user by their ID
const retrieveUser = (db, callback) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM User`,
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            callback(_array[0]); // Return the first user found
          } else {
            console.log("User not found");
            callback(null);
          }
        },
        (_, error) => {
          console.log("Error retrieving user", error);
          callback(null);
        }
      );
    });
  };



// Function to retrieve meals within a specified time range
const retrieveMeals = (db, startTime, endTime, callback) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Meal WHERE time >= ? AND time <= ? ORDER BY time ASC`,
        [startTime, endTime],
        (_, { rows: { _array } }) => {
          callback(_array); // Return all meals within the time range
        },
        (_, error) => {
          console.log("Error retrieving meals", error);
          callback([]);
        }
      );
    });
  };



  const exportTableAsCSV = async (db, tableName="Meal") => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName}`,
          [],
          async (_, { rows: { _array } }) => {
            try {
              // Convert data to CSV format
              const csvData = convertToCSV(_array);
  
              // Define file path
              const fileUri = `${FileSystem.documentDirectory}${tableName}.csv`;
  
              // Write CSV data to file
              await FileSystem.writeAsStringAsync(fileUri, csvData, {
                encoding: FileSystem.EncodingType.UTF8,
              });
  
              console.log(`CSV file created at ${fileUri}`);
              resolve(fileUri); // return the file URI
            } catch (error) {
              console.log("Error writing CSV file", error);
              reject(error);
            }
          },
          (_, error) => {
            console.log("Error fetching data from table", error);
            reject(error);
          }
        );
      });
    });
  };
  
  // Helper function to convert data to CSV format
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
  
    // Get headers
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];
  
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Wrap strings with commas in double quotes
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      });
      csvRows.push(values.join(","));
    });
  
    return csvRows.join("\n");
  };

export { initDB, insertUser, insertMeal, retrieveUser, retrieveMeals, exportTableAsCSV };