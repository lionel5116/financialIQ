/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('AssetManagement2022');

//select all documents in the assets collection
use('AssetManagement2022');
db.assets.find({});

use('AssetManagement2022');
db.assets.find( { Type: "Checking" } )

use('AssetManagement2022');
db.notes.find({});

use('AssetManagement2022');
db.notes.find( { Category: "Password" } )

use('AssetManagement2022');
db.notes.find( { Title: "XFINITY" } )

//for like clauses
use('AssetManagement2022');
db.notes.find({ Title: { $regex: "ga", $options: "i" } });

use('AssetManagement2022');
db.notes.find( { Title: "Tmobile" } )

use('AssetManagement2022');
db.notes.find({ Title: { $regex: "TM", $options: "i" } });

//to add a new note
use('AssetManagement2022');
db.notes.insertOne({
  Title: "Mass Mutal - Transocean",
  Category: "Password",
  Note: "Now handling Transoean Pension. PE/BFLU@@123 - Changed on 9/9/2026"
});

use('AssetManagement2022');
db.notes.find({ Title: { $regex: "Rick", $options: "i" } });

//to delete
use('AssetManagement2022');
db.notes.deleteOne({
  _id: ObjectId('6a9867034c95f9c3f2b315c1')
});

use('AssetManagement2022');
db.notes.find({ Title: { $regex: "amz", $options: "i" } });

use('AssetManagement2022');
db.notes.updateOne(
  { _id: ObjectId('62f5b36bb132245d44e5a07a') },
  { $set: { Title: 'AMZ - Primary De Comprass', Note: 'PE/mmc8585**' } }
);

use('AssetManagement2022');
db.getCollectionNames();

db.notes.find({ Title: 'AMZ - Primary De Comprass' });