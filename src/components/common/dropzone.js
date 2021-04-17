import { json } from 'body-parser'
import React from 'react'
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import ImageGalary from "./imagegalary";
import {DropzoneStatus} from "../../constants/dropzoneStatus"

const MyUploader = (props) => {
  // specify upload params and url for your files
  const dropzoneStyle = {
    width  : "100%",
    height : "20%",
    border : "1px solid black",
    overflow : 'auto !important'
};
  const {content= {}, options: {
      onUploadSuccess = () => {
      },
      images = []
  }} = props;
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
      const json = JSON.parse(xhr.response);
      const model = {
          status: DropzoneStatus.UPLOAD_SUCCESS,
          data: json.data.data
      }
        onUploadSuccess(model);
     }
     else if(status == "removed") {
      var json = JSON.parse(xhr.response);
      const data = json.data.data;
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
            const response = await res.json();
            const model = {
                status: DropzoneStatus.REMOVE_UPLOADED_ITEM,
                data: json.data.data
            }
            onUploadSuccess(model);
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
    <div className="row">
      <div className="col-5">
      <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      inputContent = 'upload or drop'
      accept="image/*,audio/*,video/*"
    />
      </div>
      {images.length >0 && <div className="col-7">
       <ImageGalary options={{
           images: images,
           onDeleteSuccess: async (response) => {
               const info = JSON.stringify({
                   entity_id: response.id,
                   folder: response.type,
                   url: response.url,
                   serviceName: content.serviceName,
               } );
               await fetch(`/api/file/${response.id}`, {
                   method: "DELETE",
                   headers: {
                       'Content-Type': 'application/json',
                   },
                   cache: 'no-cache',
                   redirect: 'follow',
                   body: info
               })
                   .then( res => {
                       const model = {
                           status: DropzoneStatus.REMOVE_EXISTING_ITEM,
                           data: response
                       }
                       onUploadSuccess(model);
                   })
                   .catch(error => {

                   });
           }
       }}/>
      </div>}

    </div>

  )
}

export default MyUploader
