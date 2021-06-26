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
    const [options, setOptions] = useState(undefined);
    const [productOption, setProductOption] = useState([]);
    const [varianceOption, setVarianceOption] = useState([]);
    const [typeId, setTypeId] = useState(0);
    const [categoryId, setCategoryId] = useState(0);
    const [varianceId, setVarianceId] = useState(null);
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
                    setCategories(response.data);
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
        const cat = categories.filter(x => x.typeId === Number(e.target.value)).map(y=>{
            return {
                label: y.Name,
                value: y.id
            };
        })
        setOptions(cat);
        setTypeId(Number(e.target.value))
        setCategoryId(0);
        setProductOption([]);
        setVarianceOption([]);
    }
    const filterOptions = (inputValue, items) => {
        return items?.filter(i =>
            i.label.toLowerCase().includes(inputValue?.toLowerCase())
        );
    };
    const loadOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterOptions(inputValue, options));
        }, 1000);
    };
    const loadProductOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterOptions(inputValue, productOption));
        }, 500);
    };
    const handleChangeCategory = (event) => {
        FetchData({
            url: `/api/products/category/${event.value}`, callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    setProductOption(options);
                    setCategoryId(event.value);
                    setVarianceOption([]);
                }
            }
        });
    }

    const handleChangeProduct = (event) => {
        FetchData({
            url: `/api/product-variances/${event.value}`, callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: `${x['Variance Title']} (${x['Price']} BDT)`,
                            value: x['id']
                        };
                    });
                    setVarianceOption(options);
                    setVarianceId(options.length>0? options[0].value : null);
                }
            }
        });
    }
    const handleSubmit = (event) =>{
        event.preventDefault();
        props.addItem({
           offerInfo,
           variance: varianceOption.find(x=>x.value === varianceId)
        })
    }
  const changeVariance = (e)=>{
      setVarianceId(Number(e.target.value));
  }
    return <form  onSubmit={handleSubmit}>
        <div className="row p-2">
            <div className="row col-12">
                <div className="col-6">
                    <Label for="shopIds">Name</Label>
                    <input type="text" onChange={changeInputHandler} name="name" className="form-control" id="offer_name"
                           value={offerInfo.name} required={true} />
                </div>
                <div className="col-4">
                    <Label for="shopIds">Offer Price</Label>
                    <input type="number" name="price" onChange={changeInputHandler} className="form-control" id="offer_price"
                           value={offerInfo.price} required={true} />
                </div>
            </div>
            <div className="row col-12">
                <div className="col-4">
                    <Label for="shopIds">Offer Details</Label><br />
                    <textarea type="number" name="details" onChange={changeInputHandler} className="form-control" id="offer_details" value={offerInfo.details} />
                </div>
                <div className="col-4">
                    <Label for="from">From</Label><br />
                    <input type="datetime-local" id="fromDate" name="fromDate" onChange={changeInputHandler} className="form-control" required={true}
                           value={offerInfo.fromDate}/>
                </div>
                <div className="col-4">
                    <Label for="to">To</Label><br />
                    <input type="datetime-local" id="toDate" name="toDate" onChange={changeInputHandler} className="form-control" required={true}
                           value={offerInfo.toDate}/>
                </div>
            </div>
            <div className="row col-12 ml-0">
                <ColoredLine color="red" />
            </div>
            <div className="row col-12">
                <div className="col-4">
                    <Label for="shopIds">Shop</Label>
                    <select className="form-control" onChange={changeType} name="type_id" value={typeId}>
                        <option value="0">select</option>
                        {types.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col-4">
                    <Label for="shopIds">Category</Label>
                    <AsyncSelect
                        loadOptions={loadOptions}
                        defaultOptions
                        key={typeId}
                        name="supplier_id"
                        onChange={handleChangeCategory}

                    />
                </div>
                <div className="col-4">
                    <Label for="productId">Product</Label>
                    <AsyncSelect
                        loadOptions={loadProductOptions}
                        defaultOptions
                        key={categoryId}
                        name="product_id"
                        onChange={handleChangeProduct}
                    />
                </div>
                <div className="col-4">
                    <Label for="shopIds">Variance</Label>
                    <select className="form-control" name="variance_id" value={varianceId} onChange={changeVariance}>
                        {varianceOption?.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col-4 mt-1">
                    <Button type="submit" className="mt-4" color="primary">Add</Button>
                </div>
            </div>

        </div >
    </form>

}
