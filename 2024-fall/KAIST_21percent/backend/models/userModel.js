const { db } = require('../config/firebaseAdmin');

const UserModel = {
  async getAllUsers() {
    const snapshot = await db.collection('User').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getUserById(id) {
    const doc = await db.collection('User').where('id', '==', Number(id)).get();
    return doc.empty ? null : { id: doc.docs[0].id, ...doc.docs[0].data() };
  },

  async createUser(userData) {
    const docRef = await db.collection('User').add(userData);
    return { id: docRef.id, ...userData };
  },

  async updateUser(id, userData) {
    await db.collection('User').doc(id).set(userData, { merge: true });
    return { id, ...userData };
  },

  async deleteUser(id) {
    await db.collection('User').doc(id).delete();
    return { message: `User with ID ${id} deleted` };
  },
};

module.exports = UserModel;
