import { useEffect } from 'react'

export default function DB() {
    let db: IDBDatabase

    const keyPathDb = async () => {
        let request = window.indexedDB.open('testDB', 2)
        request.onupgradeneeded = (e) => {
            console.log('onupgradeneeded', e)
            let _db: IDBDatabase = (e.target as IDBRequest).result
            let objectStore = _db.createObjectStore('words', {
                keyPath: 'word',
            })

            objectStore.createIndex('wordIndex', 'word', { unique: true })

            console.log('add 🟩🟩🟩')

            objectStore.transaction.oncomplete = (e) => {
                let wordObjectStore = _db
                    .transaction('words', 'readwrite')
                    .objectStore('words')
                for (let i = 0; i < 5; i++) {
                    wordObjectStore.add({
                        word: i.toString(36),
                        index: i,
                        time: Date.now(),
                    })
                }
            }
        }

        request.onerror = (e) => {
            console.log('request.onerror', e)
        }
        request.onsuccess = (e) => {
            console.log('onsuccess', e)
            db = (e.target as IDBRequest).result
            db.onerror = (e) => console.log('db.onerror', e)
        }
    }

    let db2: IDBDatabase

    const keyGenDb = async () => {
        let request = indexedDB.open('keygen', 1)

        request.onupgradeneeded = function (event) {
            let _db = (event.target as IDBRequest).result

            let objStore = _db.createObjectStore('words', {
                autoIncrement: true,
            })

            for (let i = 0; i < 5; i++) {
                objStore.add(i.toString(26))
            }
        }

        request.onsuccess = (e) => {
            db2 = (e.target as IDBRequest).result
            db2.onerror = console.error
        }
    }

    useEffect(() => {
        keyPathDb()
        keyGenDb()
    }, [])

    const dbAdd = () => {
        let transaction = db.transaction('words', 'readwrite')
        transaction.oncomplete = (e) => console.log('transaction complete: ', e)

        let objectStore = transaction.objectStore('words')

        let request = objectStore.add({
            word: 'a',
            index: 8,
            time: Date.now(),
        })

        request.onsuccess = (e) => {
            console.log('request success', e)
        }
    }

    const genKeyAdd = () => {
        let transaction = db2.transaction('words', 'readwrite')

        let objectStore = transaction.objectStore('words')

        objectStore.add(Date.now().toString(36)).onsuccess = console.log
    }

    return (
        <div>
            <button onClick={dbAdd}>path key db add</button>
            <button onClick={genKeyAdd}>gen key add</button>
        </div>
    )
}
