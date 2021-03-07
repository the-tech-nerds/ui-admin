import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as fetch from 'isomorphic-fetch';
import Loader from "./loader";

function PaginationComponent({ 
    nextUrl = "",
    prevUrl = "",
    currentPage = 0,
    totalPages = 0,
    onPageChange = () => {},
    onNext = () => {},
    onPrevious = () => {}
  }) {
    const isEmpty = (url) => url === null || url === undefined || url === "" || typeof url === "boolean";
    return (
        <div>
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-between p-2">
                    <li
                        className={`page-item ${isEmpty(prevUrl) ? 'disabled' : ''}`}
                        onClick={() => onPrevious(prevUrl)}
                    >
                        <a className="btn btn-lg" href="javascrip:void(0)">Previous</a>
                    </li>
                    <li>
                        Page <input type="text" onChange={(e)=> onPageChange(e.target.value)} value={currentPage} /> of {totalPages}
                    </li>
                    {/* <li className="page-item"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li> */}
                    <li
                        className={`page-item ${isEmpty(nextUrl) ? 'disabled' : ''}`}
                        onClick={() => onNext(nextUrl)}
                    >
                        <a className="btn btn-lg" href="javascript:void(0)">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
};

export class Datatable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: [],
            myData: this.props.myData,
            loading: false,
            error: null,
            limit: 10,
            next: null,
            previous: null,
            search: "",
            page: 1,
            total: 0,
        }
    }

    componentDidMount() {
        let { url = undefined } = this.props;
        if (url) {
            url += `?page=${this.state.page}&limit=${this.state.limit}&sortBy=id:ASC`;
            this.setState({
                loading: true
            });
            fetch(url).then(async res => {
                const response = await res.json();
                if (response.code === 200) {
                    const {
                        data: {
                            results = [],
                            links: {
                                next = "",
                                previous = ""
                            },
                            meta: {
                                totalPages: pages = 0,
                                totalResults: total = 0,
                                currentPage: page = 1,
                            } = {}
                        } = {}
                    } = response;

                    this.setState({
                        myData: results,
                        loading: false,
                        next: next,
                        previous: previous,
                        page,
                        pages, 
                        total,
                    });
                    return;
                }
                this.setError("Failed Loading Data");
            }).catch(e => { })
        }
    }


    fetchNextOrPrevious = (params = '') => {
        let { url = undefined } = this.props;
        if (url) {
            url = `${url}${params}&search=${this.state.search}`;
            this.setState({
                loading: true
            });
            fetch(url).then(async res => {
                const response = await res.json();
                if (response.code === 200) {
                    this.setState({
                        myData: response.data.results,
                        loading: false,
                        next: response.data.links && response.data.links.next !== undefined && response.data.links.next,
                        previous: response.data.links && response.data.links.previous !== undefined && response.data.links.previous,
                    });
                    return;
                }
                this.setError("Failed Loading Data");
            }).catch(e => { })
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

    onPageChange = (value) => {
        console.log(value);
    }

    getPaginationComponent = () => {
        return (
            <PaginationComponent
                prevUrl={this.state.previous}
                currentPage={this.state.page}
                totalPages={this.state.total}
                onPageChange={v => this.onPageChange(v)}
                onPrevious={(url) => this.fetchNextOrPrevious(url)}
                nextUrl={this.state.next}
                onNext={(url) => this.fetchNextOrPrevious(url)}
            />
        )
    }

    searchChanged = (value) => {
        this.setState({
            search: value
        }, this.fetchNextOrPrevious);
    }

    render() {
        const { pageSize, myClass, multiSelectOption, pagination, extraColumns = [], takeColumns = [], excludeColumns = [], } = this.props;
        const { myData = [], loading = false, error = null } = this.state;

        if (loading) {
            return <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Loader />
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
                if (excludeColumns.includes(key)) {
                    continue;
                }

                if (!takeColumns.includes(key)) {
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
                if (key === "order_status") {
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
                columns = [...columns, ...extraColumns];
            }
        }

        return (
            <Fragment>
                <div class="justify-content-right">
                    <input
                        className="form-control"
                        placeholder="Search...."
                        value={this.state.search}
                        onChange={(e) => this.searchChanged(e.target.value)}
                    />
                </div>
                <ReactTable
                    filterable={false}
                    data={myData}
                    columns={columns}
                    defaultPageSize={this.state.limit}
                    className={myClass}
                    PaginationComponent={this.getPaginationComponent}
                />
                <ToastContainer />
            </Fragment>
        )
    }
}

export default Datatable
