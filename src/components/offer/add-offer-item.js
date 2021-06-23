import React, { useState, useEffect } from 'react';
import { Button, Label } from "reactstrap";
import FetchData from '../common/get-data';
import AsyncSelect from 'react-select/async';

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
    const [categories, setCategories] = useState(null);
    const [inputCat, setInputCat] = useState('pen');
    const [offerInfo, setOfferInfo] = useState({
        name: '',
        price: 0,
        details: '',
        fromDate: null,
        toDate: null
    });
    useEffect(() => {
        FetchData({
            url: '/api/categories/shop/type', callback: (response, isSucess) => {
                if (isSucess) {
                    setTypes(response.data);
                }
            }
        })
        FetchData({
            url: '/api/categories/', callback: (response, isSucess) => {
                if (isSucess) {
                    debugger
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    setCategories(options);
                }
            }
        })
    }, []);
    const changeInputHandler = (event) => {
        const value = event.target.value;
        if (event.target.name === 'name') {
            setOfferInfo({
                ...offerInfo,
                name: value
            })
        } else if (event.target.name === 'price') {
            setOfferInfo({
                ...offerInfo,
                price: Number(value)
            })
        } else if (event.target.name === 'details') {
            setOfferInfo({
                ...offerInfo,
                details: value
            })
        } else if (event.target.name === 'fromDate') {
            setOfferInfo({
                ...offerInfo,
                fromDate: value
            })
        } else if (event.target.name === 'toDate') {
            setOfferInfo({
                ...offerInfo,
                toDate: value
            })
        }
    }
    const changeType = (e) => {
        console.log(e.target.value);
    }
    const filterOptions = (inputValue) => {
        if (!inputValue) return categories;
        return categories.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };
    const loadOptions = (inputCat, callback) => {
        setTimeout(() => {
            callback(filterOptions(inputCat));
        }, 1000);
    };
    const onChangeSelectedOption = (e) => {

    };
    const handleInputChange = (newValue) => {
        const inputValue = newValue.replace(/\W/g, '');
        setInputCat(inputValue);
        return inputValue;
    };

    return <div className="row p-2">
        <div className="row col-12">
            <div className="col-6">
                <Label for="shopIds">Name</Label>
                <input type="text" onChange={changeInputHandler} name="name" className="form-control" id="offer_name" value={offerInfo.name} />
            </div>
            <div className="col-4">
                <Label for="shopIds">Offer Price</Label>
                <input type="number" name="price" onChange={changeInputHandler} className="form-control" id="offer_price" value={offerInfo.price} />
            </div>
        </div>
        <div className="row col-12">
            <div className="col-4">
                <Label for="shopIds">Offer Details</Label><br />
                <textarea type="number" name="details" onChange={changeInputHandler} className="form-control" id="offer_details" value={offerInfo.details} />
            </div>
            <div className="col-4">
                <Label for="from">From</Label><br />
                {/* <DatePicker id="from" name="fromDate" onChange={handlerDate} className="form-control" selected={offerInfo.fromDate} /> */}
                <input type="datetime-local" id="fromDate" name="fromDate" onChange={changeInputHandler} className="form-control" value={offerInfo.fromDate}></input>
            </div>
            <div className="col-4">
                <Label for="to">To</Label><br />
                <input type="datetime-local" id="toDate" name="toDate" onChange={changeInputHandler} className="form-control" value={offerInfo.toDate}></input>
            </div>
        </div>
        <div className="row col-12 ml-0">
            <ColoredLine color="red" />
        </div>
        <div className="row col-12">
            <div className="col-4">
                <Label for="shopIds">Shop</Label>
                <select className="form-control" onChange={changeType} name="city">
                    {types.map((option) => (
                        <option value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="col-4">
                <Label for="shopIds">Category</Label>
                {categories && <AsyncSelect
                    loadOptions={loadOptions}
                    inputValue={inputCat}
                    name="category_id"
                    onChange={onChangeSelectedOption}
                    onInputChange={handleInputChange}
                />}
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