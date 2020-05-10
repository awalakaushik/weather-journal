/* Global Variables */

// Create a new date instance dynamically with JS
const d = new Date();

// fetch project data
async function getProjectData () {
  try {
  
    const response = await fetch("/api/projectData");
    
    const body = await response.json();
    
    return body;

  } 
  catch (error) {
    
    console.log("Error while fetching project Data: " + error);
  
  };
};

function createEntryFragment(projectData) {
    
    const entryFragment = document.createDocumentFragment();

    const entryDate = document.createElement("div");
    const entryTemperature = document.createElement("div");
    const entryContent = document.createElement("div");

    entryDate.id = "date";
    entryTemperature.id = "temp";
    entryContent.id = "content";

    entryDate.innerHTML = `<strong>Entry date: </strong>${d.toISOString()}`;
    entryTemperature.innerHTML = `<strong>Entry temperature: </strong>${projectData.tempInFarenheit} &#8457;`;
    entryContent.innerHTML = `<strong>User Feeling: </strong>${projectData.userFeeling}<hr />`;
    
    entryFragment.appendChild(entryDate);
    entryFragment.appendChild(entryTemperature);
    entryFragment.appendChild(entryContent);

    return entryFragment;
}

// dynamically update the UI after fetching the project data
const updateUI = async () => {
  try {
    // clear input fields
    const zipCode = document.querySelector("#zip");
    const userFeeling = document.querySelector("#feelings");
    zipCode.value = "";
    userFeeling.value = "";

    // get project data
    const projectData = await getProjectData();

    // add entry fragment to html
    const entryFragment = createEntryFragment(projectData);

    // update viewport
    const entryHolder = document.querySelector("#entryHolder");
    entryHolder.insertBefore(entryFragment, entryHolder.querySelector("#date"));
  }
  catch (error) {
    console.log("Error occurred while updating the UI:  " + error);
  };
};

async function postProjectData () {
  
  // fetch user values
  const postData = {
    zip: document.querySelector("#zip").value,
    userFeeling: document.querySelector("#feelings").value
  };
  // use fetch to make POST if data present in both form fields
  if (postData.zip && postData.userFeeling) {
    try {
      
      const url = "/api/projectData";
      
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        crendentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });
      
      updateUI();

    } catch (error) {
      console.log("postProjectDataAPI error:  " + error);
    };
  };
};


function onGenerateButtonClickEvent() {
  const button = document.querySelector("#generate");
  button.addEventListener("click", function () { setTimeout(postProjectData, 0) } );
};

onGenerateButtonClickEvent();