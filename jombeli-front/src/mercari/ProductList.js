import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import {M_Search} from './apiMercari';

const M_Product = () => {
    useEffect(() => {
       
    }, []);

    return (
        <Layout
            title="Mercari Shop"
            description="Get item directly from mercary.jp"
            className="container-fluid"
        >
            <M_Search />
           
        </Layout>
    );
};

export default  M_Product;