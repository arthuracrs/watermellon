import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import "./MyEditor.css";

function MyEditor(props) {
  const [type] = useState(props.type)

  const [image] = useState(props.imageInput)
  const [cropper, setCropper] = useState();
  const [resolution] = useState({
    banner:{
      width: 600,
      height: 200
    },
    avatar:{
      width: 400,
      height: 400
    }
  })

  const [ratio] = useState({
    banner: 3 / 1,
    avatar: 1
  })

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      props.setImageOutput(cropper.getCroppedCanvas(resolution[type]), type)
      props.setShowMyEditor(false)
    }
  };

  const changeZoom = (e) => {
    cropper.scale(e.target.value, e.target.value)
  }

  return (
    <div className="my-editor">
        <div className="cropper-container">
          <Cropper
            style={{ height: '380px', width: "100%", margin: '0 auto' }}
            aspectRatio={ratio[type]}
            cropBoxResizable={false}
            cropBoxMovable={false}
            movable={true}
            autoCrop={true}
            autoCropArea={1}
            zoomOnTouch={false}
            zoomOnWheel={false}
            src={image}
            viewMode={1}
            guides={false}
            dragMode="move"
            checkCrossOrigin={true}
            background={false}
            responsive={true}
            checkOrientation={false} 
            onInitialized={(instance) => {
              setCropper(instance);
            }}
          />
      </div>
      <div className="cropper-controllers">
          <input className="cropper-controllers-save" type="submit" onClick={getCropData} value="salvar" />
          <input
            className="cropper-controllers-slider"
            type="range"
            onChange={changeZoom}
            min='1'
            max="2"
            step="0.01"
            defaultValue="1"
          />
        </div>
    </div>
  )
}

export default MyEditor;
