import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import { addItem, updateItem, removeItem, itemTotal } from './cartHelpers';

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  showDetails = false,
  setRun = f => f,
  run = undefined
  // changeCartSize
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const showViewButton = showViewProductButton => {
    if (product._id) {
      return (
        showViewProductButton && (
          <Link to={`/product/${product._id}`} className="mr-2">
            <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">View Product</button>
          </Link>
        )
      );
    }
    return (
      showViewProductButton && (
      
        <a href={product.link}>
          <button className="btn btn-outline-primary  card-btn-1 mr-2">View Product</button>
        </a>
        
        // <Link to={{pathname:product.link}} className="mr-2">
        //   <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">View Product</button>
        // </Link>
      )
    );
  };
  const addToCart = () => {
    // console.log('added');
    addItem(product, setRedirect(false));
  };

  const shouldRedirect = redirect => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCartBtn = showAddToCartButton => {
    return (
      showAddToCartButton && (
        <button onClick={() => {
          addToCart(); // run useEffect in parent Cart
        }} className="btn btn-outline-warning mt-2 mb-2 card-btn-1  ">
          Add to cart
        </button>
      )
    );
  };

  const showStock = quantity => {
    if (product._id) {
      return quantity > 0 ? (
        <span className="badge badge-primary badge-pill">In Stock </span>
      ) : (
        <span className="badge badge-primary badge-pill">Out of Stock </span>
      );
    }
    
  };

  const handleChange = productId => event => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = cartUpdate => {
    if (product._id) {
      return (
        cartUpdate && (
          <div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Adjust Quantity</span>
              </div>
              <input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
            </div>
          </div>
        )
      );
    }else{
      return(
        cartUpdate && (
          <p>you cannot edit product quantity, learn here</p>
        )
        
      )
    }
    
  };
  const showRemoveButton = showRemoveProductButton => {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => {
            removeItem(product.name);
            setRun(!run); // run useEffect in parent Cart
          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };

  const showDetail = showDetails => {
    return (
      showDetails && (
        <p className="card-p black-10">{product.description}</p>
      )
    );
  };

  const showCategory = () => {
    if (product._id) {
      return (
        <div><p className="black-9">Category: {product.category && product.category.name}</p>
        <p className="black-8">Added on {moment(product.createdAt).fromNow()}</p>
        </div>
        
      );
    }
  }

  
  return (
    <div className="card mt-5 border border-primary">
      <div className="card-header card-header-1 ">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}
        <ShowImage item={product}/>
        {/* <p className="card-p  mt-2">{product.description.substring(0, 100)} </p> */}
        <p className="card-p black-10">RM {product.price}</p>
        {showCategory()}
        
        
        {showStock(product.quantity)}
        <br />

        {showViewButton(showViewProductButton)}

        {showAddToCartBtn(showAddToCartButton)}

        {showDetail(showDetails)}
        
        {showRemoveButton(showRemoveProductButton)}

        {showCartUpdateOptions(cartUpdate)}

      </div>
    </div>
  );
};

export default Card;








// const buy = () => {
//   setData({ loading: true });

//   $('.btn-afterblur').attr("disabled", true);
//   const enableBlur =  () => {
//       $('.btn-afterblur').attr("disabled", false);
//   }
//   setTimeout(enableBlur, 5000);
//   let nonce;
//   let getNonce = data.instance
//       .requestPaymentMethod()
//       .then(data => {
//           nonce = data.nonce;
//           const paymentData = {
//               paymentMethodNonce: nonce,
//               amount: getTotal(products)
//           };

//           processPayment(userId, token, paymentData)
//               .then(response => {
//                   console.log(response);
//                   // empty cart
//                   // create order

//                   const createOrderData = {
//                       products: products,
//                       transaction_id: response.transaction.id,
//                       amount: response.transaction.amount,
//                       address: deliveryAddress,
//                       receiptName: receiptNameData,
//                       receiptData:receiptDataData
//                   };

//                   createOrder(userId, token, createOrderData)
//                       .then(response => {
//                           emptyCart(() => {
//                               setRun(!run); // run useEffect in parent Cart
//                               console.log('payment success and empty cart');
//                               setData({
//                                   loading: false,
//                                   success: true,
//                                   paid: true
//                               });
//                           });
//                       })
//                       .catch(error => {
//                           console.log(error);
//                           setData({ loading: false ,paid: true});
//                       });
//               })
//               .catch(error => {
//                   console.log(error);
//                   setData({ loading: false ,paid: true});
//               });
//       })
//       .catch(error => {
//           // console.log("dropin error: ", error);
//           setData({ ...data, error: error.message });
          
          
//       });
// };