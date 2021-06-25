import React, {useState} from 'react';
import App from '../app';
import Breadcrumb from '../common/breadcrumb';
import { AddOfferItem } from './add-offer-item';
import {ItemList} from "./item-list";
export function CreateOffer(props) {
    const [variances, setVariances] = useState([]);
    const addItem = (items)=>{
        setVariances(variances.push(items.variance));
        console.log(variances);
    }
    return <App>
        <Breadcrumb title={'create'} parent="offer" />
        <div className="container-fluid">
            <div className="card">
                <AddOfferItem addItem={addItem} />
            </div>
            <div className="card">
                <ItemList items={variances}/>)
            </div>
        </div>
    </App>
}
