import React, {useEffect, useState} from 'react';
import App from '../app';
import Breadcrumb from '../common/breadcrumb';
import { AddOfferItem } from './add-offer-item';
import {ItemList} from "./item-list";
import updateFileStorage from "../common/file-storage";
import {UpdateOffer} from "./update-offer";
export function CreateOffer(props) {
    const [variances, setVariances] = useState([]);
    let [offerInfo, setOfferInfo] = useState(null);
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
                          stock: response.data.offer.stock,
                          shops: response.data.offer?.shops?.map(s =>{
                              return {
                                  value: s.id,
                                  label: s.name
                              }
                          }),
                          status: response.data.offer?.status
                      });
                      setVariances(JSON.parse(response.data.offer?.offer_detail));
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
                id: items.variance.id,
                name: items.variance.name,
                quantity: 1,
                price: items.offerInfo.total_price,
                shopType: items.variance.shopType,
                categoryId:items.variance.categoryId,
                productId: items.variance.productId
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
                 id: x.id,
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
             shops: offerInfo.shops?.map(x=>x.value),
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
        {offerInfo && offerInfo?.status === 0 && <div className="container-fluid">
            <div className="card">
                <AddOfferItem key ={itemsKey} images ={files} offerInfo={offerInfo} addItem={addItem} />
            </div>
            <div className="card">
                {variances?.length > 0 &&<ItemList key={itemsKey} offer={offerInfo} items={variances} deleteItem = {removeItem}
                 handleSubmit = {handleSubmit}/>}
            </div>
        </div>}
        {offerInfo && variances && offerInfo?.status !== 0 && <div className="container-fluid">
           <UpdateOffer offer={offerInfo} items={variances}/>
        </div>}
    </App>
}
