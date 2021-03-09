import { json } from 'body-parser'
import React from 'react'
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
const MyUploader = (props) => {
  // specify upload params and url for your files
  const {content= {}} = props;
  const getUploadParams = async ({ file, meta }) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('fileStoreInfo', JSON.stringify({
      entity: content.entity,
      folder: content.folder,
      entity_id: content.entity_id,
      serviceName: content.serviceName,
    }))
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    return { url: '/api/file/upload',body: formData, config }
  }
  
  // called every time a file's `status` changes
  const handleChangeStatus = async ({ meta, file, xhr  }, status) => {
    if(status == "done") { 
      var json = JSON.parse(xhr.response)
     }
     else if(status == "removed") {
      var json = JSON.parse(xhr.response)    
    }
   }
  
  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    allFiles.forEach(f => f.remove())
  }

  return (
    <div className="">
      <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      // inputWithFilesContent={"Add more"}
      // submitButtonContent={"Save"}
      onSubmit={handleSubmit}
      accept="image/*,audio/*,video/*"
    />
    </div>
    
  )
}

export default MyUploader