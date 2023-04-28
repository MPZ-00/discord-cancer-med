const { MongoClient } = require('mongodb');
const fs = require('fs');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { Leveling } = require('../../../../tools/schema.js');

console.log(`${context.params.event.member.user.username}> just triggered the /test-manager-leveling command!`)
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${context.params.event.member.user.id}> just triggered the **/test-manager-leveling** command!`
});

let connected = false

await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `connected: ${connected}`
});

const credentials = '../../../../X509-cert.pem' // '<path_to_certificate>'
const client = new MongoClient('mongodb+srv://cmedbyte.tfksr.mongodb.net/leveling?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  sslKey: credentials,
  sslCert: credentials
});

async function run() {
  try {
    await client.connect();
    const database = client.db("leveling");
    const collection = database.collection("levelings");
    const docCount = await collection.countDocuments({});
    console.log(docCount);
    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
// await test()

async function test() {
  // mongosh "mongodb+srv://cmedbyte.tfksr.mongodb.net/leveling?authSource=%24external&authMechanism=MONGODB-X509" --tls --tlsCertificateKeyFile <path to PEM file>
  // mongosh "mongodb+srv://cmedbyte.tfksr.mongodb.net/leveling?authSource=%24external&authMechanism=MONGODB-X509" --tls --tlsCertificateKeyFile '../../../../X509-cert.pem'
  
  // await mongoose.connect('mongodb+srv://cmedbyte.tfksr.mongodb.net/leveling?authSource=%24external&authMechanism=MONGODB-X509', {tls: true, tlsCertificateKeyFile: 'https://autocode.com/p/mpz-00/discord-cancer-med/dev/?filename=X509-cert.pem'})
  
  let mongoOpt = {
    "sslValidate": false,
    "sslKey": fs.readFileSync('../../../../X509-cert.pem')
  }
  console.log('sslKey: ', mongoOpt.sslKey)
  await mongoose.connect('mongodb+srv://cmedbyte.tfksr.mongodb.net?ssl=true', mongoOpt)
  
  //if(!mongoose.connection.readyState) await mongoose.connect('mongodb+srv://cmedbyte.tfksr.mongodb.net/leveling', {tlsCertificateKeyFile: 'X509-cert.pem'}); // /leveling?retryWrites=true&w=majority
  console.log('mongoose.connection:', mongoose.connection)
}