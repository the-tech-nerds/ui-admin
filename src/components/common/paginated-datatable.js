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
    limit = 10,
    totalPages = 0,
    onPageChange = () => { },
    onLimitChange = () => { },
    onNext = () => { },
    onPrevious = () => { }
}) {
    const isEmpty = (url) => url === null || url === undefined || url === "" || typeof url === "boolean";
    return (
        <div>
            <div>
                <div className="pagination-bottom">
                    <div className="-pagination">
                        <div className="-previous">
                            <button
                                disabled={isEmpty(prevUrl)}
                                type="button"
                                className="-btn"
                                onClick={() => onPrevious(prevUrl)}>
                                Previous
                            </button>
                        </div>
                        <div className="-center">
                            <span className="-pageInfo">Page {` `}
                                <div className="-pageJump">
                                    <input
                                        ariaLabel="jump to page"
                                        type="number"
                                        value={currentPage}
                                        className=""
                                        onChange={e => onPageChange(e.target.value)}
                                    />
                                </div>
                                {` `}of
                                <span className="-totalPages">{` `} {totalPages}</span>
                            </span>
                            <span class="select-wrap -pageSizeOptions">
                                <select
                                    aria-label="rows per page"
                                    value={limit}
                                    onChange={(e) => onLimitChange(e.target.value)}
                                >
                                    <option value="5">5 rows</option>
                                    <option value="10">10 rows</option>
                                    <option value="20">20 rows</option>
                                    <option value="25">25 rows</option>
                                    <option value="50">50 rows</option>
                                    <option value="100">100 rows</option>
                                </select>
                            </span>
                        </div>
                        <div className="-next">
                            <button
                                disabled={isEmpty(nextUrl)}
                                type="button"
                                className="-btn"
                                onClick={() => onNext(nextUrl)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export class PaginatedDatatable extends Component {
    timeout = null;
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
            pages: 0,
            current: null,
            extraQuery: props.extraQuery ?? "",
        }
    }

    componentDidMount() {
        let { url = undefined } = this.props;
        if (url) {
            url += `?page=${this.state.page}&limit=${this.state.limit}&sortBy=id:ASC&${this.state.extraQuery}`;
            console.log(url);
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
                        current: response.data.links.current
                    });
                    return;
                }
                this.setError("Failed Loading Data");
            }).catch(e => { })
        }
    }


    fetchNextOrPrevious = (params = '') => {
        let { url = undefined } = this.props;
        const preappendedQuery = "&search";
        const positionOfSearch = params.indexOf(preappendedQuery);
        if (positionOfSearch !== -1) {
            params = params.replace(preappendedQuery, "");
        }
        if (url) {
            url = `${url}${params}&search=${this.state.search}&${this.state.extraQuery}`;
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
                        page: response.data.meta.currentPage,
                        current: response.data.links.current
                    });
                } else {
                    this.setError("Failed Loading Data");
                }
            }).catch(e => this.setError(e.message))
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
        let modifiedStr = str;
        if (modifiedStr.includes("_")) {
            modifiedStr = modifiedStr.replace("_", " ");
        }
        return modifiedStr.charAt(0).toUpperCase() + modifiedStr.slice(1);
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

    onLimitChange = (value) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.setState({ limit: value });
        this.timeout = setTimeout(() => {
            const fetchUrl = `?page=${this.state.page}&limit=${this.state.limit}&sortBy=id:ASC`;
            this.fetchNextOrPrevious(fetchUrl)
        }, 400);
    }

    onPageChange = (value) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.setState({ page: value });
        this.timeout = setTimeout(() => {
            const fetchUrl = `?page=${this.state.page}&limit=${this.state.limit}&sortBy=id:ASC`;
            this.fetchNextOrPrevious(fetchUrl)
        }, 400);
    }

    getPaginationComponent = () => {
        return (
            <PaginationComponent
                prevUrl={this.state.previous}
                currentPage={this.state.page}
                totalPages={this.state.pages}
                limit={this.state.limit}
                onPageChange={v => this.onPageChange(v)}
                onLimitChange={this.onLimitChange}
                onPrevious={(url) => this.fetchNextOrPrevious(url)}
                nextUrl={this.state.next}
                onNext={(url) => this.fetchNextOrPrevious(url)}
            />
        )
    }

    searchChanged = (value) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.setState({ search: value });
        this.timeout = setTimeout(() => this.fetchNextOrPrevious(this.state.current), 1000);
    }

    render() {
        const { 
                pageSize, 
                myClass, 
                multiSelectOption,
                pagination,
                extraColumns = [],
                takeColumns = [],
                excludeColumns = [],
                modifyColumns = [],
        } = this.props;
        const { myData = [], loading = false, error = null } = this.state;

        if (error) {
            return (
                <div>Error loading data..</div>
            );
        }

        let modifiedData = myData.map((item) => {
            for (let columnMap of modifyColumns) {
                const { key = null, name = "" } = columnMap;
                if (key && item[key]) {
                    item[name] = columnMap.modifier(item[key]);
                }
                console.log(item[name]);
            }
            return item;
        });
        

        let columns = [];
        if (modifiedData) {
            for (var key in modifiedData[0]) {
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
                <div className="d-flex flex-row-reverse">
                    <input
                        style={{ width: '300px' }}
                        className="form-control mb-2"
                        placeholder="Search...."
                        value={this.state.search}
                        onChange={(e) => this.searchChanged(e.target.value)}
                    />
                </div>
                {!loading && <ReactTable
                    filterable={false}
                    data={myData}
                    columns={columns}
                    defaultPageSize={this.state.limit}
                    className={myClass}
                    PaginationComponent={this.getPaginationComponent}
                />}
                {loading && <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Loader />
                </div>}
                <ToastContainer />
            </Fragment>
        )
    }
}

export default PaginatedDatatable;
