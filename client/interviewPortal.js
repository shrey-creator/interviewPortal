let scheduleInterviewBtn= document.getElementById("scheduleBtn");
scheduleInterviewBtn.onclick=onScheduleClick;
onLoad();
function onLoad()
{
    let allparicipants=getParticipantsSchema();
    allparicipants.forEach((participant)=>{
    addInterviewToTable(participant);
    })
}


function onScheduleClick()
{
    let intervieweeEmail=document.getElementById("interviewee").value;
    let interviewerEmail=document.getElementById("interviewer").value;
    let startTime=document.getElementById("startTime").value;
    let endTime=document.getElementById("endTime").value;

    let participantData={
        intervieweeEmail,
        interviewerEmail,
        startTime,
        endTime
    };
 
    
    if(checkDataValadity(participantData))
    {
        clearErrorField();
    saveParticipantData(participantData);
    saveIndividualSchema(participantData,"intervieweeSchema");
    saveIndividualSchema(participantData,"interviewerSchema");
    addInterviewToTable(participantData);
    clearInputFields();
    }
    
}

// getter methods
function getParticipantsSchema()
{
    let participantSchema=JSON.parse(localStorage.getItem("participantSchema"));
    if(participantSchema)
    return participantSchema;

    return [];
}
function saveParticipantData(participantsData)
{
    let allparticipantsData=getParticipantsSchema();
    allparticipantsData.push(participantsData);
    localStorage.setItem("participantSchema",JSON.stringify(allparticipantsData));
    

}


function getSchema(schemaName)
{
    let intervieweeSchema=JSON.parse(localStorage.getItem(schemaName));
    if(intervieweeSchema)
    return intervieweeSchema;

    return {};
}

function getIndividualDetails(participantData,schemaName)
{
    let schema=getSchema(schemaName);
    if(schema)
    {
    let interviewTiming=[participantData.startTime,participantData.endTime];
    let emailTosave;
    if(schemaName==="intervieweeSchema")
    {
    emailTosave=participantData.intervieweeEmail;
    }
    else
    emailTosave=participantData.interviewerEmail;
    let entryData=schema[emailTosave];
    return {schema,interviewTiming,emailTosave,entryData};
}
}
function getParticipantDiv(interviewData)
{
    let data_div=document.createElement("tr");
    
    let intervieweeEmail=document.createElement("td");
    intervieweeEmail.setAttribute("class","intervieweeEmail");
    intervieweeEmail.innerHTML=interviewData.intervieweeEmail;
    let interviewerEmail=document.createElement("td");
    interviewerEmail.setAttribute("class","interviewerEmail");
    interviewerEmail.innerHTML=interviewData.interviewerEmail;
    

    let startTime=document.createElement("td");
    startTime.setAttribute("class","startTime");
    startTime.innerHTML=interviewData.startTime;
    let endTime=document.createElement("td")
    endTime.setAttribute("class","endTime");;
    endTime.innerHTML=interviewData.endTime;
    let td_edit=document.createElement("td");
    let editBtn=document.createElement("button");
    editBtn.innerHTML="EDIT";
    editBtn.onclick=function(eve)
    {
        onEdit(eve);
    };;
    td_edit.appendChild(editBtn);
    let td_delete=document.createElement("td");
    let DeleteBtn=document.createElement("button");
    DeleteBtn.onclick=function(eve)
    {
        onDelete(eve);
    };
    DeleteBtn.innerHTML="DELETE";
    td_delete.appendChild(DeleteBtn);

    data_div.appendChild(interviewerEmail);
    data_div.appendChild(intervieweeEmail);
    
    data_div.appendChild(startTime);
    data_div.appendChild(endTime);
    data_div.appendChild(td_delete);
    data_div.appendChild(td_edit);
    
    return data_div;
    
}

//                              saving data to database
function saveIndividualSchema(participantData,schemaName)
{
    let {schema,interviewTiming,emailTosave,entryData}=getIndividualDetails(participantData,schemaName);
   
    if(entryData)
    {
        // TODO: check if there is clash in timing
        entryData.timing.push(interviewTiming);
    }
    else
    {
        schema[emailTosave]={
            timing:[interviewTiming]
        };

    }
    localStorage.setItem(schemaName,JSON.stringify(schema));
}


