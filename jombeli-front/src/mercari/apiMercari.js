import { API } from "../config";
import React, { useState, useEffect } from "react";
import Card from '../core/Card';



export const M_Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        minPrice: "",
        maxPrice: "",
        results: [],
        searched: false
    });

    const {  category, search, results, searched,minPrice,maxPrice,page } = data;

    

    useEffect(() => {
 
    }, []);

    const list = params => {
      console.log("query", params);
      return fetch(`${API}/mercari/search?page=${page || 1}&min_price=${minPrice}&max_price=${maxPrice}&search=${search}`, {
          method: "GET"
      })
          .then(response => {
              return response.json();
          })
          .catch(err => console.log(err));
    };

    const searchData = () => {
        console.log(search, category);
        if (search) {
            list({ search: search || undefined, category: category }).then(
                response => {
                    if (response.error) {
                        console.log(response.error);
                    } else {
                        setData({ ...data, results: response, searched: true });
                    }
                }
            );
        }
    };

    const searchSubmit = e => {
        e.preventDefault();
        searchData();
    };

    const handleChange = name => event => {
        setData({ ...data, [name]: event.target.value, searched: false });
        
        
    };

 

    const searchedProducts = (results = []) => {
        return (
            <div>
               

                <div className="row">
                    {results.map((product, i) => (
                        <div className="col-4 mb-3">
                            <Card key={i} product={product} cartUpdate={false}/>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <input
                        type="search"
                        className="form-control"
                        onChange={handleChange("search")}
                        placeholder="Search by name"
                        value={data.search}
                    />
                   
                </div>
                
                <div
                    className="btn input-group-append"
                    style={{ border: "none" }}
                >
                    <button className="input-group-text">Search</button>
                </div>
                
            </span>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                   
                    <input
                        type="number"
                        className="form-control"
                        onChange={handleChange("minPrice")}
                        placeholder="minumum price"
                    />
                    <input
                        type="number"
                        className="form-control"
                        onChange={handleChange("maxPrice")}
                        placeholder="maximum price"
                    />
                     <input
                        type="number"
                        className="form-control"
                        onChange={handleChange("page")}
                        placeholder="page number"
                    />
                </div>         
            </span>
            
        </form>
    );

    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
            </div>
        </div>
    );
};

