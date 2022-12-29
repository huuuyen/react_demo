import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "./custom.css"
import _ from "lodash"


let api1 = `https://jsonplaceholder.typicode.com/posts`;
let api2 = "https://jsonplaceholder.typicode.com/users";

function DataFetching() {
    const [post, setPost] = useState([])
    const [listData, setListData] = useState([])
    const [nameApi, setNameApi] = useState('')
    const [country, setCountry] = useState([]);
    const [postOld, setPostOld] = useState([]);
    const [limit, setLimit] = useState(0);
    const [Offset, setOffset] = useState(10);
    const [text, setText] = useState('')
    const [nameOrder, setNameOrder] = useState("ASC");
    const [nameapiOld, setNameapiOld] = useState('');
    const [order, setOrder] = useState('asc');
    const [paginatePost, setPaginatePost] = useState()
    const [currentPage, setCurrentPage] = useState(1)

    // let pages = '';
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

    const pageSize = 10;
    useEffect(() => {
        let data1 = [];
        let data2 = [];
        let dataApi1 = [];
        const getcountry = async () => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${nameApi}`)
            let getcon = await response.json();
            if (nameApi && (nameApi != '')) {
                getcon = [getcon]
            }
            // // console.log(getcon)
            setCountry(await getcon)
        }
        getcountry();

        const getData = async () => {
            const [result, result2] = await Promise.all([
                getDataApi1(api1),
                getDataApi1(api2)
            ]);
            console.log(result);
            return [result.data, result2.data];
        };
        getData().then((res) => {
            dataApi1 = res.data;
            console.log('res', res);
            data1 = converData(res[0], res[1]);
            console.log('data1', data1);
            setListData(data1);
            // setPost(_(data1).slice(0).take(pageSize).value());
            setPost((data1));
            setPostOld(data1);
            // setPaginatePost(data1);
            setPaginatePost(_(data1).slice(0).take(pageSize).value());
        });
        // console.log("dataApi1", dataApi1);
    }, []);

    //Search title
    const onChangeHandle = (text) => {
        let matchesData = text.trim()//xóa khoảng trống đầu và cuối
        // let matchesData1 = matchesData.length
        setText(matchesData)
    }

    //page
    const pageCount = post ? Math.ceil(post.length / pageSize) : 0;
    // if (pageCount === 1)
    //     return null;
    const pages = _.range(1, pageCount + 1);


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
    // }, [nameApi]); //

    // hien thi limit, offset

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
        }

        // let newData = await onChangeHandleName(nameApi)
        //Offset vs Limit
        setNameApi(nameApi);
        if (Offset && Offset.length == 0) {
            setOffset(newData.length - limit)
        }
        if (limit && limit.length == 0) {
            setOffset(newData)
        }
        let data = newData.slice(parseInt(limit == '' ? 0 : limit),
            parseInt(Offset == '' ? listData.length : Offset) +
            parseInt(limit == '' ? 0 : limit));//điều kiện nếu bằng rỗng
        // console.log('end', data)

        //tăng dần và giảm dần
        if (order == 'asc') {
            data = data.sort((a, b) => a.id - b.id)
            // setPost(postCopy)
        } else {
            data = data.sort((a, b) => b.id - a.id)
        }
        data = converData(data, country)
        setPost(data)
        setPaginatePost(data)
        // console.log('data', data)

        //search title
        let matches = []
        if (text.length > 0) {
            matches = data.filter(post => {
                const regex = new RegExp(`${text}`);
                return post.title.match(regex);
            })
            setPost(matches)
            setPaginatePost(matches)
        }
        console.log("matches", matches)
        setText(text)
    }

    //page
    const pagination = async (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * pageSize;
        const paginatePost = _(post).slice(startIndex).take(pageSize).value();
        console.log('paginatePost', paginatePost);
        setPaginatePost(paginatePost)
    }


    //Search id-name-email
    const onChangeHandleName = async (userId) => {
        // console.log('nameApi', nameApi);
        let newData = ([])
        setNameapiOld(nameApi)
        setNameApi(userId);
        // console.log("newData", nameApi);

        //Request 1 lan.
        // console.log("value", { nameApi });
        // if (nameApi && nameApi.length === 0 || nameApi == '') {
        //     newData = [...listData]
        // }
        // else
        //     newData = listData.filter((item) => item.userId == nameApi);

        // setPost(newData);
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


    // const handleSearchInput = (lit, off) => {
    //     let newData = onChangeHandleName(nameApi);
    //     let data = newData.slice(parseInt(lit), parseInt(off) + parseInt(lit));
    //     setPost(data)
    // }

    // const handleLimit = (e) => {
    //     setLimit(e.target.value == '' ? 0 : e.target.value);
    //     handleSearchInput(e.target.value == '' ? 0 : e.target.value, Offset);
    // }

    // const handleOffset = (e) => {
    //     setOffset(e.target.value == '' ? 0 : e.target.value);
    //     handleSearchInput(limit, e.target.value == '' ? 0 : e.target.value);
    // }

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
                                onChange={e => onChangeHandle(e.target.value)}
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
                            <li className={page === currentPage ? "page-item active" : "page-item"}
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
                        Page{''}
                        <strong>
                            {pages.length} of {pageCount}
                        </strong>{' '}
                    </span>
                </ul>
            </div>
        </div>
    )
}


export default DataFetching
