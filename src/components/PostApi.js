import React, { useState, useEffect } from 'react'

const PostApi = ({ postt }) => {
    const [post, setPost] = useState([])
    return (
        <div className='control-table'>
            <table>
                <tbody>
                    <tr>
                        <th>id</th>
                        <th>title</th>
                        <th>body</th>
                    </tr>
                    {postt.map(post => (
                        <tr>
                            <td>{post.id}</td>
                            <td>  {post.title}</td>
                            <td> {post.body}</td>

                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <Table data={data} /> */}
        </div>
    )
}

export default PostApi;