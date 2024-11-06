import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync('CarbCounter.db'); // Open or create the database asynchronously
  await createTables(db);
  return db;
};

const createTables = async (db) => {
  try {
    // Run queries within a single transaction
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS User (
        carb_to_insulin_ratio REAL NOT NULL,
        DexComLogin TEXT NOT NULL
      );
    `);
    console.log("User table created successfully");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Meal (
        meal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        time TEXT NOT NULL,
        meal TEXT NOT NULL,
        glucose REAL NOT NULL
      );
    `);
    console.log("Meal table created successfully");

  } catch (error) {
    console.log("Error creating tables", error);
  }
};


export const insertUser = (db, carbToInsulinRatio, dexComLogin) => 
  new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO User (carb_to_insulin_ratio, DexComLogin) VALUES (?, ?)`,
        [carbToInsulinRatio, dexComLogin],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });




export const insertMeal = async (time, meal, glucose) => {
  try {
    await db.withTransactionAsync(async (txn) => {
      await txn.execAsync(
        `INSERT INTO Meal (time, meal, glucose) VALUES (?, ?, ?)`,
        [time, meal, glucose]
      );
    });
    console.log("Meal inserted successfully");
  } catch (error) {
    console.log("Error inserting meal", error);
    throw error;
  }
};



export const retrieveUser = async () => {
  try {
    const result = await db.getFirstAsync(`SELECT * FROM User`);
    if (result) {
      console.log("User retrieved:", result);
      return result;
    } else {
      console.log("No user found.");
      return null;
    }
  } catch (error) {
    console.log("Error retrieving user", error);
    return null;
  }
};
export const retrieveMeals = async (startTime, endTime) => {
  try {
    const meals = await db.getAllAsync(
      `SELECT * FROM Meal WHERE time >= ? AND time <= ? ORDER BY time ASC`,
      [startTime, endTime]
    );
    console.log("Meals retrieved:", meals);
    return meals;
  } catch (error) {
    console.log("Error retrieving meals", error);
    return [];
  }
};
import * as FileSystem from 'expo-file-system';

export const exportTableAsCSV = async (tableName = "Meal") => {
  try {
    const rows = await db.getAllAsync(`SELECT * FROM ${tableName}`);
    const csvData = convertToCSV(rows);
    const fileUri = `${FileSystem.documentDirectory}${tableName}.csv`;

    await FileSystem.writeAsStringAsync(fileUri, csvData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log(`CSV file created at ${fileUri}`);
    return fileUri;
  } catch (error) {
    console.log("Error writing CSV file", error);
    throw error;
  }
};

// Helper function to convert data to CSV format
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',')
        ? `"${value}"`
        : value;
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
};
