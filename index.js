var express   = require('express');
var app       = express();
var swig = require('swig');
var bodyParser = require('body-parser');
var Razorpay = require('razorpay');
var instance = new Razorpay({
  key_id: 'rzp_test_ZhHxIMoMDhF3oW',
  key_secret: 'y3TURMeqnU1tZbQb1lXHnZi8'
})
// these line is important. Include it before setting up the webhook handler.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('views', __dirname + '/views');
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

var amount= 2000,
    currency='INR',
    receipt = '1234545f4',
    payment_capture =true,
    notes ="something",
    order_id,payment_id;

app.get('/', (req, res) => {
    
instance.orders.create({amount, currency, receipt, payment_capture, notes}).then((response) => {
    console.log("**********Order Created***********");
    console.log(response);
    console.log("**********Order Created***********");
order_id=response.id;

}).catch((error) => {
  console.log(error);
})
// instance.payments.capture(order_id, amount).then((response) => {
//     console.log(response);
// }).catch((error) => {
//   console.log(error);
// });
res.render(
      'index',
      {order_id:order_id,amount:amount}
    );

});
/*****************
 * Payment status*
 *****************/
app.post('/purchase', (req,res) =>{
    payment_id =  req.body;
    console.log("**********Payment authorized***********");
    console.log(payment_id);
    console.log("**********Payment authorized***********");
    instance.payments.fetch(payment_id.razorpay_payment_id).then((response) => {
    console.log("**********Payment instance***********");
    console.log(response); 
    console.log("**********Payment instance***********")
    instance.payments.capture(payment_id.razorpay_payment_id, response.amount).then((response) => {
    res.send(response);
}).catch((error) => {
  console.log(error);
});


}).catch((error) => {
  console.log(error);
});

})

app.listen(3000, () => {

    console.log('Example app listening on port 3000!')

})