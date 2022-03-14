const express = require('express');
const path = require('path');

let {participantsSchema,interviewerSchema,intervieweeSchema}=require("../config");;
const app = express()
const port = 3000

app.use(express.json());

app.use(express.static('client'));
console.log(path.join(process.cwd(),'/config.js'))
app.get('/', (req, res) => {
// // var path=
//   console.log();
//    res.sendFile(path.join(__dirname, '../client/index.html'));
// res.send("hello")
});

app.post('/createParticipant',async(req,res)=>{
  try
  {
   const data=req.body;
  //  console.log(data);
   await participantsSchema.add(data);
   res.send({msg:"Participant added"});
  }
  catch(e)
  {
    res.send({msg:e});
  }
  
});

app.post('/createInterviewer',async(req,res)=>{
  try
  {
    console.log("creating interviewer schema");
   const data=req.body;
    console.log(data);
   await intervieweeSchema.add(data);
   res.send({msg:"intervieweee added"});
  }
  catch(e)
  {
    res.send({msg:e});
  }
  
});

app.post('/createInterviewee',async(req,res)=>{
  try
  {
   const data=req.body;
   console.log("creating interviewee schema");
  console.log(data);
   await intervieweeSchema.add(data);
   res.send({msg:"Interviewee added"});
  }
  catch(e)
  {
    res.send({msg:e});
  }
  
});

app.listen(process.env.PORT||3000, () => {
  console.log(`Example app listening on port ${port}`)
});