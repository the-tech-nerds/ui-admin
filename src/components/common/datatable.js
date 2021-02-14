import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as fetch from 'isomorphic-fetch';
import Loader from "./loader";

export class Datatable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: [],
            myData: this.props.myData,
            loading: false,
            error: null,
        }
    }

    componentDidMount() {
        const { url = undefined } = this.props;
        if (url) {
            this.setState({
                loading: true
            });
            fetch(url).then(async res => {
                const response = await res.json();

                if (response.code === 200 ) {
                    this.setState({
                        myData: response.data,
                        loading: false,
                    });
                    return;
                }
                this.setError("Failed Loading Data");
            }).catch(e => {})
        }
    }

    setError(error) {
        this.setState({
            error,
        })
    }

    selectRow = (e, i) => {
        if (!e.target.checked) {
            this.setState({
                checkedValues: this.state.checkedValues.filter((item, j) => i !== item)
            });
        } else {
            this.state.checkedValues.push(i);
            this.setState({
                checkedValues: this.state.checkedValues
            })
        }
    }

    handleRemoveRow = () => {
        const selectedValues = this.state.checkedValues;
        const updatedData = this.state.myData.filter(function (el) {
            return selectedValues.indexOf(el.id) < 0;
        });
        this.setState({
            myData: updatedData
        })
        toast.success("Successfully Deleted !")
    };

    renderEditable = (cellInfo) => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable={false}
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.myData];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ myData: data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.myData[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    filterCaseInsensitive(filter, row) {
        const id = filter.pivotId || filter.id;
        return (
            row[id] !== undefined ?
                String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
            :
                true
        );
    }


    render() {
        const { pageSize, myClass, multiSelectOption, pagination, extraColumns = [], excludeColumns = [] } = this.props;
        const { myData = [], loading = false, error = null } = this.state

        if (loading) {
            return <div style={{ display: 'flex', justifyContent: 'center' }}>
                 <Loader/>
            </div>
        }

        if (error) {
            return (
                <div>Error loading data..</div>
            );
        }

        let columns = [];
        if (myData) {
            for (var key in myData[0]) {
                if(excludeColumns.includes(key)){
                    continue;
                }
                let editable = this.renderEditable
                if (key === "image") {
                    editable = null;
                }
                if (key === "status") {
                    editable = null;
                }
                if (key === "avtar") {
                    editable = null;
                }
                if (key === "vendor") {
                    editable = null;
                }
                if(key === "order_status"){
                    editable = null;
                }

                columns.push(
                    {
                        Header: <b>{this.Capitalize(key.toString())}</b>,
                        accessor: key,
                        Cell: editable,
                        style: {
                            textAlign: 'center'
                        }
                    });
            }

            if (multiSelectOption == true) {
                columns.push(
                    {
                        Header: <button className="btn btn-danger btn-sm btn-delete mb-0 b-r-4"
                                        onClick={
                                            (e) => {
                                                if (window.confirm('Are you sure you wish to delete this item?'))
                                                    this.handleRemoveRow()
                                            }}>Delete</button>,
                        id: 'delete',
                        accessor: str => "delete",
                        sortable: false,
                        style: {
                            textAlign: 'center'
                        },
                        Cell: (row) => (
                            <div>
                            <span >
                                <input type="checkbox" name={row.original.id} defaultChecked={this.state.checkedValues.includes(row.original.id)}
                                       onChange={e => this.selectRow(e, row.original.id)} />
                            </span>
                            </div>
                        ),
                        accessor: key,
                        style: {
                            textAlign: 'center'
                        }
                    }
                )
            }
            if (extraColumns.length > 0) {
                columns = [ ...columns, ...extraColumns ];
            }
        }

        return (
            <Fragment>
                <ReactTable
                    filterable={true}
                    data={myData}
                    columns={columns}
                    defaultPageSize={pageSize}
                    className={myClass}
                    showPagination={pagination}
                    defaultFilterMethod={(filter, row) => this.filterCaseInsensitive(filter, row) }
                />
                <ToastContainer />
            </Fragment>
        )
    }
}

export default Datatable
