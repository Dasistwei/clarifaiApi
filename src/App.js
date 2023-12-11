import "./App.css"    
import { useState } from 'react'

const fetchData = (url)=>{
  const PAT = '1c6bbf9c18bb4aa6ad782327254fc4f5'; 
  const USER_ID = '6v2t4fx14ndt';       
  const APP_ID = 'test1';
  const MODEL_ID = 'face-detection';
  // const IMAGE_URL = "https://media.istockphoto.com/id/1729603565/photo/multicultural-young-people-smiling-together-at-camera-outside-happy-friends-taking-selfie-pic.jpg?s=612x612&w=0&k=20&c=HbXFCmBGD57FwdVSS8_HmOlwg4vQ01qNlAu-7EmN4oo=";  
  const IMAGE_URL = url;  
  
  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });
  
  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };
  
  
  const data = fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
  .then(response => response.json())
  .then(data => data.outputs[0].data.regions)
  return data

}

const detectFace = (data, inputImage) =>{
  return data.map((boundingBox, i)=>{
    boundingBox = boundingBox.region_info.bounding_box
    const box = {
        left: boundingBox.left_col * Number(inputImage.width),
        right:Number(inputImage.width) - boundingBox.right_col,
        top:boundingBox.top_row * Number(inputImage.height),
        bottom:Number(inputImage.height) - boundingBox.bottom_row
      }
    // console.log(box)
    return(
      <div 
        key = {i}
        className="bounding-box"
        style={{
          top: box.top,
          bottom: box.bottom,
          left: box.left,
          right: box.right,
          }}
      ></div>        
    )
  })
  
}

function App() {
  const [url, setUrl] = useState("https://media.istockphoto.com/id/1729603565/photo/multicultural-young-people-smiling-together-at-camera-outside-happy-friends-taking-selfie-pic.jpg?s=612x612&w=0&k=20&c=HbXFCmBGD57FwdVSS8_HmOlwg4vQ01qNlAu-7EmN4oo=")
  const [results, setResults] = useState(null)
  const inputImage = document.getElementById("input-image")
  // console.log(inputImage)
  
  const handleClick = ()=>{
    fetchData(url)
    .then(data=>{
      console.log(inputImage.width)
      setResults(detectFace(data, inputImage))
    }
      )
  }
  // url&&console.log(url)
  // console.log('data',results)
  return (
    <div className="App">
      <input type="text" 
        onChange={(e)=>{
          setUrl(e.target.value)
          setResults(null)

          }}/>
      <button onClick={handleClick}>submit</button>
      <div className="output-div">
      {url&&
        <img id="input-image" src={url} width="500px" height='auto' alt="pic" />
      }
        {results}
      </div>
    </div>
  );
}


export default App;
