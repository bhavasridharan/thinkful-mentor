$(function() {

  console.log('ready!')

  // get items
  $('#show-btn').on('click', function() {

    // remove data from dom
    $(".table").find('tr:gt(0)').remove();

    // call the `getValues()` function to get new data
    getValues()

  });

  // handle button click
  $('#add-btn').on('click', function() {

    // grab values of the inputs
    var item = $('#item-input').val();
    var quantity = $('#quantity-input').val();
    var price = $('#price-input').val();

    // clear out errors/alerts
    $('#alert').html('<br>');

    // ensure no inputs are empty
    if ((item === '') || (quantity === '') || (price === '')) {

      // if empty
      $('#alert').html('<span class="alert-text">All fields are required!</span>');

    } else {

      // if not empty
      if (dataObject = validateValues(item, quantity, price)) {

        // if valid
        updateLocalStorage(dataObject)

      }

    };

  });


  // validate values using regex
  function validateValues(itemValue, quantityValue, priceValue) {

    // validate number
    if ((validateNum(quantityValue)) || (validateNum(priceValue))) {

      // if invalid
      $('#alert').html('<span class="alert-text">The quantity and price must be integers!</span>');

    // validate string
    } else if (validateStr(itemValue)) {

      // if invalid
      $('#alert').html('<span class="alert-text">The item name must be a string!</span>');

      // if valid
    } else {

      // clear out errors/alerts and inputs
      $('#alert').html('');
      $('#item-input').val('');
      $('#quantity-input').val('');
      $('#price-input').val('');

      // convert priceValue to float
      var floatPrice = parseFloat(priceValue).toFixed(2);

      // calculate total
      var total = calculateTotal(quantityValue, floatPrice)

      // convert data to an object
      data = {
        'name':itemValue,
        'quantity':quantityValue,
        'price':floatPrice,
        'total':total,
        'delete':0,
      }

      // return object
      return data

    }

  };


  function updateLocalStorage(dataObject) {

    //test to see if there are any items in storage
    if (localStorage.listSize == undefined ) {

      // if not, set list size (number of items in storage) to 0
      localStorage.setItem('listSize', 0)

    };

    // update list size
    var listSize = parseInt(localStorage.listSize) + 1;

    // pass the current size, plus the object to the `addValuesToStorage()` function
    addValuesToStorage(listSize, data)

    // remove data from dom
    $(".table").find('tr:gt(0)').remove();

    $('#all-items').hide();
    $('#show-btn').show()
    $('#hide-btn').hide();
    location.reload()

    $('#alert').html('<br>');

  };


  // validate integers
  function validateStr(value) {
    if (!/[^0-9()]+[a-zA-Z]*/.test(value)) { return true };
  };

  function validateNum(value) {
    if (!/^[0-9]*(\.[0-9]+)?$/.test(value)) { return true };
  };


  // calculate total
  function calculateTotal(quantityValue, floatPrice) {
    return (quantityValue * floatPrice).toFixed(2)
  };


  // add values to local storage
  function addValuesToStorage(listSize, data) {

    // create unique id
    var key = 'item_' + listSize;
    localStorage.setItem('listSize', listSize);

    // add to storage
    localStorage.setItem(key, JSON.stringify(data));

  }


  // append values to the dom
  function appendValue(listRow, number) {

    // append values to incomplete table
    if (listRow["delete"] === 0) {
      $('#my-values').append(
        '<tr><td>'+listRow.name+
        '</td><td>'+listRow.quantity+
        '</td><td>$'+listRow.price+
        '</td><td>$'+listRow.total+
        // '</td><td><button type="button" class="btn btn-warning btn-sm delete-btn" id="item_'+(number-1)+'">Delete</button>'+
        '</td><td><div class="centered"><input type="checkbox" class="checkbox" id="item_'+(number-1)+'"></div>'+
        '</td></tr>');
    };

    $('#alert').html('<br>');

  };

  $(".checkbox").change(function() {
    if(this.checked) {
        console.log("hey")
    }
  });


  // grab id on button click
  $('.delete-btn').on('click', function(){

    console.log("test")

    elementId = $(this).attr('id')

    var grabItem = localStorage.getItem(elementId)

    // update complete value to 1
    data = jQuery.parseJSON(grabItem)
    data["delete"] = 1


    // update local storage
    localStorage.removeItem($(this).attr('id'));
    localStorage.setItem(elementId, JSON.stringify(data));

    // remove data from dom
    $(".table").find('tr:gt(0)').remove();

    // call the `getValues()` function to get new data
    getValues()

  });


  // get values from local storage
  function getValues() {

    // test to see if there are any items in storage
    var listCount = JSON.parse(localStorage.getItem("listSize"));

    // if so - loop through them, passing each to the `appendValue()` function
    if (localStorage.listSize != undefined ) {
      for (i=1;i<=listCount;i++) {
        var number = parseInt(i) + 1;
        var listRow = jQuery.parseJSON(localStorage.getItem("item_" + i));
        appendValue(listRow, number)
      };
    };
  };

  $('#show-btn').click(function() {
    $('#all-items').show();
    $('#show-btn').hide()
    $('#hide-btn').show();
  });

  $('#hide-btn').click(function() {
    $('#all-items').hide();
    $('#show-btn').show()
    $('#hide-btn').hide();
  });


});

