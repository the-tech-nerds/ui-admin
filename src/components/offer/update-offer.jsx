import React, {useEffect, useState} from 'react';
import {Tab, Tabs} from "react-bootstrap";
import {Label} from "reactstrap";
import * as moment from "moment";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import FetchData from "../common/get-data";
import ReactHtmlParser from 'react-html-parser';
export function UpdateOffer(props) {
    const {offer = {}, items = [] } = props;
    return<div className="container-fluid">
        <div className="card p-3">
            <Tabs defaultActiveKey="details" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="details" title="Details">
                    <OfferDetails offer={offer} items={items}/>
                </Tab>
                <Tab eventKey="offer" title="Update Info">
                   <UpdateSelectedField offer={offer} items={items}/>
                </Tab>
            </Tabs>
        </div>
        </div>
}
function UpdateSelectedField(props) {
    const [offerInfo, setOfferInfo] = useState({
        name: '',
        total_price: 0,
        description: '',
        start_date: moment().format("YYYY-MM-DD[T]HH:mm:ss"),
        end_date: moment().format("YYYY-MM-DD[T]HH:mm:ss"),
        status: 0,
        stock: 0,
        shops: []
    });
    const [shopOptions, setShopOptions] = useState(undefined);
    const changeInputHandler = (event) => {
        const value = event.target.value;
        if (event.target.name === 'name') {
            setOfferInfo({
                ...offerInfo,
                name: value
            })
        }else if (event.target.name === 'start_date') {
            setOfferInfo({
                ...offerInfo,
                start_date: value
            })
        } else if (event.target.name === 'end_date') {
            setOfferInfo({
                ...offerInfo,
                end_date: value
            })
        }else if (event.target.name === 'stock') {
            setOfferInfo({
                ...offerInfo,
                stock: value
            })
        }
    }
    useEffect(() => {
        if (props.offer) {
            debugger
            setOfferInfo({
                ...props.offer,
                start_date: moment.utc(props.offer.start_date).format("YYYY-MM-DD[T]HH:mm:ss"),
                end_date: moment.utc(props.offer.end_date).format("YYYY-MM-DD[T]HH:mm:ss"),
            })
        }
        FetchData({
            url: '/api/shops/list/all', callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id,
                        };
                    }) || [];
                    setShopOptions(options);
                }
            }
        })
    }, []);
    const filterOptions = (inputValue, items) => {
        return items?.filter(i =>
            i.label.toLowerCase().includes(inputValue?.toLowerCase())
        );
    };
    const loadShopOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterOptions(inputValue, shopOptions));
        }, 500);
    };
    const handleShop = (event) => {
        setOfferInfo({
            ...offerInfo,
            shops: event
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        const model  = {
            ...offerInfo,
            shops: offerInfo.shops?.map(x=>x.value),
            offer_detail: JSON.stringify(props.items),
        }
        let method = 'PUT';
        let url = '/api/offers/update/' + offerInfo.id;
        fetch(url, {
            method: method,
            body: JSON.stringify(model),
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache',
            redirect: 'follow',
        }).then(async res => {
            const response = await res.json();
            if (response.code === 200) {
               window.location.reload()
            }

        })
            .catch(error => {

            })
    }
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-12">
                <Label for="shopIds">Name</Label>
                <input type="text"  name="name" onChange={changeInputHandler}
                       className="form-control" id="offer_name"
                       value={offerInfo.name}
                       required={true} />
            </div>
            <div className="col-12 row mt-2">
                <div className="col">
                    <Label for="shopIds">Shops</Label>
                    {shopOptions && <AsyncSelect
                        defaultOptions
                        isMulti
                        name="shops"
                        loadOptions={loadShopOptions}
                        value={offerInfo.shops}
                        onChange={handleShop}
                        key = "shop_option"
                        required = {true}
                    />}
                </div>
                <div className="col">
                    <Label for="shopIds">Quantity</Label>
                    <input type="number"
                           name="stock"
                           onChange={changeInputHandler}
                           className="form-control"
                           value={offerInfo.stock}
                           id="stock"
                           required={true} />
                </div>
            </div>
            <div className= "row col-12 mt-2">
                <div className="col">
                    <Label for="from">From</Label><br />
                    <input type="datetime-local"
                           id="start_date"
                           name="start_date"
                           onChange={changeInputHandler}
                           value={offerInfo.start_date}
                           className="form-control"
                    />
                </div>
                <div className="col">
                    <Label for="to">To</Label><br />
                    <input type="datetime-local"
                           id="end_date"
                           name="end_date"
                           onChange={changeInputHandler}
                           value={offerInfo.end_date}
                           className="form-control"
                    />
                </div>
            </div>
            <div className= "col-12 text-right p-3">
                <button className="btn btn-primary">Update</button>
            </div>
        </div>
    </form>

}

function OfferDetails(props){
    const {offer = {}, items = [] } = props;
    debugger
    return <div>
        <label>Offer</label>
        <table className="table table-bordered">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Info</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Name</td>
                <td>{offer?.name}</td>
            </tr>
            <tr>

                <td>Price</td>
                <td>{offer?.total_price}</td>
            </tr>
            <tr>

                <td>Stock</td>
                <td>{offer?.stock}</td>
            </tr>
            <tr>
                <td>Description</td>
                <td>{ReactHtmlParser(offer?.description)}</td>
            </tr>
            <tr>
                <td>Status</td>
                <td>{offer?.status === 1 ? <strong className= "text-success">Active</strong> : <strong className= "text-danger">In Active</strong>}</td>
            </tr>
            <tr>
                <td>Start Date</td>
                <td>{moment(offer?.start_date ).local().format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
            <tr>
                <td>End Date</td>
                <td>{moment(offer?.end_date).format('LLLL')}</td>
            </tr>
            </tbody>
        </table>
        <label>Offer Items</label>
        <table className="table table-bordered">
            <thead>
            <tr>
                <th scope="col">SL.</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
            </tr>
            </thead>
            <tbody>
            {items.map((item, index) => <tr key={index}>
                <td>{index +1}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
            </tr>)}
            </tbody>
        </table>
    </div>
}
