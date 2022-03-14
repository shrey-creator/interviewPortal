const express = require('express');
const path = require('path');
const nodemailer = require("nodemailer");

let {participantsSchema,interviewerSchema,intervieweeSchema}=require("../config");;
const app = express()
const port = 3000

app.use(express.json());

app.use(express.static('client'));

async function main(interviewee,interviewer,startTime,endTime) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "shrey.agrawal003@gmail.com", // generated ethereal user
     
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'shrey.agrawal003@gmail.com', // sender address
    to: `${interviewer}, ${interviewee}`, // list of receivers
    subject: "Invitation for interview", // Subject line
    text: `hi, Your interview has been scheduled from ${startTime} and ${endTime}`, // plain text body
    html: "", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com
}
app.post('/sendMail', async(req, res) => {
  let participantData=req.body;
  let interviewee=participantData.intervieweeEmail;
  let starTime=participantData.startTime;
  let endTime=participantData.endTime;
  let interviewer=participantData.interviewerEmail;
  // console.log(req.body);
  console.log("sending msgs");
  //sending to interviewee
  // console.log(interviewee);
   main(interviewee,interviewer,starTime,endTime).catch(console.error);
    res.send({msg:"message sent"})
  

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
