var app = angular.module('bevasarlas', ['ngRoute']);
let kategoria = document.querySelector('#kategoria');
let termekekdropdown = document.querySelector('#termek');
let tablazat = document.querySelector('#lista');



app.run(function($rootScope){

    $rootScope.hozzadotTermek = [];

    $rootScope.termekek = [];
    $rootScope.egyedikategoria =[];
    $rootScope.prodcut = [];
    $rootScope.mennyisegValue = 1;

    axios.get('http://localhost:3000/termekek').then(res => {
        $rootScope.termekek = res.data;
    

        $rootScope.termekek.forEach(termek => {
             
            if (!$rootScope.egyedikategoria.includes(termek.category)) {
                $rootScope.egyedikategoria.push(termek.category);
                   
            }
        });

       
    
        $rootScope.$apply();
    }); 


    $rootScope.termekekdropdownfeltoltes = function(){
        $rootScope.removeOptions(termekekdropdown);
    
        
        let selectedCategory = kategoria.value;
    
        axios.get(`http://localhost:3000/termekek/${selectedCategory}`)
        .then(response => {
            
            if (response.status === 200) {
                $rootScope.prodcut = []
                response.data.forEach(element => {
                    $rootScope.prodcut.push(element)
                });
                
                console.log($rootScope.prodcut)
                
                 
                
                if ($rootScope.prodcut && $rootScope.prodcut.length > 0) {
                    $rootScope.prodcut.forEach(product => {
                        
                        let option = document.createElement("option");
                        option.value = product.id;
                        option.text = product.productname;
                        termekekdropdown.appendChild(option);
                    });
                } else {
                    console.log("No products found for the selected category.");
                }
 
                 
            } else {
                console.log("Failed to retrieve data from the server.");
            }
        })
        .catch(error => {
            
            console.error("Error fetching data:", error);
        });
    };
    


    $rootScope.removeOptions = function(selectElement) {
        selectElement.innerHTML = '';
    }

    $rootScope.arfeltoltes = function() {
        
        let termekdropdown = document.querySelector('#termek');
        let mennyiseg = document.querySelector('#mennyiseg');
        let egysegar = document.querySelector('#egysegar');
        let osszes = document.querySelector('#osszes');
    
        let index = termekekdropdown.selectedIndex;


        let selectedProduct = termekdropdown.options[index].text;
        let selectedProductObject = $rootScope.prodcut.find(product => product.productname === selectedProduct);
    
        if (selectedProductObject) {
            egysegar.innerText = selectedProductObject.price;
            osszes.innerText =  Number(selectedProductObject.price) * Number(mennyiseg.value);
        } else {
            mennyiseg.value = 1;
            egysegar.innerText = "Még nincs termék";
            osszes.innerText = "Még nincs termék";
        }
    }
    
   $rootScope.updatePrice = function(item) {
        console.log("Item:", item);
        console.log("Products:", $rootScope.prodcut);
    
        let product = $rootScope.termekek.find(p => {
            console.log("Comparing:", p.id, item.id);
            return p.id == item.id;
        });
    
        if (product) {
            item.ar = product.price;
            item.osszeg = item.mennyiseg * product.price;
        } else {
            console.log("Product not found:", item.id);
        }
    };
    
    
    
    
    

    $rootScope.tablazattoltes = function() {
        let kategoriadropdown = document.querySelector('#kategoria');
        let termekdropdown = document.querySelector('#termek');
        let mennyiseg = document.querySelector('#mennyiseg');
        let egysegar = document.querySelector('#egysegar');
        let osszes = document.querySelector('#osszes');
    
        
        let index = termekekdropdown.selectedIndex;

        let newItem = {
            id: termekdropdown.value,

            category: kategoriadropdown.value,
            termek: termekdropdown.options[index].text,
            mennyiseg: parseInt(mennyiseg.value),
            ar: egysegar.innerText,
            osszeg: osszes.innerText
        };
    
        $rootScope.hozzadotTermek.push(newItem);
    }


    $rootScope.removeItem = function(index) {
        $rootScope.hozzadotTermek.splice(index, 1);
        $rootScope.arfeltoltes(); 
    }
    

});

 