//  check if interviewee or interviewer is free for interview
function isIndividualBusy(individualData,schemaName)
{
    let individualSchema=getSchema(schemaName);
    let individual="";
    if(individualSchema)
    {
    if(schemaName=="intervieweeSchema")
    individual=individualSchema[individualData.intervieweeEmail];
    else
    individual=individualSchema[individualData.interviewerEmail];
    
    if(individual)
    {
    let interviewTimings=individual.timing;
    let flag=0;
    if(interviewTimings)
    interviewTimings.forEach((timing)=>{
        if((individualData.startTime>=timing[0] && individualData.startTime<=timing[1]) || (individualData.endTime>=timing[0] && individualData.endTime<=timing[1]) )
        {
            console.log('individual busy');
            flag=1;
        }
    });

    if(flag==1)
    return true;
    }

    }
    return false;

}

function checkDataValadity(interviewData)
{
    if(!interviewData.startTime)
    {
        showErrorMessage("Please select a start time");
        return false;
    }
    else if(!interviewData.endTime)
    {
        showErrorMessage("Please select a end time");
        return false;
    }
    else if(interviewData.startTime>interviewData.endTime)
    {
        showErrorMessage("Please select valid start and end time");
        return false;
    }
    else if(interviewData.intervieweeEmail=='' || interviewData.interviewerEmail=='')
    {
        showErrorMessage("Number of participant can not be less than 2");
        return false;
    }
    else if(isIndividualBusy(interviewData,"intervieweeSchema"))
    {
        showErrorMessage("Interviewee has another interview");
        return false;
    }
    else if(isIndividualBusy(interviewData,"interviewerSchema"))
    {
        showErrorMessage("Interviewer has another interview");
        return false;
    }

    return true;

}


function addInterviewToTable(interviewData)
{
    let tr1=getParticipantDiv(interviewData);
    let tableList=document.getElementById("intervieeList");
    tableList.appendChild(tr1);
}



// util methods
function saveSchema(data,schemaName)
{
    localStorage.setItem(schemaName,JSON.stringify(data));
}
function showErrorMessage(errorMessage)
{
    let error_para=document.getElementById("errorMessage");
    error_para.innerHTML=errorMessage;
}
function clearErrorField()
{
    let error_para=document.getElementById("errorMessage");
    error_para.innerHTML='';
}
function clearInputFields()
{
    let startTime=document.getElementById("startTime");
    let endTime=document.getElementById("endTime");
    startTime.value="";
    endTime.value="";

}

// method used to edit
function onEdit(event)
{
    //getting all values from table
    let data_row=event.path[2];
    let interviewerEmail=data_row.querySelector(".interviewerEmail").innerHTML;
    let intervieweeEmail=data_row.querySelector(".intervieweeEmail").innerHTML;
    let startTime= data_row.querySelector(".startTime").innerHTML;
    let endTime=data_row.querySelector(".endTime").innerHTML;
    
    let participantData={
        intervieweeEmail,
        interviewerEmail,
        startTime,
        endTime
    };

    //assigning all values to input field
    document.getElementById("interviewee").value=participantData.intervieweeEmail;
    document.getElementById("interviewer").value=participantData.interviewerEmail;
    document.getElementById("startTime").value=participantData.startTime;
    document.getElementById("endTime").value=participantData.endTime;
    scheduleToEdit();
    scheduleInterviewBtn.onclick=function()
    {
        onScheduleEdit(event,participantData);
    };


}
function editDatabase(participantData,newPariticipantData)
{
    
    editParticipantSchema(newPariticipantData,participantData);
   
    editIndividualSchema(newPariticipantData,participantData,"intervieweeSchema");
    editIndividualSchema(newPariticipantData,participantData,"interviewerSchema");
}

function editIndividualSchema(participantToEdit,oldParticipant,schemaName)
{
    let individualSchema=getSchema(schemaName);
    let indivdualEmail;
    if(schemaName==="intervieweeSchema")
    indivdualEmail=participantToEdit.intervieweeEmail;
    else
    indivdualEmail=participantToEdit.interviewerEmail;

    let individualData=individualSchema[indivdualEmail];
    let interviewTiming=individualData?individualData.timing:[];
    let newTiming=[participantToEdit.startTime,participantToEdit.endTime];
    interviewTiming.push(newTiming);
   individualSchema[indivdualEmail]={timing:[]};
    individualSchema[indivdualEmail].timing=interviewTiming;
    console.log(interviewTiming);
    saveSchema(individualSchema,schemaName);
    

}
function editParticipantSchema(editedParticipant,participantToEdit)
{
    let allparicipants=getParticipantsSchema();
    allparicipants.push(editedParticipant);
    //participants schema
    // let revisedParticipants=allparicipants.map((participant)=>{
    //     if(JSON.stringify(participant)===JSON.stringify(participantToEdit))
    //     {
    //         return editedParticipant;
    //     }
    //     return participant;
    // });
    // console.log(revisedParticipants);
    saveSchema(allparicipants,"participantSchema");

}

