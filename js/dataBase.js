// Функция для сохранения массива в IndexedDB
export function saveDataToIndexedDB(data, objectStoreName) {

  const dbName = 'universal-store';
  const dbVersion = 1;  
  
  indexedDB.deleteDatabase(dbName);


  const request = indexedDB.open(dbName, dbVersion);

  request.onerror = function(event) {
      console.error('Error opening IndexedDB:', event.target.error);
  };

  request.onupgradeneeded = function(event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(objectStoreName)) {
          db.createObjectStore(objectStoreName, { keyPath: 'id' });
      }
  };

  request.onsuccess = function(event) {
      const db = event.target.result;
     
      const tx = db.transaction(objectStoreName, 'readwrite');
      const store = tx.objectStore(objectStoreName);

      data.forEach(item => {
          store.put(item);
      });

// const objectStoreNames = Array.from(db.objectStoreNames);
//         console.log("1-Имена объектных хранилищ в базе данных:", objectStoreNames);

      tx.oncomplete = function() {
          console.log('Data saved to IndexedDB successfully.');
          db.close();
      };
  };
}




export function getDataFromIndexedDB(objectStoreName, callback) {
    const dbName = 'universal-store';
    const dbVersion = 1;

    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function(event) {
        console.error('Ошибка при открытии IndexedDB:', event.target.error);
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        const tx = db.transaction(objectStoreName, 'readonly');
        const store = tx.objectStore(objectStoreName);
        const getDataRequest = store.getAll();

        getDataRequest.onsuccess = function(event) {
            const data = event.target.result;
            callback(null, data);
        };

        tx.oncomplete = function() {
            db.close();
        };
    };

    request.onupgradeneeded = function(event) {
        // Обработка обновления базы данных, если это необходимо
    };
}