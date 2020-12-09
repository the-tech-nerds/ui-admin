import React, { Component, Fragment } from 'react'
import * as fetch from 'isomorphic-fetch';
import { AvForm, } from 'availity-reactstrap-validation';;

export class Forms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorMessage: '',
            loading: false,
        }
        this.handleValidSubmit = this.handleValidSubmit.bind(this);
        this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
    }


    handleValidSubmit(event, values) {
        event.preventDefault();
        console.log(values);
        const {
            options: {
                method = "POST", url = '', headers = null, onSuccess = () => {}
            } = {},
        } = this.props;

        this.setState({
            loading: true
        });

        fetch(url, {
            method: method,
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            cache: 'no-cache',
            redirect: 'follow',
        }).then(async res => {
            this.setState({ loading: false });
            const response = await res.json();
            if (response.code === 200 || response.code === 201) {
                onSuccess(response);
                return;
            } else {
                this.setState({
                    error: true,
                    errorMessage: response.message,
                    loading: false,
                });
                return;
            }
        })
            .catch(error => {
                this.setState({
                    error: true,
                    errorMessage: error,
                    loading: false,
                })
            })
    }

    handleInvalidSubmit(event, errors, values ){

    }

    render() {
        const { children, title = null } = this.props;
        const { error = false, errorMessage = '', loading = false } = this.state;
        const className = loading ? 'blur' : '';
        const matches = String(errorMessage).match(/\[(.*?)\]/);
        return (
            <AvForm
                onValidSubmit={this.handleValidSubmit}
                onInvalidSubmit={this.handleInvalidSubmit}
                className={className}
            >
                {error && <label className="text-danger">{matches[1]}</label>}
                {title && <h4>{title}</h4>}
                {children}
            </AvForm>
        );
    }
}

export default Forms;
