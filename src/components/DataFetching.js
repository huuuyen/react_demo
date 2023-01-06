import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import "./custom.css"
import _ from "lodash"
import PropTypes from 'prop-types'


function DataFetching(props) {
    const { onSubmit } = props;
    const [post, setPost] = useState([])
    const [listData, setListData] = useState([])
    const [nameApi, setNameApi] = useState('')
    const [country, setCountry] = useState([]);
    const [postOld, setPostOld] = useState([]);
    const [limit, setLimit] = useState(0);
    const [Offset, setOffset] = useState(10);
    const [text, setText] = useState('')
    const [nameapiOld, setNameapiOld] = useState('');
    const [order, setOrder] = useState('asc');
    const [paginatePost, setPaginatePost] = useState()
    const [pageIndex, setPageIndex] = useState(1)
    const [newDataApi2, setNewDataApi2] = useState('');
    const AppContext = createContext(undefined);
    const [dataLimit, setDataLimit] = useState("ASC");

    // export const UseAppContext = () => {
    //     return useContext(AppContext);
    // };

    // export const AppContextProvider = (props) => {
    //     const [apiData, setApiData] = useState([]);
    //     const globalValue = "Global Value"

    DataFetching.propTypes = {
        onSubmit: PropTypes.func,
    };
    DataFetching.defaultProps = {
        onSubmit: null,
    };

    const getDataApi1 = async (api) => {
        return axios.get(api);
    };
    const converData = (dataApi1, dataApi2) => {
        let newData = dataApi1.map((item) => {
            let object = dataApi2.find((item2) => item2.id === item.userId);
            if (object) {
                item.name = object.name;
                item.email = object.email;
            }
            // console.log('object', object)
            // console.log('dataApi2', dataApi2)
            return item;
        });
        return newData;
    };


    let api2 = `https://jsonplaceholder.typicode.com/users`;
    let api1 = `https://jsonplaceholder.typicode.com/posts`;
    useEffect(() => {
        let data1 = [];
        let data2 = [];
        let dataApi1 = [];

        const getcountry = async () => {
            // const response = await fetch(api2 + `${nameApi}`);
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${nameApi}`)
            let dataApi2 = await response.json();
            if (nameApi && (nameApi != '')) {
                dataApi2 = [dataApi2]
            }

            setCountry(await dataApi2);
            // setNewDataApi2(await dataApi2)
            setNewDataApi2(await dataApi2);
            console.log('newDataApi2', dataApi2);
            return dataApi2;
        }

        // getcountry();

        let getData = async () => {
            const [result, result2] = await Promise.all([
                getDataApi1(api1),
                getDataApi1(api2)
            ]);

            console.log('result2', result2);
            return [result.data, result2.data];
        };
        getData().then((res) => {
            dataApi1 = res.data;
            console.log('res', res);
            setCountry(res[1])
            data1 = converData(res[0], res[1]);
            console.log('data1', data1);
            setListData(data1);
            setPost((data1));
            setPostOld(data1);
            setPaginatePost(_(data1).slice(0).take(pageSize).value());
            // setDataApi2(api2 + `${nameApi}`)
            // console.log('api2', api2)
        });
    }, []);

    //search title, trim() vs timeout 1s
    const typingTimeoutRef = useRef(null);
    const onChangeHandle = (e) => {
        const value = e.target.value;
        setText(value);
        if (!onSubmit) return;
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            const formValues = {
                value: e.target.value,
            };
            onSubmit(formValues);
            let matchesData = value.trim()
            setText(matchesData)
        }, 1000);
    }

    //page



    // useEffect(() => {
    //     async function f() {
    //         const res = await
    //             fetch(api1 + `?${nameApi && (nameApi != '')
    //                 ?
    //                 `userId=${nameApi}`
    //                 :
    //                 ''}`)
    //         let newData = await res.json();
    //         console.log('newDataaa', newData)
    //     }
    //     f();
    // }, [nameApi]); 


    //click search
    const handleClickSearch = async () => {
        let res = '';
        let newData = [];
        if (nameapiOld === nameApi) {
            newData = [...postOld];
            // console.log('newData', newData)
        }
        else {
            res = await
                fetch(api1 + `?${nameApi && (nameApi != '')
                    ?
                    `userId=${nameApi}`
                    :
                    ''}`)
            setNameapiOld(nameApi);
            newData = await res.json(nameApi);
            setPostOld(newData);
            setPageIndex(1)
        }
        //Request 1 lan.
        // let newData = await onChangeHandleName(nameApi)

        //Offset vs Limit
        setNameApi(nameApi);
        if (Offset && Offset.length == 0) {
            setOffset(newData.length - limit)
        }
        if (limit && limit.length == 0) {
            setOffset(newData);
        }
        let data = newData.slice(parseInt(limit == '' ? 0 : limit),
            parseInt(Offset == '' ? listData.length : Offset) +
            parseInt(limit == '' ? 0 : limit));//điều kiện nếu bằng rỗng
        setPageIndex(1)

        newData = newData ? Math.ceil(newData.length / Offset) : 0;
        let pages = _.range(1, newData + 1);
        console.log('pages', pages)
        setPaginatePost(_(data).slice(0).take(Offset).value());
        // setPost(pages)

        //tăng dần và giảm dần
        if (order == 'asc') {
            data = data.sort((a, b) => a.id - b.id)
            // setPost(postCopy)
        } else {
            data = data.sort((a, b) => b.id - a.id)
        }
        data = converData(data, country)
        setPost(data)
        setPaginatePost(_(data).slice(0).take(pageSize).value());
        // console.log('data', data)

        //search title
        let matches = []
        if (text.length > 0) {
            matches = data.filter(post => {
                const regex = new RegExp(`${text}`);
                return post.title.match(regex);
            })
            setPost(matches)
            setPaginatePost(_(matches).slice(0).take(pageSize).value());
            setPageIndex(1)
        }
        console.log("matches", matches)
        setText(text)
    }

    // let pageSize = [];
    // let pageCount = [];
    // let pages = [];

    //page
    const pageSize = 10;// số lượng trong 1 trang
    const pageCount = post ? Math.ceil(post.length / pageSize) : 0;
    const pages = _.range(1, pageCount + 1);

    const pagination = async (pageNumber) => {
        setPageIndex(pageNumber);
        // console.log('pageNumber', pageNumber)
        const pageIndex = (pageNumber - 1) * pageSize;
        const paginatePost = _(post).slice(pageIndex).take(pageSize).value();
        console.log('paginatePost', paginatePost);
        setPaginatePost(paginatePost)
    }


    //Search id-name-email
    const onChangeHandleName = async (userId) => {
        // console.log('nameApi', nameApi);
        setNameapiOld(nameApi)
        setNameApi(userId);
        // console.log("newData", nameApi);

        //Request 1 lan.
        let newData = ([]);
        // setNameApi(nameApi);
        // console.log("value", nameApi);
        // if (nameApi && nameApi.length === 0 || nameApi == '') {
        //     newData = [...listData]
        // }
        // else
        //     newData = listData.filter((item) => item.userId == nameApi);
        // console.log('newData', newData)
        // // setNameApi(newData);
        // setNameapiOld(nameApi)
        // setPost(newData);
        // setPostOld(newData);
        // return newData;
    }

    //tăng dần và giảm dần
    const onChangeHandleOrder = async (nameOrder) => {
        setOrder(nameOrder);
        return;
        // let postCopy = [...post]
        // if (nameOrder == '') {
        //     postCopy = postCopy.sort((a, b) => a.id - b.id)
        //     // setPost(postCopy)
        // } else
        //     postCopy = postCopy.sort((a, b) => b.id - a.id)
        // // console.log("des", postCopy)
        // setPost(postCopy)
        // setNameOrder(nameOrder)
    }

    return (
        <div>
            <ul className='filter-limit'>
                <div >
                    {/* <input type="limit" value={limit}
                        // onChange={e => handleLimit(e)}
                        onChange={e => setLimit(e.target.value)}
                        placeholder="Nhập giá trị Offset" />
                    <text type='text'> Offset </text> */}

                    <input type="Offset"
                        value={Offset}
                        onChange={e => setOffset(e.target.value)}
                        placeholder="Nhập giá trị Limit" />
                    <text type='text'> Limit </text>

                    <select name='Order' className='form-controlOrder'
                        value={order}
                        onChange={e => onChangeHandleOrder(e.target.value)}
                    >
                        <option name="asc" value={'asc'}>
                            Ascending
                        </option>
                        <option name="des" value={'des'}>
                            Descending
                        </option>

                    </select>
                    <text className='mb-3'>Order</text>
                    <div className=' mb-13'>
                        <div className='from-group col-mb-4'>
                            <select name='Name' className='form-control'
                                value={nameApi}
                                onChange={e => onChangeHandleName(e.target.value)}
                            >
                                <option
                                    name="firstCountry"
                                    value={''}
                                >
                                    All Users
                                </option>
                                {
                                    post && country.map((countryget) => (
                                        <option
                                            key={countryget.id}
                                            name="country"
                                            value={countryget.id}
                                        >
                                            {countryget.id} - {countryget.name} - {countryget.email}
                                        </option>
                                    ))
                                }
                            </select>
                            <text className='mb-2'>Name</text>

                        </div>
                    </div>

                    <div className="button-check">
                        <div className='filter-search'>
                            <input
                                type="search"
                                onChange={onChangeHandle}
                                value={text}
                                className="col-md-12 input"
                                placeholder='Search title'
                            />
                            <text type='text'> Title </text>

                        </div>
                    </div>
                    {/* {isCheckTitle ?
                    <div class="alert alert-warning" >
                        Title không tồn tại, vui lòng chọn users khác!!!
                    </div>
                    : null} */}
                    <button className='name-button' type='button' onClick={() => handleClickSearch()}> Search</button>
                </div>
            </ul>
            <div className='control-table' >

                <table className='table'>
                    <tbody>
                        <tr>
                            <th>id</th>
                            <th>title</th>
                            <th>body</th>
                            <th>name</th>
                            <th>email</th>
                        </tr>

                        {paginatePost && paginatePost.map((post) => (
                            <tr key={post.id}>
                                <td> {post.id}</td>
                                <td> {post.title}</td>
                                <td> {post.body}</td>
                                <td> {post.name}</td>
                                <td> {post.email}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>

            </div>
            <div>
                <ul className='pagination'>
                    {
                        pages.map((page) => (
                            <li className={page === pageIndex ? "page-item active" : "page-item"}
                            >
                                <p className='page-link'
                                    onClick={() => pagination(page)}
                                >
                                    {page}
                                </p>
                            </li>
                        ))
                    }


                    <span>
                        Page{': '}
                        <strong>
                            {pageIndex} of {pageCount}
                        </strong>
                    </span>

                </ul>
            </div>
        </div>
    )
}


export default DataFetching
