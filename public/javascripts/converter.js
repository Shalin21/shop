
var flag = true;
$('.currency-selector').on('focusin', function(){
    //console.log("Saving value " + $(this).val());
    $(this).data('val', $(this).val());
    if(flag){
        $('#price').data('currency', parseInt($('#price').text()));
        flag=false;
    }
    
});

$('.currency-selector').on('change', function(){
    $('.currency-selector').blur();
    var currency = parseFloat($('#price').text());
    var prev = $(this).data('val');
    var current = $(this).val();
    if(current !== "USD"){
        $.ajax({ 
            type: "GET",
            dataType: "json",
            url: "https://api.exchangeratesapi.io/latest?base="+prev,
            success: function(data){                             
               $('#price').text((currency * parseFloat(data.rates[current])).toFixed(2));
            }
        });       
    }
   else
   {
    $('#price').text($('#price').data('currency'));
   }
});

