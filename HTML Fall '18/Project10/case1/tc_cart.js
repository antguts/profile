"use strict";

/*
   New Perspectives on HTML5 and CSS3, 7th Edition
   Tutorial 10
   Case Problem 1

   Author: Anthony gutilla
   
   Filename: tc_cart.js
	
*/

var orderTotal = 0;
var cartHTML = "<table><tr><th>Descrtiption</th><th>Price</th><th>Qty</th><th>Total</th></tr>";

for(var i = 0; i < item.length; i++) {
  cartHTML += "<tr><td><img src='tc_" + item[i] +".png' alt='item' /></td>";
  cartHTML += "<td>" + itemDescription[i] +"</td><td>$" + itemPrice[i]+"</td><td>" + itemQty[i]+"</td>";
  var itemCost = itemQty[i] * itemPrice[i];
  cartHTML += "<td>$" + itemCost + "</td></tr>";

  orderTotal += itemCost;
} // For Loop Finished


cartHTML += "<tr><td colspan='4'>Subtotal</td><td>$" + orderTotal + "</tr></table>";

document.getElementById('cart').innerHTML = cartHTML;
