import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import "./MyEditor.css";

function MyEditor(props) {
  const [image, setImage] = useState(props.banner)
  const [zoom, setZoom] = useState(1)
  const [cropData, setCropData] = useState("");
  const [cropper, setCropper] = useState();
  
  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    }
    else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      props.setImageBanner(cropper.getCroppedCanvas().toDataURL())
    }
  };

  const changeZoom = (e)=>{
    cropper.scale(e.target.value, e.target.value)
  }

  return (
    <div>
        <input type="file" onChange={onChange} />
        <input type="submit" onClick={getCropData} value="salvar" />
        <input type="submit" onClick={()=>{props.setShowMyEditor(false)}} value="fechar" />
        <input
          type="range"
          onChange={changeZoom}
          min='1'
          max="2"
          step="0.01"
          defaultValue="1"
        />
        <div className="cropper-container">
          <Cropper
            style={{ minHeight: '400px', height: 'auto', width: "auto", margin: '0 auto' }}
            aspectRatio={3 / 1}
            cropBoxResizable={false}
            cropBoxMovable={false}
            movable={true}
            autoCrop={true}
            autoCropArea={1}
            src={image}
            viewMode={2}
            guides={false}
            dragMode="move"
            background={false}
            responsive={true}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => {
              setCropper(instance);
            }}
          />
      </div>
    </div>
  )
}

export default MyEditor;
