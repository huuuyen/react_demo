import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import PostApi from './components/PostApi';
import Table from './Table.tsx';
import { User } from './Types.ts';
import DataFetching from './components/DataFetching';

function App() {
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState([]);
  const [id, setId] = useState([]);
  const [post, setPost] = useState([])



  // const [notificationList, setNotificationList] = useState < NotificationItem([]) > ([]);

  // const fetchData = async () => {
  //   const uri = `https://jsonplaceholder.typicode.com/posts/`;
  //   const response = await axios.get(uri);
  //   console.log(data)
  //   setData(response.data);

  // };

  // useEffect(() => {
  //   fetchData();
  // },
  //   []);
  const onChangeHandle = (newText) => {
    console.log('newText', newText)
  }

  return (
    <>
      <div className='control-h1'>
        <h1>Danh sách API</h1>
      </div>


      <div className='control-table'>
        {/* <PostApi postt={data} /> */}
        <DataFetching onSubmit={onChangeHandle} />
        <Table data={data} />
      </div>
    </>
  )
};

export default App;
