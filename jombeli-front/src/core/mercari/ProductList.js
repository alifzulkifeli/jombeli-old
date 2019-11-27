import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { getProducts } from '../apiCore';
import Card from '../Card';
import {Search} from './apiMercari';

const M_Product = () => {
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    // eslint-disable-next-line
    const [error, setError] = useState(false);

  

 
    useEffect(() => {
       
    }, []);

    return (
        <Layout
            title="FullStack React Node MongoDB Ecommerce App"
            description="Node React E-commerce App"
            className="container-fluid"
        >
            <Search />
           
        </Layout>
    );
};

export default  M_Product;