import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import FetchData from "../common/get-data";
export function ItemList(props){
    const {items, offer} = props;
    let [variances, setVariances] = useState([]);
    let [error, setError] = useState(undefined);
    let [totalPrice, setTotalPrice] = useState(0);
    const [itemsKey, setItemsKey] = useState(Math.random()*100);
    useEffect(() => {
        setVariances(items);
        let total = 0;
        items.forEach(ele =>{
            total += (ele.quantity * ele.price);
        });
        setTotalPrice(total);
    }, [items]);
    const handlePrice = (index, value) =>{
       variances[index].price = Number(value);
       setVariances(variances);
       setItemsKey(Math.random()*100);
       getTotal();
    }
    const getTotal=()=>{
        let total = 0;
        variances.forEach(ele =>{
            total += (ele.quantity * ele.price);
        });
        setTotalPrice(total);
    }
    const handleQuantity = (index, value) =>{
        variances[index].quantity = Number(value);
        setVariances(variances);
        setItemsKey(Math.random()*100);
        getTotal();
    }
    const handleSubmit = (status) =>{
        if(totalPrice !==offer.total_price){
         setError('Total price must be ' + offer.total_price);
        } else{
            props.handleSubmit(variances, status);
        }
    }
    return <div>
        {error &&<div className="alert alert-danger" role="alert">
            {error}
        </div>}
        <table key={itemsKey} className="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            {variances && variances.map((item, index) => {
                return <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{item.name}</td>
                    <td>
                        <input className="form-control" value={item.quantity}
                               onChange={(event) => handleQuantity(index, event.target.value)} type="number"/>
                    </td>
                    <td>
                        <input type="number" className="form-control"
                               onChange={(event) => handlePrice(index, event.target.value)} value={item.price}/>
                    </td>
                    <td>
                        <button onClick={() => props.deleteItem(index)} className="btn"><i className="fa fa-trash"/>
                        </button>
                    </td>
                </tr>
            })}
            <tr>
                <td colSpan="3" className=" font-weight-bold">Total value must be equal to offer price</td>
                <td className="font-weight-bold">{totalPrice}</td>
                <td>
                    <button onClick={() =>handleSubmit(0)} className="btn btn-primary">Draft</button>
                    <button onClick={() =>
                         confirmAlert({
                            title: 'Confirm to active offer. You can not edit after that',
                            message: 'Are you sure to do this?',
                            buttons: [
                                {
                                    label: 'Yes',
                                    onClick:async () => {
                                        handleSubmit(1)
                                    }
                                },
                                {
                                    label: 'No',
                                }
                            ]
                        })
                        } className="btn btn-success ml-2">Complete</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>

}
