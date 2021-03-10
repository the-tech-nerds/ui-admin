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
      var json = JSON.parse(xhr.response);
      const data = json.data.data;
      debugger
      const info = JSON.stringify({
        entity_id: data.id,
        folder: content.folder,
        url: data.url,
        serviceName: content.serviceName,
      } );  
      await fetch(`/api/file/${data.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        redirect: 'follow',
        body: info
    })
        .then(async res => {
            this.setState({ loading: false });
            const response = await res.json();
        })
        .catch(error => {
        
        });
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