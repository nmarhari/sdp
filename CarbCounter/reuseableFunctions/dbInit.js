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

const createTables = async () => {
  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS User;
      DROP TABLE IF EXISTS Meal;
    `);
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY, -- Ensure only one row exists
        carb_to_insulin_ratio REAL,
        glucose_target INTEGER,
        dexcom_login TEXT
      );
      CREATE TABLE IF NOT EXISTS Meal (
        meal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        time TEXT NOT NULL,
        meal TEXT NOT NULL,
        glucose REAL NOT NULL,
        insulin_taken REAL NOT NULL
      );
      -- Initialize the default user row if it doesn't exist
      INSERT OR IGNORE INTO User (id, carb_to_insulin_ratio, glucose_target, dexcom_login) 
      VALUES (1, NULL, NULL, NULL);
    `);
    console.log("Tables created successfully");
  } catch (error) {
    console.log("Error creating tables", error);
  }
};


// Insert a user with runAsync
export const insertUser = async (carbToInsulinRatio, dexComLogin) => {
  try {
    await db.runAsync(
      `UPDATE User SET carb_to_insulin_ratio = ?, dexcom_login = ? WHERE id = 1;`,
      [carbToInsulinRatio, dexComLogin]
    );
    console.log("User updated successfully");
  } catch (error) {
    console.log("Error updating user", error);
    throw error;
  }
};

export const insertCarbRatio = async (carbToInsulinRatio) => {
  try {
    await db.runAsync(
      `UPDATE User SET carb_to_insulin_ratio = ? WHERE id = 1;`,
      [carbToInsulinRatio]
    );
    console.log("Carb-to-insulin ratio updated successfully", retrieveUser());
  } catch (error) {
    console.log("Error updating carb-to-insulin ratio", error);
    throw error;
  }
};



export const insertGlucoseTarget = async (glucoseTarget) => {
  try {
    console.log("this is the target", glucoseTarget);
    const result = await db.runAsync(
      `UPDATE User SET glucose_target = ? WHERE id = 1;`,
      [glucoseTarget]
    );
    const user = await retrieveUser(); // Await the result of retrieveUser()
    console.log("Glucose target updated successfully", user, result);
  } catch (error) {
    console.log("Error updating glucose target", error);
    throw error;
  }
};


export const insertDexComLogin = async (dexComLogin) => {
  try {
    await db.runAsync(
      `UPDATE User SET dexcom_login = ? WHERE id = 1;`,
      [dexComLogin]
    );
    console.log("DexCom login updated successfully", retrieveUser());
  } catch (error) {
    console.log("Error updating DexCom login", error);
    throw error;
  }
};


// Insert meal entry with runAsync
export const insertMeal = async (time, meal, glucose, insulin) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO Meal (time, meal, glucose, insulin_taken) VALUES (?, ?, ?,?);`,
      time,
      meal,
      glucose,
      insulin
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
    const user = await db.getFirstAsync(`SELECT * FROM User WHERE id = 1;`);
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
