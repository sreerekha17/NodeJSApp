
const Datastore = require("nedb");
// const Item = require("./item");
// const Order = require("./order");


class OrderDB {
  constructor() {
    this.db = new Datastore({ filename: './order.db'});

    this.db.loadDatabase(function(err) {
      if (err != null) console.log(err);
      else console.log('Database loaded');   
    });
  }
  
  addOrder(order, callback) {
     this.db.insert(order, function(err, newDoc) {
         if (err == null) {
             callback(newDoc);
         } else {
           console.log(err);
         }
         
     });
  }
  
  getOrders(callback) {
    this.db.find({}, function(err, docs) {
       if (err == null ) {
         callback(docs);
       } else {
         console.log(err);
       }
    })
  }
  
  updateOrder(id, order, callback) {
    this.db.update({_id: id}, {items: order.items}, function(err, numReplaced) {
       if (err == null ) {
         callback(numReplaced);
       } else {
         console.log(err);
       }
    })   
  }
  
  findOrder(id, callback) {
    this.db.findOne({_id: id}, function(err, doc) {
       if (err == null ) {
         callback(doc);
       } else {
         console.log(err);
       }
    })   
  }
}

module.exports = OrderDB;


// let db = new OrderDB();
// let a = new Item('Hammer', 10);
// let b = new Item('Saw', 18);
// let o = new Order();
// o.addItem(a);
// o.addItem(b);
// //o.addItem(b);
// console.log(o);
// db.addOrder(o, (newDoc)=>{console.log(newDoc._id);});
// db.getOrders(docs => {console.log(docs)});
// //db.updateOrder('0C96A4SKzrYuTlFh', o, numReplaced => console.log(numReplaced));
// db.findOrder('0C96A4SKzrYuTlFh', doc => console.log(doc));
