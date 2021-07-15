import React, {useEffect, useState} from 'react';
import App from '../app';
import Breadcrumb from '../common/breadcrumb';
import { AddOfferItem } from './add-offer-item';
import {ItemList} from "./item-list";
import updateFileStorage from "../common/file-storage";
import FetchData from "../common/get-data";
export function CreateOffer(props) {
    const [variances, setVariances] = useState([]);
    let [offerInfo, setOfferInfo] = useState();
    let [uploadIds, setUploadIds] = useState([]);
    let [files, setFiles] = useState([]);
    const [itemsKey, setItemsKey] = useState(Math.random()*100);
    const { id } = props.match.params;
    useEffect( () => {
      if(Number(id) > 0){
           fetch(`/api/offers/${id}`, {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json',
              },
              cache: 'no-cache',
              redirect: 'follow',
          })
              .then(async res => {
                  const response = await res.json();
                  if (response.code === 200) {
                      setOfferInfo({
                          id: response.data.offer.id,
                          name: response.data.offer.name,
                          total_price: response.data.offer.total_price,
                          description: response.data.offer.description,
                          start_date: response.data.offer.start_date,
                          end_date: response.data.offer.end_date,
                          stock: response.data.offer.stock
                      });
                      setVariances(JSON.parse(response.data.offer.offer_detail));
                      setFiles(response.data.images)
                      setItemsKey(Math.random()*100);
                  } else {

                  }
              })
      }
    }, []);
    const addItem = (items)=>{
        setOfferInfo(items.offerInfo);
        if(items.variance){
            setVariances(variances.concat({
                id: items.variance.value,
                name: items.variance.label,
                quantity: 1,
                price: items.offerInfo.total_price
            }));
        }
        setUploadIds(items.uploadIds);
        // setItemsKey(Math.random()*100);
    }
    const removeItem = (index) =>{
        variances.splice(index, 1);
        setVariances(variances);
        setItemsKey(Math.random()*100);
    }
    const handleSubmit=(offerDetail, status) =>{
         const variances = offerDetail.map( x=>{
             return {
                 id: x.value,
                 name: x.name,
                 price: x.price,
                 quantity: x.quantity,
                 shopType: x.shopType,
                 categoryId: x.categoryId,
                 productId: x.productId
             }
         });
         offerInfo = {
             ...offerInfo,
             offer_detail: JSON.stringify(variances),
             status: status
         }
         let method = 'POST';
         let url = '/api/offers/';
         if(Number(id > 0)){
             method = 'PUT';
             url = `/api/offers/update/${Number(id)}`
         }
        fetch(url, {
            method: method,
            body: JSON.stringify(offerInfo),
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache',
            redirect: 'follow',
        }).then(async res => {
            const response = await res.json();
            if (response.code === 200) {
                let items = []
                await uploadIds.forEach(x => {
                    items.push({
                        id: Number(x),
                        url: '',
                        type: 'offer',
                        type_id: response.data.id,
                        microService: 'product'
                    });
                });
                if (items.length === 0) {
                    window.location.href = `/offer/list/`;
                    return;
                }
                await updateFileStorage(items).then(response => {
                    window.location.href = `/offer/list/`;
                });

            }

        })
            .catch(error => {

            })
    }
    return <App>
        <Breadcrumb title={'create'} parent="offer" />
        <div className="container-fluid">
            <div className="card">
                <AddOfferItem key ={itemsKey} images ={files} offerInfo={offerInfo} addItem={addItem} />
            </div>
            <div className="card">
                {variances?.length > 0 &&<ItemList key={itemsKey} offer={offerInfo} items={variances} deleteItem = {removeItem}
                 handleSubmit = {handleSubmit}/>}
            </div>
        </div>
    </App>
}
