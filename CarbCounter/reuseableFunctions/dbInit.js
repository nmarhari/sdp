import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

let db;

// Initialize the database with async opening
export const initDB = async () => {
  db = await SQLite.openDatabaseAsync('CarbCounter.db'); // Open or create the database asynchronously
  await createTables();
  return db;
};

// Helper to run SQL queries
const executeSqlAsync = async (sql, params = []) => {
  return await db.execAsync(sql, params);
};

// Create tables using execAsync
const createTables = async () => {
  try {
    // await db.execAsync(`
    //   DROP TABLE IF EXISTS User;
    //   DROP TABLE IF EXISTS Meal;
    // `);
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS User (
        carb_to_insulin_ratio REAL,
        glucose_target INTEGER,
        dexcom_login TEXT
      );
      CREATE TABLE IF NOT EXISTS Meal (
        meal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        time TEXT NOT NULL,
        meal TEXT NOT NULL,
        glucose REAL NOT NULL
      );
    `);
    console.log("Tables created successfully");
  } catch (error) {
    console.log("Error creating tables", error);
  }
};

// Insert a user with runAsync
export const insertUser = async (carbToInsulinRatio, dexComLogin) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO User (carb_to_insulin_ratio, dexcom_login) VALUES (?, ?);`,
      carbToInsulinRatio,
      dexComLogin
    );
    console.log("User inserted successfully, ID:", result.lastInsertRowId);
  } catch (error) {
    console.log("Error inserting user", error);
    throw error;
  }
};

// Insert carb ratio with runAsync
export const insertCarbRatio = async (carbToInsulinRatio) => {
  console.log("Inserting carb-to-insulin ratio:", carbToInsulinRatio);
  try {
    await db.runAsync(
      `INSERT INTO User (carb_to_insulin_ratio) VALUES (?);`,
      carbToInsulinRatio
    );
    console.log("Carb-to-insulin ratio inserted successfully");
  } catch (error) {
    console.log("Error inserting carb-to-insulin ratio", error);
    throw error;
  }
};


export const insertGlucoseTarget = async (glucoseTarget) => {
  console.log("Inserting carb-to-insulin ratio:", glucoseTarget);
  try {
    await db.runAsync(
      `INSERT INTO User (glucose_target) VALUES (?);`,
      glucoseTarget
    );
    console.log("Carb-to-insulin ratio inserted successfully");
  } catch (error) {
    console.log("Error inserting carb-to-insulin ratio", error);
    throw error;
  }
};

export const updateCarbRatio = async (carbToInsulinRatio) => {
  console.log("Inserting carb-to-insulin ratio:", carbToInsulinRatio);
  try {
    await db.runAsync(
      `UPDATE User SET carb_to_insulin_ratio = ?;`,
      carbToInsulinRatio
    );
    console.log("Carb-to-insulin ratio updated successfully");
  } catch (error) {
    console.log("Error updating carb-to-insulin ratio", error);
    throw error;
  }
};

// Insert DexCom login with runAsync
export const insertDexComLogin = async (dexComLogin) => {
  try {
    await db.runAsync(
      `INSERT INTO User (dexcom_login) VALUES (?);`,
      dexComLogin
    );
    console.log("DexCom login inserted successfully");
  } catch (error) {
    console.log("Error inserting DexCom login", error);
    throw error;
  }
};

// Insert meal entry with runAsync
export const insertMeal = async (time, meal, glucose) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO Meal (time, meal, glucose) VALUES (?, ?, ?);`,
      time,
      meal,
      glucose
    );
    console.log("Meal inserted successfully, ID:", result.lastInsertRowId);
  } catch (error) {
    console.log("Error inserting meal", error);
    throw error;
  }
};

// Retrieve user using getFirstAsync
export const retrieveUser = async () => {
  try {
    const user = await db.getFirstAsync(`SELECT * FROM User;`);
    if (user) {
      console.log("User retrieved:", user);
      return user;
    } else {
      console.log("No user found.");
      return null;
    }
  } catch (error) {
    console.log("Error retrieving user", error);
    return null;
  }
};


export const retrieveTargetGlucose = async () => {
  try {
    const user = await db.getFirstAsync(`SELECT carb_to_insulin_ratio FROM User;`);
    if (user) {
      console.log("User retrieved:", user);
      return user;
    } else {
      console.log("No user found.");
      return null;
    }
  } catch (error) {
    console.log("Error retrieving user", error);
    return null;
  }
};

// Retrieve meals within a time range using getAllAsync
export const retrieveMeals = async (startTime, endTime) => {
  try {
    const meals = await db.getAllAsync(
      `SELECT * FROM Meal WHERE time >= ? AND time <= ? ORDER BY time ASC`,
      startTime,
      endTime
    );
    console.log("Meals retrieved:", meals);
    return meals;
  } catch (error) {
    console.log("Error retrieving meals", error);
    return [];
  }
};

// Export table data as CSV
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
