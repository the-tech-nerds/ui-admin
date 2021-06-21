import React, { useState, useEffect } from 'react';
import { Button, Label } from "reactstrap";
import FetchData from '../common/get-data';
import DatePicker from "react-datepicker";
const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 1,
            width: '100%'
        }}
    />
);
export function AddOfferItem(props) {
    const [types, setTypes] = useState([]);
    useEffect(() => {
        FetchData({
            url: '/api/categories/shop/type', callback: (response, isSucess) => {
                if (isSucess) {
                    setTypes(response.data);
                }
            }
        })
    }, []);
    return <div className="row p-2">
        <div className="row col-12">
            <div className="col-4">
                <Label for="shopIds">Name</Label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            </div>
            <div className="col-4">
                <Label for="shopIds">Offer Price</Label>
                <input type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            </div>
            <div className="col-4">
                <Label for="shopIds">Offer Details</Label><br />
                <input type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            </div>
        </div>
        <div className="row col-12">
            <div className="col-4">
                <Label for="shopIds">From</Label><br />
                <DatePicker className="form-control" />
            </div>
            <div className="col-4">
                <Label for="shopIds">To</Label><br />
                <DatePicker className="form-control" />
            </div>
        </div>
        <div className="row col-12 ml-0">
            <ColoredLine color="red" />
        </div>
        <div className="row col-12">
            <div className="col-4">
                <Label for="shopIds">Shop</Label>
                <select className="form-control" name="city">
                    {types.map((option) => (
                        <option value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="col-4">
                <Label for="shopIds">Category</Label>
                <select className="form-control" name="city">
                    {types.map((option) => (
                        <option value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="col-4">
                <Label for="shopIds">Product</Label>
                <select className="form-control" name="city">
                    {types.map((option) => (
                        <option value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="col-4">
                <Label for="shopIds">Varience</Label>
                <select className="form-control" name="city">
                    {types.map((option) => (
                        <option value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="col-4 mt-1">
                <Button className="mt-4" color="primary">Add</Button>
            </div>
        </div>

    </div >
}