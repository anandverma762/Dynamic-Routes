const fs =require('fs');
const path =require('path');

const rootdir=require('../util/path');

const p =path.join(rootdir,'data','cart.json')

module.exports = class Cart{
  static addProduct(id,productprice){
      let cart ={ products:[],totalPrice:0 };

    fs.readFile(p,(err,filecontent)=>{
        if (!err){
            cart =JSON.parse(filecontent);
        }
        const existproductIndex=cart.products.findIndex(prod=>prod.id ===id);
        const existproduct = cart.products[existproductIndex];
        let updatedProduct;
        if (existproduct) {
            updatedProduct={...existproduct};
            updatedProduct.qty = updatedProduct.qty+1;
            cart.products = [...cart.products];
            cart.products[existproductIndex] = updatedProduct;

        }
        else
        {
            updatedProduct ={id:id,qty:1};
            cart.products= [...cart.products,updatedProduct];
        }

        cart.totalPrice=cart.totalPrice+productprice;
        fs.writeFile(p,JSON.stringify(cart),err=>{
            // console.log(err);
        })
    })
  }

  static deleteproduct(id,productprice) {
    fs.readFile(p,(err,filecontent)=>{
        if(err){
            return
        }
        const cart = JSON.parse(filecontent);
        const updatedcart={...cart};
        const product = updatedcart.products.find(prod=>prod.id===id);
        if(!product){
            return;
        }
        const productQty = product.qty;
        updatedcart.products=updatedcart.products.filter(
            prod=> prod.id!==id
        );

        updatedcart.totalPrice=updatedcart.totalPrice-productprice*productQty;
        fs.writeFile(p,JSON.stringify(updatedcart),err=>{
            console.log(err);
        })
    })
  }

  static getCart(cb){
    fs.readFile(p,(err,filecontent)=>{
        const cart = JSON.parse(filecontent);
        if (err) {
            cb(null);
        } else {
            cb(cart);
        }
    })
  }

}