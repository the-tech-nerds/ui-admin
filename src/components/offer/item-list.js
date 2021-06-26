import React, { useState, useEffect } from 'react';
export function ItemList(props){
    const {items} = props;
    return <table className="table">
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
        {items && items.map((item, index) =>{return <tr>
            <th scope="row">{index +1}</th>
            <td>{item.label}</td>
            <td>
                <input className="form-control" value={item.quantity} type="number"/>
            </td>
            <td>
                <input type="number" value={item.price}/>
            </td>
            <td>
                <button onClick={()=>props.deleteItem(index)} className="btn"><i className="fa fa-trash"></i></button>
            </td>
        </tr>})}
        <tr>
            <td colspan="3">Total value must be equal to offer price</td>
            <td>{items.reduce((x,y)=>(x.price * x.quantity) + (y.price * y.quantity), 0)}</td>
            <td></td>
        </tr>
        </tbody>
    </table>
}
