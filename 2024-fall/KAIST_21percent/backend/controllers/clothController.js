const { format_date, getWebUrl } = require('../utils/helpers');
const ClothModel = require('../models/clothModel');
const PartyModel = require('../models/partyModel');
const UserModel = require('../models/userModel');
const { admin, db } = require('../config/firebaseAdmin');
const { Timestamp } = require('firebase-admin').firestore;
const path = require('path');

const bucket = admin.storage().bucket();

async function edit_cloth(cloth) {
  cloth.image = await getWebUrl('cloth/' + cloth.image);
  cloth.upload_date = format_date(cloth.upload_date);
  return cloth;
}

exports.getAllClothes = async (req, res) => {
  try {
    const clothes = await ClothModel.getAllClothes();
    const items = await clothes.map((cloth) => edit_cloth(cloth));
    Promise.all(items).then((result) => {
      result.sort((a, b) => b.date - a.date);
      res.json(result);
      return;
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching clothes');
  }
};

exports.getClothByID = async (req, res) => {
  try {
    const cloth = await ClothModel.getClothByID(req.params.id);
    if (cloth) {
      const item = await edit_cloth(cloth);
      res.json(item);
      return;
    } else {
      res.status(404).send('Cloth not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching cloth');
  }
};

exports.getClothByPartyID = async (req, res) => {
  try {
    const party = await PartyModel.getPartyById(req.params.id);
    const ret = [];
    for (let i = 0; i < party.cloth.length; i++) {
      try {
        const cloth = await ClothModel.getClothByID(party.cloth[i]);
        ret.push(await edit_cloth(cloth));
      } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching cloth');
      }
    }
    res.json(ret.sort((a, b) => b.date - a.date));
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching party');
  }
};

exports.getClothByUserID = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.id);
    const { onParty } = req.query;
    const ret = [];
    for (let i = 0; i < user.my_clothes.length; i++) {
      try {
        const cloth = await ClothModel.getClothByID(user.my_clothes[i]);
        ret.push(await edit_cloth(cloth));
      } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching cloth');
      }
    }
    if (onParty == 'true') {
      console.log('true');

      const edit_item = ret.filter((e) => 'party' in e);
      res.json(edit_item.sort((a, b) => b.date - a.date));
      return;
    } else if (onParty == 'false') {
      console.log('false');

      const edit_item = ret.filter((e) => !('party' in e));
      res.json(edit_item.sort((a, b) => b.date - a.date));
      return;
    } else {
      res.json(ret.sort((a, b) => b.date - a.date));
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching user');
  }
};

exports.getClothLike = async (req, res) => {
  try {
    const cloth = await ClothModel.getClothByID(req.params.clothid);
    if (cloth) {
      const item = await edit_cloth(cloth);
      res.json({ likes: item.likes, liked_users: item.liked_users });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching cloth');
  }
};

exports.toggleClothLike = async (req, res) => {
  try {
    const cloth = await ClothModel.getClothByID(req.params.clothid);
    const user = await UserModel.getUserById(req.params.userid);
    for (let i = 0; i < cloth.liked_users.length; i++) {
      if (req.params.userid == cloth.liked_users[i]) {
        cloth.likes--;
        cloth.liked_users.splice(i, 1);
        for (let j = 0; j < user.liked_clothes.length; j++) {
          if (req.params.clothid == user.liked_clothes[j]) {
            user.liked_clothes.splice(j, 1);
          }
        }
        delete cloth.id;
        delete user.id;
        await ClothModel.updateCloth(req.params.clothid, cloth);
        await UserModel.updateUser(req.params.userid, user);
        res.json(cloth);
        return;
      }
    }
    cloth.liked_users.push(req.params.userid);
    user.liked_clothes.push(req.params.clothid);
    cloth.liked_users = [...new Set(cloth.liked_users)]; // 중복 제거
    cloth.likes = cloth.liked_users.length;
    user.liked_cloths = [...new Set(user.liked_clothes)]; // 중복 제거
    delete cloth.id;
    delete user.id;
    await ClothModel.updateCloth(req.params.clothid, cloth);
    await UserModel.updateUser(req.params.userid, user);
    res.json(cloth);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching cloth or user');
  }
};

exports.uploadCloth = async (req, res) => {
  try {
    const data = req.body.jsonData;
    const jsonData = JSON.parse(data);
    if (!req.file) {
      return res.status(400).send({ error: 'No file uploaded.' });
    }
    const fileInfo = {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    };
    if (!jsonData || Object.keys(jsonData).length === 0) {
      return res.status(400).send({ error: 'No JSON data provided.' });
    }
    const id = await ClothModel.createCloth(jsonData);
    const fileName = `${'cloth/cloth'}${id.id}${path.extname(fileInfo.originalName)}`;
    const fileName2 = `${'cloth'}${id.id}${path.extname(fileInfo.originalName)}`;
    const currentTimestamp = Timestamp.now();
    const doc = await db.collection('counters').get('clothIdCounter');
    const data1 = doc.docs[0].data();
    const clothid = data1.lastClothId;
    data1.lastClothId = clothid + 1;
    jsonData.id = clothid + 1;
    jsonData.upload_date = currentTimestamp;
    jsonData.image = fileName2;
    jsonData.liked_users = [];
    jsonData.likes = 0;
    await ClothModel.updateCloth(id.id, jsonData);
    await db
      .collection('counters')
      .doc('clothIdCounter')
      .set(data1, { merge: true });
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: fileInfo.mimeType,
      },
    });
    stream.on('error', (error) => {
      console.error('Error uploading file:', error);
      res.status(500).send({ error: 'Failed to upload file.' });
    });

    stream.on('finish', async () => {
      // 파일 업로드 완료 후 URL 생성
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.status(200).send({
        message: 'File and JSON data uploaded successfully.',
        documentId: id.id,
        fileUrl: publicUrl,
      });
    });
    stream.end(req.file.buffer);
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to process json data.');
  }
};
