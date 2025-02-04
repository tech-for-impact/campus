const { db } = require('../config/firebaseAdmin');

const ClothModel = {
  // 모든 파티를 Firestore에서 가져오는 메소드
  async getAllClothes() {
    const snapshot = await db.collection('Cloth').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // 특정 ID를 사용하여 Firestore에서 특정 파티를 가져오는 메소드
  async getClothByID(id) {
    const doc = await db
      .collection('Cloth')
      .where('id', '==', Number(id))
      .get();
    return doc.empty ? null : { id: doc.docs[0].id, ...doc.docs[0].data() };
  },

  // 새로운 파티를 Firestore에 추가하는 메소드
  async createCloth(clothData) {
    const docRef = await db.collection('Cloth').add(clothData);
    return { id: docRef.id, ...clothData };
  },

  // 특정 파티를 Firestore에서 업데이트하는 메소드
  async updateCloth(id, clothData) {
    await db.collection('Cloth').doc(id).set(clothData, { merge: true });
    return { id, ...clothData };
  },

  // 특정 파티를 Firestore에서 삭제하는 메소드
  async deleteCloth(id) {
    await db.collection('Cloth').doc(id).delete();
    return { message: `Cloth with ID ${id} deleted` };
  },
};

module.exports = ClothModel;
