import React, { useMemo } from "react";
import ReactTable from "react-table";
import { useTable } from "react-table/dist/react-table.development";
import User from "./Types";


type Props = {
    data: User[];
};

const columns = [
    {
        Headers: "Id",
        accessor: "id",
    },
    {
        Headers: "Title",
        accessor: "title",
    },
    {
        Headers: "Body",
        accessor: "body",
    },
    {
        Headers: "Userid",
        accessor: "userId",
    },
];



function Table(props: Props) {
    const data = useMemo(() => props.data, [props.data]);
    // const Table = ({ data }) => {
    //     <tr>
    //         <th>id</th>
    //         <th>Title</th>
    //         <th>body</th>

    //     </tr>
    //     {
    //         data.map((item) => {
    //             <tr key={item.id}>
    //                 <td>{item.id}</td>
    //                 <td>{item.title}</td>
    //                 <td>{item.body}</td>
    //             </tr>
    //         })
    //     }

    // }
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });
    return (
        <table className="table table-striped table-sm" >
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()} scope="col">
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}



            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                            })}
                        </tr>
                    );
                })}

            </tbody>


        </table>)

}


export default Table;


