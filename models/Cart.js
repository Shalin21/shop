module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = item.price;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;

    }
    this.remove = function(id){
        var storedItem = this.items[id];
        if(storedItem){
            if(storedItem.qty >1){
                this.totalPrice -= storedItem.item.price;
                storedItem.qty--;
            }
            else{
                this.totalPrice -= storedItem.item.price;
                this.totalQty--;
                delete  this.items[id];
            }                  
        }
    }
    this.removeAll = function(){
        this.items = {};
        this.totalQty =  0;
        this.totalPrice =  0;
    }

    this.toArray = function(){
        var arr = []
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }

};