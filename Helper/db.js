import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(false);

// const db = SQLite.openDatabase({ name: 'ShoppingApp.db', location: 'default' });

// export const initDB = () => {
//   db.transaction(tx => {
//     // User Table
//     tx.executeSql('CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, profile TEXT)');
//     // Orders Table (To trace orders)
//     tx.executeSql('CREATE TABLE IF NOT EXISTS Orders (id INTEGER PRIMARY KEY AUTOINCREMENT, total TEXT, status TEXT, date TEXT, lat REAL, lng REAL)');
//   });
// };
export const db = SQLite.openDatabase(
  { name: 'ShoppingApp.db', location: 'default' },
  () => console.log('DB OPENED'),
  err => console.log('DB OPEN ERROR', err)
);
export const placeOrderDB = (total, lat, lng) => {
  return new Promise((resolve) => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO Orders (total, status, date, lat, lng) VALUES (?, ?, ?, ?, ?)', 
      [total, 'On the way', new Date().toString(), lat, lng], 
      (_, results) => resolve(results.insertId));
    });
  });
};
export const initDB = () => {
  db.transaction(
    tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT,
          phone TEXT,
          profile TEXT
        )`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          total TEXT,
          status TEXT,
          date TEXT,
          lat REAL,
          lng REAL
        )`
      );
    },
    error => {
      console.log('INIT DB ERROR:', error);
    },
    () => {
      console.log('DB TABLES CREATED');
    }
  );
};


// Helper/db.js mein check karein
export const saveUserToDB = (name, email, phone, profile) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT INTO Users (name, email, phone, profile)
           VALUES (?, ?, ?, ?)`,
          [name, email, phone, profile],
          (_, result) => {
            resolve(result);
          }
        );
      },
      error => {
        console.log('INSERT ERROR:', error);
        reject(error);
      }
    );
  });
};


export const getUserFromDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM Users ORDER BY id DESC LIMIT 1', [], (tx, results) => {
        if (results.rows.length > 0) {
          resolve(results.rows.item(0));
        } else {
          resolve(null);
        }
      });
    });
  });
};