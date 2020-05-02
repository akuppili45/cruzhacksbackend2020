import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import { Agent } from 'https';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore(); // Add this
const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.get('/warmup', (request, response) => {
    console.log("waqrmeinfg up")
    response.send('Warming up friend.');

});
interface Hacker{
  name: String,
  age: Number,
  gender: String, 
  other?: String
  gradYear?: Number,
  ucscStudent: Boolean,
  collegeAffiliation?: String, 
  firstHackathon: Boolean,
  participReason: String,
  transportHelp: Boolean,
  specialAccommodations: String
}

app.post('/hacker', async (request, response) => {
  try {
    // const { name, age, gender, other, gradYear, ucscStudent, collegeAffiliation, firstHackathon, participReason, transportHelp, specialAccommodations } = request.body;
    // const data: Hacker = {
    //   name, age, gender, other, gradYear, ucscStudent, collegeAffiliation, firstHackathon, participReason, transportHelp, specialAccommodations
    // } 
    console.log("nhehhehehehhe");
    const data = {name: request.body['name'], age: request.body['age'], gender: request.body['gender']};
    const hackerRef = await db.collection('hackers').add(data);
    const hacker = await hackerRef.get();
    
    response.json({
      id: hackerRef.id,
      data: hacker.data()
    });

  } catch(error){

    response.status(500).send(error);

  }
});

app.get('/hacker/:id', async (request, response) => {
  try {
    const hackerId = request.params.id;

    if (!hackerId) throw new Error('Fight ID is required');

    const hacker = await db.collection('fights').doc(hackerId).get();

    if (!hacker.exists){
        throw new Error('Fight doesnt exist.')
    }

    response.json({
      id: hacker.id,
      data: hacker.data()
    });

  } catch(error){

    response.status(500).send(error);

  }
});

app.get('/hackers', async (request, response) => {
  try {

    const hackerQuerySnapshot = await db.collection('fights').get();
    const hackers = [];
    hackerQuerySnapshot.forEach(
        (doc) => {
            hackers.push({
                id: doc.id,
                data: doc.data()
            });
        }
    );

    response.json(hackers);

  } catch(error){

    response.status(500).send(error);

  }

});

app.put('/hackers/:id', async (request, response) => {
  try {

    const hackerId = request.params.id;
    const title = request.body.title;

    if (!hackerId) throw new Error('id is blank');

    if (!title) throw new Error('Title is required');

    const data = { 
        title
    };
    const hackerRef = await db.collection('fights')
        .doc(hackerId)
        .set(data, { merge: true });

    response.json({
        id: hackerId,
        data
    })


  } catch(error){

    response.status(500).send(error);

  }

});

app.delete('/hackers/:id', async (request, response) => {
  try {

    const hackerId = request.params.id;

    if (!hackerId) throw new Error('id is blank');

    await db.collection('fights')
        .doc(hackerId)
        .delete();

    response.json({
        id: hackerId,
    })


  } catch(error){

    response.status(500).send(error);

  }

});