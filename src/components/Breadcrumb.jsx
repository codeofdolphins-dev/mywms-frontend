import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({
    options = [],
}) => {
    return (
        < ul className="flex space-x-2" >
            {
                options?.map((item, idx) => {
                    return item?.link ? (
                        <li key={idx}>
                            <Link to={item?.link} className="text-primary hover:underline">
                                {item?.title}
                            </Link>
                        </li>
                    ) : (
                        <li key={idx} className="before:content-['/'] before:mr-2 ">
                            <span className='whitespace-nowrap'>{item?.title}</span>
                        </li>
                    )
                })
            }
        </ul >
    )
}

export default Breadcrumb