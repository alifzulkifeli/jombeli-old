import React, { useState, useEffect } from 'react';
import { getProducts, getBraintreeClientToken, processPayment, createOrder} from './apiCore';
import { emptyCart } from './cartHelpers';
import Card from './Card';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import $ from 'jquery';
import image2base64  from 'image-to-base64';

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: '',
        receiptName: '',
        receiptData:'',
        paymentMethod:'',
        paid: false

    });
    const [test , setTest] = useState('satu')
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error) {
                setData({ ...data, error: data.error });
            } else {
                setData({ clientToken: data.clientToken });
            }
        });
    };

    useEffect(() => {
        getToken(userId, token);
    }, []);

    const handleAddress = event => {
        setData({ ...data, address: event.target.value });
    };

    const handleReceipt = event => {
        setData({ ...data, receiptName: event.target.value });
    };
    const transfer = () => {
       
        setData({ transfer: true });
        console.log(data.transfer);
    };
    const credit = () => {
     
        setData({ transfer: false });
        console.log(data.transfer);
    };
    
    const handlePhoto = event => {
        console.log(event.target.files[0]);
        const test = URL.createObjectURL(event.target.files[0]);
        image2base64(test) // you can also to use url
            .then(
                (response) => {
                    setData({ ...data, receiptData: response  });
                }
            )
            .catch(
                (error) => {
                    console.log(error); 
                }
            )
 
        
    };
    
    const testHandler1 = () => {
        setTest(false)
    }

    const testHandler2 = () => {
        setTest(true)
    }
    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

 


    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn() || showDropOut()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        );
    };

    const paymentMethodHandler = (paid) => {
        return(
            <div>
        {data.clientToken !== null && products.length > 0 ? (
        <div style={{ display: paid ? 'none' : '' }}>
            <button onClick={testHandler1} className="btn btn-primary btn-block">
                Pay With Cash Deposit / ATM 
            </button>
            <button onClick={testHandler2} className="btn btn-primary btn-block">
                Pay With Credit Card / Paypal
            </button>
        </div>
        ) : null}</div>
        )
    };


    let deliveryAddress = data.address;
    let receiptNameData = data.receiptName;
    let receiptDataData = data.receiptData;

    
    const buy = () => {
        setData({ loading: true });

        $('.btn-afterblur').attr("disabled", true);
        const enableBlur =  () => {
            $('.btn-afterblur').attr("disabled", false);
        }
        setTimeout(enableBlur, 5000);
        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce;
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                };

                processPayment(userId, token, paymentData)
                    .then(response => {
                        console.log(response);
                        // empty cart
                        // create order

                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress,
                            receiptName: receiptNameData,
                            receiptData:receiptDataData
                        };

                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                emptyCart(() => {
                                    setRun(!run); // run useEffect in parent Cart
                                    console.log('payment success and empty cart');
                                    setData({
                                        loading: false,
                                        success: true,
                                        paid: true
                                    });
                                    
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                setData({ loading: false ,paid: true});
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        setData({ loading: false ,paid: true});
                    });
            })
            .catch(error => {
                // console.log("dropin error: ", error);
                setData({ ...data, error: error.message });
                
                
            });
    };

    const buy2 = () => {

        setData({ loading: true });
        $('.btn-afterblur').attr("disabled", true);
        const enableBlur =  () => {
            $('.btn-afterblur').attr("disabled", false);
        }
        setTimeout(enableBlur, 5000);
        
       

                        const createOrderData = {
                            products: products,
                            transaction_id:  'CDM/ATM',
                            amount: 1000,
                            address: deliveryAddress,
                            receiptName: receiptNameData,
                            receiptData:receiptDataData
                        };

                        createOrder(userId, token, createOrderData)
                            .then(() => {
                                emptyCart(() => {
                                    setRun(!run); // run useEffect in parent Cart
                                    console.log('payment success and empty cart');
                                    setData({
                                        loading: false,
                                        success: true,
                                        paid: true
                                    });
                                    
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                setData({ loading: false ,paid: true});
                               
                            });
                    }

    const showDropOut = () => {
    
        if (!test) {
            return( !data.paid && (
                               
<div >
  <div>
<h5>ATM/Cash Deposit</h5>
<p className="mt-4">enter the bank name</p>
<select className="form-control mb-5" onChange={handleReceipt}>
  <option>choose bank name</option>
  <option value="Maybank">Maybank</option>
  <option value="bank islam" >Bank Islam</option>
  <option value="CIMB bank">CIMB bank</option>
  
</select>
<p>enter receipt image</p>
<form>
<div className="form-group">
  <label className="btn btn-secondary">
  <input type="file" type="file" onChange={handlePhoto} accept="image/*"/>
  </label>
</div>
</form>
</div>
<button onClick={buy2} className="btn btn-afterblur btn-success btn-block">
Pay
</button>
  </div> 
            ))
        }
        
    }

    const showDropIn = () => {
        if (test) {
            return(
            
                <div onBlur={() => setData({ ...data, error: '' })}>
                    {data.clientToken !== null && products.length > 0 ? (
                        <div>
                            <div className="gorm-group mb-3">
                                <label className="text-muted">Delivery address:</label>
                                <textarea
                                    onChange={handleAddress}
                                    className="form-control"
                                    value={data.address}
                                    placeholder="Type your delivery address here..."
                                />
                            </div>
        
                            <DropIn
                                options={{
                                    authorization: data.clientToken,
                                    paypal: {
                                        flow: 'vault'
                                    }
                                }}
                                onInstance={instance => (data.instance = instance)}
                            />
                            <button onClick={buy} className="btn btn-success btn-block">
                                Pay
                            </button>
                        </div>
                    ) : null}
                </div>
                )
        }
        
    };

    const showError = error => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = success => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Thanks! Your payment was successful!
        </div>
    );

    const showLoading = loading => loading && <h2 className="text-danger">Loading...</h2>;

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {paymentMethodHandler(data.paid)}
            {showCheckout()}
            {/* {cardPaypal(data.card)}
            {transferAtm(data.transfer)} */}
        </div>
    );
};

export default Checkout;
