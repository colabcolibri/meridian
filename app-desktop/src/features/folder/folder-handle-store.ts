const DB_NAME = "meridian-desktop"
const DB_VERSION = 1
const STORE = "handles"
const HANDLE_KEY = "project-folder"

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"))
  })
}

export async function saveFolderHandle(
  handle: FileSystemDirectoryHandle,
): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    tx.objectStore(STORE).put(handle, HANDLE_KEY)
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error ?? new Error("Failed to save folder handle"))
    }
  })
}

export async function loadFolderHandle(): Promise<FileSystemDirectoryHandle | null> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly")
    const request = tx.objectStore(STORE).get(HANDLE_KEY)
    request.onsuccess = () => {
      db.close()
      const value = request.result as FileSystemDirectoryHandle | undefined
      resolve(value?.kind === "directory" ? value : null)
    }
    request.onerror = () => {
      db.close()
      reject(request.error ?? new Error("Failed to load folder handle"))
    }
  })
}

export async function clearFolderHandle(): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    tx.objectStore(STORE).delete(HANDLE_KEY)
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error ?? new Error("Failed to clear folder handle"))
    }
  })
}
