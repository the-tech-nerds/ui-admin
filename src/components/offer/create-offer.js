import React, {useState} from 'react';
import App from '../app';
import Breadcrumb from '../common/breadcrumb';
import { AddOfferItem } from './add-offer-item';
import {ItemList} from "./item-list";
import updateFileStorage from "../common/file-storage";
export function CreateOffer(props) {
    const [variances, setVariances] = useState([]);
    let [offerInfo, setOfferInfo] = useState();
    let [uploadIds, setUploadIds] = useState([]);
    const [itemsKey, setItemsKey] = useState(Math.random()*100);
    const addItem = (items)=>{
        setOfferInfo(items.offerInfo);
        setVariances(variances.concat({
            ...items.variance,
            quantity: 1,
            price: items.offerInfo.total_price
        }));
        setUploadIds(items.uploadIds);
    }
    const removeItem = (index) =>{
        variances.splice(index, 1);
        setVariances(variances);
        setItemsKey(Math.random()*100);
    }
    const handleSubmit=(offerDetail) =>{
         const variances = offerDetail.map( x=>{
             return {
                 id: x.value,
                 name: x.label,
                 price: x.price,
                 quantity: x.quantity,
                 shopType: x.shopType,
                 categoryId: x.categoryId,
                 productId: x.productId
             }
         });
         offerInfo = {
             ...offerInfo,
             offer_detail: JSON.stringify(variances)
         }
        fetch('/api/offers/', {
            method: 'POST',
            body: JSON.stringify(offerInfo),
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache',
            redirect: 'follow',
        }).then(async res => {
            const response = await res.json();
            if (response.code == 200) {
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
                <AddOfferItem addItem={addItem} />
            </div>
            <div className="card">
                <ItemList key={itemsKey} offer={offerInfo} items={variances} deleteItem = {removeItem} handleSubmit = {handleSubmit}/>
            </div>
        </div>
    </App>
}
