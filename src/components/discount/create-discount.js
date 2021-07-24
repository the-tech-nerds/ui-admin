import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {AvDateField} from '@availity/reactstrap-validation-date';
import '@availity/reactstrap-validation-date/styles.scss';
import {Button, Label} from "reactstrap";
import {Col} from "react-bootstrap";
import * as moment from "moment";

export class CreateDiscount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            discount: {},
            discountId: 0,

            method: 'POST',
            url: '/api/discounts/',
            loading: true,
        }
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        if (id > 0) {
            this.setState({
                discountId: id,
                method: 'PUT',
                url: `/api/discounts/update/${id}`,
                loading: true
            });
            await fetch(`/api/discounts/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache',
                redirect: 'follow',
            })
                .then(async res => {
                    this.setState({loading: false});
                    const response = await res.json();
                    response.data.start_date = moment.utc(response.data.start_date).format("YYYY-MM-DD[T]HH:mm:ss");
                    response.data.end_date = moment.utc(response.data.end_date).format("YYYY-MM-DD[T]HH:mm:ss");
                    console.log('discount: ',response.data);
                    if (response.code === 200) {
                        this.setState((state) => {
                            return {
                                ...state,
                                discount: response.data,
                            }
                        });
                    } else {
                        this.setState((state) => {
                            return {
                                ...state,
                                error: true,
                                errorMessage: response.message,
                                loading: false,
                            }
                        });
                    }
                })
                .catch(error => {
                    this.setState((state) => {
                        return {
                            ...state,
                            error: true,
                            errorMessage: error,
                            loading: false,
                        }
                    });
                });
        }
    }

    handleChangeStartDate = (event) => {
        this.setState({
            discount: {
                ...this.state.discount,
                start_date: event.target.value
            }
        });
    }

    handleChangeEndDate = (event) => {
        this.setState({
            discount: {
                ...this.state.discount,
                end_date: event.target.value
            }
        });
    }

    render() {
        const {
            discount,
            discountId,
            method,
            url
        } = this.state;
        return (
            <App>
                <Breadcrumb title={discountId > 0 ? 'update' : 'create'} parent="discount"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{discountId > 0 ? 'Update Discount' : 'Add Discount'}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="col-xl-12">
                                        <Forms
                                            options={{
                                                method: method,
                                                url: url,
                                                onSuccess: (response) => {
                                                    window.location.href = '/discount/list';
                                                },
                                                dataProcessBeforeSubmit: (value, callback) => {
                                                    callback({
                                                        'name': value.name,
                                                        'discount_amount': value.discount_amount,
                                                        'discount_percentage': value.discount_percentage,
                                                        'start_date': this.state.discount.start_date,
                                                        'end_date': this.state.discount.end_date,
                                                    });
                                                },
                                            }}
                                        >

                                            <Col md="8">
                                                <Label for="price">Discount Title</Label>
                                                <AvField className="form-control" name="name" value={discount.name}
                                                         placeholder="Discount Title" type="text"/>
                                            </Col>

                                            {!discountId &&
                                            <Col md="8">
                                                <Label for="price">Discount Amount</Label>
                                                <AvField className="form-control" name="discount_amount"
                                                         value={discount.discount_amount}
                                                         placeholder="Discount Amount" type="text"/>
                                            </Col>
                                            }
                                            {!discountId &&
                                            <Col md="8">
                                                <Label for="price">Discount Percentage</Label>
                                                <AvField className="form-control" name="discount_percentage"
                                                         value={discount.discount_percentage}
                                                         placeholder="Discount Percentage" type="text"/>
                                            </Col>}

                                            <div className="col-8">
                                                <Label for="from">From</Label><br />
                                                <input type="datetime-local" id="start_date" name="start_date" onChange={this.handleChangeStartDate} className="form-control" required={true}
                                                       value={discount.start_date}/>
                                            </div>
                                            <div className="col-8">
                                                <Label for="to">To</Label><br />
                                                <input type="datetime-local" id="end_date" name="end_date" onChange={this.handleChangeEndDate} className="form-control" required={true}
                                                       value={discount.end_date}/>
                                            </div>

                                            <Col md='8'>
                                                {discountId === 0 &&
                                                <Button color="primary" className="mt-3">Create</Button>}
                                                {discountId > 0 &&
                                                <Button color="primary" className="mt-3">Update</Button>}
                                            </Col>
                                        </Forms>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

export default CreateDiscount
