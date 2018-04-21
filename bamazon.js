const mysql = require("mysql"),
    inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});

function displayProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].id + "\nName: " + res[i].productName +
                "\nPrice: " + res[i].price + "\n \n");
        }
        runQuery();
    });
}

function runQuery() {
    inquirer.prompt([{
            type: "input",
            name: "id",
            message: "Please enter the ID of the product you wish to purchase",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "Please enter the quantity you wish to purchase",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function(answers) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { id: answers.id }, function(err, res) {
            if (err) throw err;
            var id = res[0].id;
            var newQuant = res[0].stockQuantity - answers.quantity,
                orderPrice = res[0].price * answers.quantity;
            var totalSales = res[0].product_sales + orderPrice;
            if (res[0].stockQuantity < answers.quantity) {
                console.log("Insufficient Quantity!");
                connection.end();
            } else {
                connection.query('UPDATE products SET ? WHERE id = ?', [{ stockQuantity: newQuant, product_sales: totalSales }, id],
                    function(err, res) {
                        console.log("Order successful! Total cost: $" + orderPrice);
                        inquirer.prompt([{
                            name: "confirm",
                            type: "confirm",
                            message: "Make another purchase?"
                        }]).then(function(answers) {
                            if (answers.confirm === true) {
                                displayProducts();
                            } else {
                                connection.end();
                            }
                        })

                    });
            }
        });
    })

}