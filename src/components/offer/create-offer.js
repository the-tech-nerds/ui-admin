import React from 'react';
import App from '../app';
import Breadcrumb from '../common/breadcrumb';
import { AddOfferItem } from './add-offer-item';
export function CreateOffer(props) {
    return <App>
        <Breadcrumb title={'create'} parent="offer" />
        <div className="container-fluid">
            <div className="card">
                <AddOfferItem />
            </div>
        </div>
    </App>
}