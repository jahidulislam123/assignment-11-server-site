const express =require('express');
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cli = require('nodemon/lib/cli');
const { ObjectID } = require('bson');

require('dotenv').config();
const app=express();
const port =process.env.PORT||3000;

//MIDDEL WIRE
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0taai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const carCollection = client.db('ford-car').collection('stockCar');
        app.get('/cars',async(req,res)=>{
        const query ={};
        const cursor =carCollection.find(query);
        const carservices =await cursor.toArray();
        res.send(carservices);
        });


        app.get('/car/:id',async(req,res)=>{
           const id =req.params.id;
           const query ={_id:ObjectID(id)};
           const result=await carCollection.findOne(query);
           res.send(result);

        });


        app.post('/cars',async(req,res)=>{
           const newCar  =req.body;
           const result =await carCollection.insertOne(newCar);
           res.send(result);
        })

        //delete 
        app.delete('/car/:id',async(req,res)=>{
            const id=req.params.id;
            const query ={_id:ObjectID(id)}
            const result =await carCollection.deleteOne(query);
            res.send(result);
        })


        // update the car quantity minus for one time 
       
          
          
          app.put('/car/:id' ,async(req,res) =>{
            const id = req.params.id;
            const updateQuantity = req.body;
            const delivery = updateQuantity.quantity -1;
            const filter = {_id:ObjectId(id)}
            const option = { upsert : true}
            const updateDoc ={
              $set:{
              
                quantity : delivery
              
              }
            }
            const result = await carCollection.updateOne(filter,updateDoc,option);
            res.send(result);
          })
        


        //   app.put('/car/:id' ,async(req,res) =>{
        //     const id = req.params.id;
        //     const updateQuantity = req.body;
        //     const filter = {_id:ObjectId(id)}
        //     const option = { upsert : true}
        //     const updateDoc ={
        //       $set:{
              
        //         quantity:updateQuantity.newQuantity
              
        //       }
        //     }
        //     const result = await carCollection.updateOne(filter,updateDoc,option);
        //     res.send(result);
        //   })


        // app.put('/car/:id' ,async(req,res) =>{
        //     const id = req.params.id;
        //     const updateQuantity = req.body;
        //     const filter = {_id:ObjectId(id)}
        //     const option = { upsert : true}
        //     const updateDoc ={
        //       $set:{
              
        //         quantity : updateQuantity.newQuantity
              
        //       }
        //     }
        //     const result = await carCollection.updateOne(filter,updateDoc,option);
        //     res.send(result);
        //   })
          
        // https://stackoverflow.com/questions/72162245/how-i-can-reload-the-authomaticly
          
          
        
          


         
    }
    finally{

    }

}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('running car app');
});
app.listen(port,()=>{
    console.log('listen to port',port);
});


//ford-car
//4nEgHMzJGuxUXKGO