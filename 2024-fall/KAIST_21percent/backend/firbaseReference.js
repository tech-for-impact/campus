// Firebase 설정 정보 예시 (Firebase Console에서 복사하여 붙여넣기)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Firestore에서 데이터 불러오기 예시
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, child } = require('firebase/database'); // Realtime Database
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} = require('firebase/firestore'); // Firestore

const app = initializeApp(firebaseConfig);

// 예시 데이터 추가 및 수정용 API 함수들
const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();

// POST: Firestore에 새 문서 추가 예시
app.post('/api/items', async (req, res) => {
  try {
    const newItem = {
      name: req.body.name,
      description: req.body.description,
    };
    const docRef = await db.collection('items').add(newItem);
    res.status(201).json({ id: docRef.id, ...newItem });
  } catch (error) {
    res.status(500).send('Error adding new item to Firebase');
  }
});

// PUT: Firestore에서 문서 업데이트 예시
app.put('/api/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const item = {
      name: req.body.name,
      description: req.body.description,
    };
    await db.collection('items').doc(id).set(item, { merge: true });
    res.json({ id, ...item });
  } catch (error) {
    res.status(500).send('Error updating item in Firebase');
  }
});

// DELETE: Firestore에서 문서 삭제 예시
app.delete('/api/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.collection('items').doc(id).delete();
    res.json({ message: `Item with ID ${id} deleted` });
  } catch (error) {
    res.status(500).send('Error deleting item from Firebase');
  }
});

// Realtime Database에서 데이터 불러오기 예시
const getDataFromRealtimeDatabase = async () => {
  const db = getDatabase();
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, 'users'));
    if (snapshot.exists()) {
      console.log('Realtime Database data:', snapshot.val());
    } else {
      console.log('No data available in Realtime Database');
    }
  } catch (error) {
    console.error('Error fetching data from Realtime Database:', error);
  }
};

// Firestore에서 데이터 불러오기 예시
const getDataFromFirestore = async () => {
  const db = getFirestore(app);

  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
    const docRef = doc(db, 'users', 'USER_ID');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Firestore document data:', docSnap.data());
    } else {
      console.log('No such document in Firestore');
    }
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
  }
};

// 함수 실행 예제
getDataFromRealtimeDatabase();
getDataFromFirestore();
