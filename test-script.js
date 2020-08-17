//const body = $('body');
const shop = Shopify.shop;

var url = `https://${shop}/admin/api/2020-04/customers/${__st.cid}/orders.json`;


jQuery.getJSON(url, {})
  .done(function(response) {
    var orders = response.orders;
    console.log("ordersssssssssssssssss $$$$$$", orders);
    var tableHeader = document.getElementsByTagName('thead')[0];
    var tableRef = document.getElementsByTagName('tbody')[0];
    var headRow = tableHeader.getElementsByTagName('tr');
    var bodyRow = tableRef.getElementsByTagName('tr');

    var newHeader = headRow[0].insertCell(-1);
    var newHeaderText = document.createTextNode('Edit Order');
    newHeader.appendChild(newHeaderText);

    
  	var modalDiv = $('<div />').appendTo('tbody');
	modalDiv.attr('id', 'injectionDiv');
    

    // Insert a cell in the row at index 0
    for(var i = 0; i < bodyRow.length; i++) {
      var newCell = bodyRow[i].insertCell(-1);

      if(orders[i] != undefined) {
        var orderId = orders[i].id;
      }

      var btn  = document.createElement("BUTTON");
      btn.innerHTML = "edit";
      btn.setAttribute("id", "edit-button"+i);
      newCell.appendChild(btn);

      var btnId = "#edit-button"+i;
      var orderActionBtn = $(btnId);

      orderActionBtn.css("backgroundColor", "white");
      orderActionBtn.css("color", "blue");
      orderActionBtn.css("border", "none");
      

      if(orders[i] == undefined || orders[i].fulfillment_status == 'fulfilled') {
        orderActionBtn.prop("disabled", true);
        orderActionBtn.css("color", "black");
      }

        btn.onclick = function() {


          var index = $(this).closest('tr').index();

          var data = {
            shop: shop,
            orders: [],
            editedOrder: {
              order_id: orders[index].id,
              existingLineItems: [],
              newLineItems: [],
              deletedLineItems: []
            }
        }

        var injectionDiv = $('#injectionDiv');
        var modalContentDiv = $("<div id='modal-content' />");

        injectionDiv.append(modalContentDiv);

        injectionDiv.css("display", "block");
        injectionDiv.css("position", "fixed");
        injectionDiv.css("z-index", 1);
        injectionDiv.css("left", 0);
        injectionDiv.css("top", 0);
        injectionDiv.css("width", "100%");
        injectionDiv.css("height", "100%");
        injectionDiv.css("overflow", "auto");
        injectionDiv.css("background-color", "rgb(0,0,0,0.4)");

        var modalContent = $('#modal-content');

        modalContent.css("background-color", "#fefefe");
        modalContent.css("width", "60%");
        modalContent.css("border", "1px solid #888");
        modalContent.css("margin", "auto");
        modalContent.css("padding", "20px");
        modalContent.css("height", "50%");
        modalContent.css("margin-top", "10%");
        modalContent.css("overflow-y", "auto");
        modalContent.css("position", "relative");

        var contents = "<span class='close'>&times;</span>"+
            "<h4> Add Product </h4>"+
            "<div class='autocomplete'>"+
            "<input id='predictive-search-box' type='text' name='search' placeholder='Search'>"+
            "</div> <hr class='horizontal'>"+
            "<div id='orders' class="+ "order-"+ index +">"+
            "<h6 id='orderType'> Unfulfilled </h6>"

        var orderItems = "";

        orders[index].line_items.map((line_item, j) => {
          orderItems += "<div id="+ "item-container" + j +">"+
            "<div class='row'>"+
            "<div class='column'>"+ line_item.name +"</div>"+
            "<div class='column total-price'>₹"+ line_item.quantity * line_item.price +"</div>"+
            "</div>"+
            "<div class='quantity'>"+ line_item.quantity + "*" + line_item.price +"</div>"+
            "<button type='button' class='adjustQuantityButton actionButton' id="+ "adjustQuantityButton" + j +">Adjust Quantity</button>"+
            "<button type='button' class='removeItemButton actionButton'>Remove Item</button>"+
            "<div id="+ "quant-container" + j +"/>"+
            "<hr class='horizontal'>"+
            "</div>"
        });
        var submitBtnUi =	"<div id='submit-btn-container'>"+
            "<button type='button' id='submit-button'> Submit </button>"+
        		"</div>"
        orderItems = contents + orderItems + "</div>" + submitBtnUi;

        modalContent.empty();
        modalContent.append($(orderItems));

        var submitBtnConatiner = $('#submit-btn-container');
        submitBtnConatiner.css("position", "absolute");
        submitBtnConatiner.css("width", "95%");
        submitBtnConatiner.css("bottom", 0);
        submitBtnConatiner.css("border-top", "1px solid #ebeef0");

        var submitBtn = $('#submit-button');
        submitBtn.css("float", "right");
        submitBtn.css("background-color", "#008CBA");
      	submitBtn.css("padding", "8px 20px");
      	submitBtn.css("text-align", "center");
        submitBtn.css("text-decoration", "none");
        submitBtn.css("display", "inline-block");
        submitBtn.css("font-size", "16px");
        submitBtn.css("cursor", "pointer");
        submitBtn.css("color", "white");
        submitBtn.css("border", "none");
        submitBtn.css("margin", "10px");

        var closeBtn = $('.close');
        closeBtn[0].style.float = 'right';
        closeBtn[0].style.fontSize = '18px';
        closeBtn[0].style.fontWeight = 'bold';
        closeBtn[0].style.cursor = 'pointer';

        closeBtn.click(function() {
          injectionDiv[0].style.display = 'none';
        });

        $('.row').css("display", "flex");

        var column = $('.column');
        var totalPrice = $('.total-price');

        column.css("flex", "70%");
        column.css("padding", "10px");
        column.css("paddingBottom", "15px");
        column.css("height", "20px");
        column.css("fontSize", "18px");

        totalPrice.css("flex", "30%");

        var quantityPrice = $('.quantity');
        quantityPrice.css("padding", "10px");
        quantityPrice.css("paddingBottom", "15px");
        quantityPrice.css("fontSize", "12px");

        var actionButton = $('.actionButton');
        actionButton.css("backgroundColor", "white");
        actionButton.css("color", "blue");
        actionButton.css("border", "none");

        var autocompleteContainer = $('.autocomplete');
        autocompleteContainer.css("position", "relative");
        autocompleteContainer.css("display", "inline-block");
        autocompleteContainer.css("width", "100%");

        var inputBox = $('#predictive-search-box');
        var horizontalLine = $('.horizontal');

        horizontalLine.css("margin", "20px 0");

        var typingTimer;

        inputBox.keyup(function(e) {


          var autoCompleteDiv = "<div class='autocomplete-items' />"
          autocompleteContainer.append(autoCompleteDiv);


          var autocompleteItems = $('.autocomplete-items');
          autocompleteItems.css("position", "absolute");
          autocompleteItems.css("border", "1px solid #d4d4d4");
          autocompleteItems.css("border-bottom", "none");
          autocompleteItems.css("border-top", "none");
          autocompleteItems.css("z-index", 99);
          autocompleteItems.css("top", "100%");
          autocompleteItems.css("left", 0);
          autocompleteItems.css("right", 0);



          clearTimeout(typingTimer);


          typingTimer = setTimeout(function() {
            var searchedProduct = e.target.value;
            jQuery.getJSON(`https://${shop}/search/suggest.json`, {
              "q": searchedProduct,
              "resources": {
                "type": "product",
                "limit": 4,
                "options": {
                  "unavailable_products": "last",
                  "fields": "title,product_type,variants.title,body,variants.sku,tag,vendor"
                }
              }
            }).done(function(response) {
              console.log("responseeeeeeeeeeeeee", response);
              var productSuggestions = response.resources.results.products;
              closeAllLists();
              
              var productIds = [];
              var results = [];
              
              productSuggestions.map(product => {
                
                productIds.push(product.id);
               
              
//                 console.log("product idssssssssssssssss", productIds);

                

                 $.get(`https://${shop}/admin/products/${product.id}.json`, function(responseData) {
                          console.log("responseDataaaaaaaaaaaaaaaaaaa", responseData);
//                           constructOrderJson(data, orders[index], responseData.product, "newLineItems");
                 			results = responseData;   
                 });
                
              });
              
              
              console.log("resultssssssssssssssssssss", results);

              for (i = 0; i < productSuggestions.length; i++) {
                if (productSuggestions[i].handle.toUpperCase().includes(searchedProduct.toUpperCase())) {
                  var b = document.createElement("div");
                  b.setAttribute("class", "suggestions");
                  // closeAllLists(inputBox, b);


                  var dropDownContents = "<div class='suggestions-row'><div class='suggestions-column suggestions-image'>"+
                      					 "<img class='product-image' src="+ productSuggestions[i].image +"/></div>"+
                      					 "<div class='suggestions-column'> <strong>" + productSuggestions[i].handle.substr(0, searchedProduct.length) + "</strong>"+
                      					 productSuggestions[i].handle.substr(searchedProduct.length)+
                  					     "<div class='suggested-product-price'>"+
                      					 "₹"+productSuggestions[i].price+
                  					     "</div></div>"+
                  						   "</div>"

                   // b.innerHTML = "<strong>" + productSuggestions[i].handle.substr(0, searchedProduct.length) + "</strong>";
                  // b.innerHTML += productSuggestions[i].handle.substr(searchedProduct.length);
                  /*insert a input field that will hold the current array item's value:*/

                  b.innerHTML = dropDownContents;
                  b.innerHTML += "<input type='hidden' id='itemValue' value='" + productSuggestions[i].handle + "'>";

                  autocompleteItems.append(b);
                  $('.suggestions-row').css("display", "flex");
                  $('.suggestions-column').css("flex", "50%");
                  // $('.suggestions-image').css("flex", "50%");

                  $('.product-image').css("width", "25%");

                  b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/


                    var pos = $(this).index();

                    console.log("productSuggestionssssssssssss", productSuggestions[pos]);




                    var newOrderItem = "<div id='item-container'>"+
                    "<div class='row'>"+
                    "<div class='column'>"+ productSuggestions[pos].handle +"</div>"+
                    "<div class='column total-price'>₹"+ productSuggestions[pos].price +"</div>"+
                    "</div>"+
                    "<div class='quantity'> 1*" + productSuggestions[pos].price +"</div>"+
                    "<button type='button' class='adjustQuantityButton actionButton' id="+ "adjustQuantityButton" + pos +">Adjust Quantity</button>"+
                    "<button type='button' class='removeItemButton actionButton'>Remove Item</button>"+
                    "<div id="+ "quant-container" + pos +"/>"+
                    "<hr class='horizontal'>"+
                    "</div>"

                    $('#orders').append(newOrderItem);

                     // modalContent.append(newOrderItem);
                    // $(newOrderItem).insertBefore($('#edit-button'));

                    $('.row').css("display", "flex");

                    var column = $('.column');
                    var totalPrice = $('.total-price');

                    column.css("flex", "70%");
                    column.css("padding", "10px");
                    column.css("paddingBottom", "15px");
                    column.css("height", "20px");
                    column.css("fontSize", "18px");

                    totalPrice.css("flex", "30%");


                    var quantityPrice = $('.quantity');
                    quantityPrice.css("padding", "10px");
                    quantityPrice.css("paddingBottom", "15px");
                    quantityPrice.css("fontSize", "12px");

                    var actionButton = $('.actionButton');
                    actionButton.css("backgroundColor", "white");
                    actionButton.css("color", "blue");
                    actionButton.css("border", "none");

                    var horizontalLine = $('.horizontal');
        		        horizontalLine.css("margin", "20px 0");

                     // inputBox.val($('#itemValue').val());
                     // inputBox.value = this.getElementsByTagName("input")[0].value;
                    inputBox.val(this.getElementsByTagName("input")[0].value);
                     /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();



                  //  var orderKeyAlreadyPushedData = checkOrderKeyAlreadyPushed(data["editedOrders"], orders[index].id);
            		// console.log("orderKeyAlreadyPushedDataaaaaaaaaa", orderKeyAlreadyPushedData);

                    $.get(`https://${shop}/admin/products/${productSuggestions[pos].id}.json`, function(responseData) {
                    	console.log("responseDataaaaaaaaaaaaaaaaaaa", responseData);
//                         var editedData = {
//                           product_id: productSuggestions[pos].id,
//                           price: productSuggestions[pos].price,
//                           handle: productSuggestions[pos].handle,
//                           title: productSuggestions[pos].title,
//                           image: productSuggestions[pos].image,
//                           available: productSuggestions[pos].available,
//                           vendor: productSuggestions[pos].vendor
//                       	};
                      	constructOrderJson(data, orders[index], responseData.product, "newLineItems");
                    });
            		
                
					console.log("dataaaaaaaaaaaaaa", data);

                  });

                  var suggestions = $('.suggestions');
                  suggestions.css("padding", "10px");
                  suggestions.css("curser", "pointer");
                  suggestions.css("background-color", "#fff");
                  suggestions.css("border-bottom", "1px solid #d4d4d4");

                  suggestions.hover(function() {
                    $(this).css("background-color", "#e9e9e9");
                  });
                } // if end
              } // loop end

              document.addEventListener("click", function (e) {
                 closeAllLists(inputBox, e.target);
              });

              var autoCompleteActive = $('.autocomplete-active');
              autoCompleteActive.css("background-color", "DodgerBlue !important");
              autoCompleteActive.css("color", "#ffffff");

              if (productSuggestions.length > 0) {
                var firstProductSuggestion = productSuggestions[0];

               // alert("The title of the first product suggestion is: " + firstProductSuggestion.title);
              }
            });
          }, 500);
        });

        inputBox[0].style.width = '100%';
        inputBox[0].style.border = '1px solid transparent';
        inputBox[0].style.backgroundColor = '#f1f1f1';
        inputBox[0].style.padding = '10px';
        inputBox[0].style.fontSize = '16px';

        var adjustQuantityButton = $('.adjustQuantityButton');
        adjustQuantityButton.one("click", function() {

          var parentIndex = $(this).parent().attr('id').charAt($(this).parent().attr('id').length-1);

          var currentLineItemQuantity = orders[index].line_items[parentIndex].quantity;


          var adjustmentContents =  "<input type='number' id="+ "adjustment-input"+ parentIndex +" value="+ currentLineItemQuantity +">"
          var quantContainerId = "#quant-container" + parentIndex;
          var quantContainer = $(quantContainerId);

          quantContainer.append(adjustmentContents);

          var adjustmentInputId = "#adjustment-input"+parentIndex;
          var adjustmentInput = $(adjustmentInputId);

          console.log("liiiiiiiiiiiiii", orders[index].line_items[parentIndex]);


          adjustmentInput.on("change", function(e) {
            var currentLineItem = orders[index].line_items[parentIndex];


            var editedData = { id: currentLineItem.id, quantity: parseInt(e.target.value) };
            constructOrderJson(data, orders[index], editedData, "existingLineItems");
          });
        });

  	    var postUrl = `https://c4cd8b0eb404.ngrok.io/api/edit/order/${orders[index].id}`;
	
        console.log("postUrlllllllllllllllllllll", postUrl);
          
        submitBtn.on("click", function() {
          $.post(postUrl, data, function( res, status ) {
            if(status == "success") {
              alert(`Order ${orders[index].id} is successfully updated`);
            }
  	      });
      });

    };
  }
});

function constructOrderJson(data, order, editedData, lineItemType) {
  data["editedOrder"][lineItemType].push(editedData);
}

function closeAllLists(inp, elmnt) {
  var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
}
