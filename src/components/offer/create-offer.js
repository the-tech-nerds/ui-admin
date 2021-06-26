import React, {useState} from 'react';
import App from '../app';
import Breadcrumb from '../common/breadcrumb';
import { AddOfferItem } from './add-offer-item';
import {ItemList} from "./item-list";
export function CreateOffer(props) {
    const [variances, setVariances] = useState([]);
    const [offerInfo, setOfferInfo] = useState();
    const [itemsKey, setItemsKey] = useState(Math.random()*100);
    const addItem = (items)=>{
        debugger
        setOfferInfo(items.offerInfo);
        setVariances(variances.concat({
            ...items.variance,
            quantity: 1,
            price: items.offerInfo.price
        }));
    }
    const removeItem = (index) =>{
        variances.splice(index, 1);
        setVariances(variances);
        setItemsKey(Math.random()*100);
    }
    return <App>
        <Breadcrumb title={'create'} parent="offer" />
        <div className="container-fluid">
            <div className="card">
                <AddOfferItem addItem={addItem} />
            </div>
            <div className="card">
                <ItemList key={itemsKey} offer={offerInfo} items={variances} deleteItem = {removeItem}/>
            </div>
        </div>
    </App>
}
