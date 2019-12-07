import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { createProduct, getCategories } from './apiAdmin';
import '../script'
import { log } from 'util';

const AddProduct = () => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        images:'',
        quantity: '',     
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    });

    const [image, setImage] = useState({
        image1:'',
        image2:'',
        image3:'',
        image4:'',
        image5:'',
        image6:''
        },   
    )

    

    const { user, token } = isAuthenticated();
    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        images,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;
    const {
        image1,
        image2,
        image3,
        image4,
        image5,
        image6
    } = image;

    // load categories and set form data
    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    categories: data,
                    formData: new FormData()
                });
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => event => {
        const value = event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        formData.append('image1', image1);
        formData.append('image2', image2);
        formData.append('image3', image3);
        formData.append('image4', image4);
        formData.append('image5', image5);
        formData.append('image6', image6);
        setValues({ ...values, error: '', loading: true });
        console.log(values);
        
        
        createProduct(user._id, token, formData).then(data => {
 
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }
            
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    name: '',
                    description: '',
                    photo: '',
                    price: '',
                    quantity: '',
                    loading: false,
                    createdProduct: data.name
                });

                setImage({
                        image1:'',
                        image2:'',
                        image3:'',
                        image4:'',
                        image5:'',
                        image6:''
                    }
                )
            }
        });
    };

    const uploadImage = name => async e => {
        const files = e.target.files;
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'jombeli')
        
        
        const res = await fetch(
            'https://api.cloudinary.com/v1_1/drzyjnnsq/image/upload', {
                method: 'POST',
                body: data 
            }
        )
        
        const file = await res.json()
        setImage({...image, [name]: file.secure_url})  
        
    }

     const handleImageDelete = (e) => {
        setValues({[e.target.value]: ""})   
     }


    const imageInput = () => {
        return(
            
            <div>
            <div className="form-group">
                
            <label className="text-muted">Image</label>
            {image1 ? (<div><img src={image1} className="img-thumbnail rounded img form" alt=""/><button className='button button-danger' value="image1" onClick={handleImageDelete}>delete</button></div>) : 
            (
            <div><input onChange={uploadImage('image1')} type="file" className="form-control-file" multiple/>
            </div>
            )}
        </div>
        <div className="form-group">
            
            {image2 ? (<div><img src={image2} className="img-thumbnail rounded img form" alt=""/><button className='button button-danger' value="image2" onClick={handleImageDelete}>delete</button></div>) : 
            (
            <div><input onChange={uploadImage('image2')} type="file" className="form-control-file" multiple/>
            </div>
            )}
        </div>
        <div className="form-group">
            
            {image3 ? (<div><img src={image3} className="img-thumbnail rounded img form" alt=""/><button className='button button-danger' value="image3" onClick={handleImageDelete}>delete</button></div>) : 
            (
            <div><input onChange={uploadImage('image3')} type="file" className="form-control-file" multiple/>
            </div>
            )}
        </div>
        
        <div className="form-group">
            
            {image4 ? (<div><img src={image4} className="img-thumbnail rounded img form" alt=""/><button className='button button-danger' value="image4" onClick={handleImageDelete}>delete</button></div>) : 
            (
            <div><input onChange={uploadImage('image4')} type="file" className="form-control-file" multiple/>
            </div>
            )}
        </div>
        <div className="form-group">
            
            {image5 ? (<div><img src={image5} className="img-thumbnail rounded img form" alt=""/><button className='button button-danger' value="image5" onClick={handleImageDelete}>delete</button></div>) : 
            (
            <div><input onChange={uploadImage('image5')} type="file" className="form-control-file" multiple/>
            </div>
            )}
        </div>
        <div className="form-group">
            
            {image6 ? (<div><img src={image6} className="img-thumbnail rounded img form" alt=""/><button className='button button-danger' value="image6" onClick={handleImageDelete}>delete</button></div>) : 
            (
            <div><input onChange={uploadImage('image6')} type="file" className="form-control-file" multiple/>
            </div>
            )}
        </div>
        </div>
        )
    }


    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>

         
          {imageInput()}
      

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} className="form-control" value={description} />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price} />
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select onChange={handleChange('category')} className="form-control">
                    <option>Please select</option>
                    {categories &&
                        categories.map((c, i) => (
                            <option key={i} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} />
            </div>

            <button className="btn btn-outline-primary">Create Product</button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
            <h2>{`${createdProduct}`} is created!</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout title="Add a new product" description={`G'day ${user.name}, ready to add a new product?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

export default AddProduct;
