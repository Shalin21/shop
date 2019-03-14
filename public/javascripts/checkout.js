var checkoutHandler = StripeCheckout.configure({
    key: "pk_test_uxLcI1pIZ2nVdx28PXgKBlRj",
    locale: "auto"
  });

var button = document.getElementById("buttonCheckout");
button.addEventListener("click", function(ev) {
  checkoutHandler.open({
    name: "Sample Store",
    description: "Example Purchase",
    token: handleToken
  });
});

function handleToken(token) {
    fetch("/cart/charge", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(token)
    })
    .then(output => {
      if (output.status === "succeeded")
        document.getElementById("shop").innerHTML = "<p>Purchase complete!</p>";
    })
  }