function modifyUIonEdit(event)
{
    let data_row=event.path[2];
    // console.log(data_row);
    data_row.querySelector(".intervieweeEmail").innerHTML=document.getElementById("interviewee").value;
    data_row.querySelector(".interviewerEmail").innerHTML=document.getElementById("interviewer").value;
    data_row.querySelector(".startTime").innerHTML=document.getElementById("startTime").value;
   data_row.querySelector(".endTime").innerHTML=document.getElementById("endTime").value;
}
function onScheduleEdit(event,participantData)
{
    // get all values of changed input fields
    let interviewerEmail=document.getElementById("interviewer").value;
    let intervieweeEmail=document.getElementById("interviewee").value;
    let startTime= document.getElementById("startTime").value;
    let endTime=document.getElementById("endTime").value;
    let newPariticipantData={
        intervieweeEmail,
        interviewerEmail,
        startTime,
        endTime
    };

    deleteInDatabase(participantData);

    if(checkDataValadity(newPariticipantData))
    {
        clearErrorField();
         modifyUIonEdit(event);
        editDatabase(participantData,newPariticipantData);
        editToSchedule();
        clearInputFields();
        scheduleInterviewBtn.onclick=onScheduleClick;
    }
}
function scheduleToEdit()
{
    let mainHeading=document.getElementById("main-header");
    mainHeading.innerHTML="Edit a Interview";
    scheduleInterviewBtn.innerHTML="Edit Interview"
}
function editToSchedule()
{
    let mainHeading=document.getElementById("main-header");
    mainHeading.innerHTML="Schedule a Interview";
    scheduleInterviewBtn.innerHTML="Schedule Interview"
}

// methods used for deleting in databases

function deleteInDatabase(participantToDelete)
{
    let allparicipants=getParticipantsSchema();
    //participants schema
    let revisedParticipants=allparicipants.filter((participant)=>{
        if(JSON.stringify(participant)===JSON.stringify(participantToDelete))
        {
            return false;
        }
        return true;
    });
    //intervieweeSchema
    
     saveSchema(revisedParticipants,"participantSchema");
    deleteIndividualSchema(participantToDelete,"intervieweeSchema");
    deleteIndividualSchema(participantToDelete,"interviewerSchema");
   
}

function deleteIndividualSchema(participantToDelete,schemaName)
{
    let individualSchema=getSchema(schemaName);
    let indivdualEmail;
    if(schemaName==="intervieweeSchema")
    indivdualEmail=participantToDelete.intervieweeEmail;
    else
    indivdualEmail=participantToDelete.interviewerEmail;
    
    let individualData=individualSchema[indivdualEmail];
    if(individualData)
    {
    let interviewTiming=individualData.timing;
    let timingToDelete=[participantToDelete.startTime,participantToDelete.endTime];
    let revisedTiming=interviewTiming.filter((timing)=>{
        console.log(timing);
        console.log(timingToDelete);
        if(JSON.stringify(timing)===JSON.stringify(timingToDelete))
        {
            return false;
        }
        return true;
    });
    individualSchema[indivdualEmail].timing=revisedTiming;
    console.log(individualSchema);
    saveSchema(individualSchema,schemaName);
}
    

}
function onDelete(event)
{
    //deleting in UI
    let data_row=event.path[2];
    let table=event.path[3];
    table.removeChild(data_row);
    

    let interviewerEmail=data_row.querySelector(".interviewerEmail").innerHTML;
    let intervieweeEmail=data_row.querySelector(".intervieweeEmail").innerHTML;
    let startTime= data_row.querySelector(".startTime").innerHTML;
    let endTime=data_row.querySelector(".endTime").innerHTML;
    //modifying database
    
    let participantData={
        intervieweeEmail,
        interviewerEmail,
        startTime,
        endTime
    };
   
     deleteInDatabase(participantData);
   
  
}











// function getParticipants()
// {
//     let intervieweeName=document.getElementById("interviewee").value;
//     var selected = [];
//     for (var option of document.getElementById('interviewee').options) {
//         if (option.selected) {
//       selected.push(option.value);
//         }
//     }
// return selected;
// }


// function checkIntervieweePresence(intervieweeSchema,interviewee)
// {
//     let isIntervieweePresent=false;
//     intervieweeSchema.map((participant)=>{
//         if(participant.email===interviewee.email)
//         {
//             start_end_time=[interviewee.time[0][0],interviewee.time[0][1]];
    
//             participant.time.push(start_end_time);
//             isIntervieweePresent=true;
//         }
//         return participant
//     });
//     return [isIntervieweePresent,intervieweeSchema];

// }