import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product/product.service';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OrderInfo, OrderService, ProductInfo } from '../../services/order/order.service';

interface cartItem {
  product: Product
  quantity: number
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart;
  total = 0
  cartItems: cartItem[] = [];
  cartSubscription: Subscription;
  modalRef: BsModalRef


  constructor(private cartSevice: CartService,
    private router : Router, 
    private productService: ProductService,
    private modalService : BsModalService,
    private orderService : OrderService) { }

  ngOnInit(): void {
    this.subcribeCart()

  }
  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe()
  }

  subcribeCart() {
    let total = 0;
    this.cartSubscription = this.cartSevice.cartObservable.subscribe(
      {
        next: (cart) => {
          console.log(cart);
          let observables = []
          total = 0;
          if (Object.keys(cart).length == 0) {
            this.cartItems = []
          }
          for (let id in cart) {
            observables.push(
              this.productService.getProductById(id)
                .pipe(
                  map(product => {
                    total += (product.price * cart[id])
                    let item: cartItem = {
                      product: product,
                      quantity: cart[id]
                    }
                    return item
                  })
                )
            )
          }

          forkJoin(observables).subscribe({
            next: (cartItems: cartItem[]) => {
              this.total = total;
              this.cartItems = cartItems
            }
          })
        }
      }
    )
  }


  //open modal
  openModal(form){  
    this.modalRef = this.modalService.show(form ,
      {
        animated : true , 
        class : 'modal-lg'
      })
  }

  // checkout 
  checkOut(evnt : Event  , form : HTMLFormElement){
    evnt.preventDefault();
    let firstName = (<HTMLInputElement>form.elements.namedItem('firstName')).value
    let lastName = (<HTMLInputElement>form.elements.namedItem('lastName')).value
    let address = (<HTMLInputElement>form.elements.namedItem('address')).value
    

    let orderInfo : OrderInfo;
    let productInfos : ProductInfo[] = [];
    this.cartItems.forEach(e=>{
      productInfos.push({
        price : e.product.price , 
        productId : e.product._id , 
        quantity : e.quantity
      })
    })

    orderInfo = {
      address , 
      firstName , 
      lastName, 
      products : productInfos
    }
    console.log({
      orderInfo
    });

    this.orderService.placeOrder(orderInfo)
    .subscribe({
      next : (result)=>{
        this.modalRef.hide()
        this.cartSevice.clearCart()
        // this.router.navigate(['user-orders'])
      }, 
      error : (err)=>{
        console.log({'err' : 'Cant place order ..' })  
      }
    })

    return false;
    
  }

}
