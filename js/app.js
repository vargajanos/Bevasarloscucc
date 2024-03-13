var app = angular.module('bevasarlas', ['ngRoute']);

let kategoria = document.querySelector('#kategoria');
let termekekdropdown = document.querySelector('#termek');
let listak_dropdown = document.querySelector('#listak');
let list_name = document.querySelector("#list_name")
let mennyiseg = document.querySelector('#mennyiseg');
let egysegar = document.querySelector('#egysegar');
let osszes = document.querySelector('#osszes');


app.run(function($rootScope){

    $rootScope.hozzadotTermek = [];
    $rootScope.listak = [];
    
    $rootScope.ossz_termekek = [];
    $rootScope.egyedikategoria =[];
    $rootScope.prodcut = [];
    $rootScope.mennyisegValue = 1;


    axios.get('http://localhost:3000/termekek').then(res => {
        $rootScope.ossz_termekek = res.data;
        $rootScope.ossz_termekek.forEach(termek => {
            if (!$rootScope.egyedikategoria.includes(termek.category)) {
                $rootScope.egyedikategoria.push(termek.category);
            }
        });
        $rootScope.$apply();
    });

    axios.get('http://localhost:3000/lista').then(res=>{
        $rootScope.listak = res.data
        $rootScope.$apply();
    })

    $rootScope.termekekdropdownfeltoltes = function(){
        termekekdropdown.innerHTML = '';

    
        let selectedCategory = kategoria.value;
    
        axios.get(`http://localhost:3000/termekek/category/${selectedCategory}`)
        .then(response => {
            
            if (response.status == 200) {
                $rootScope.prodcut = []
                response.data.forEach(element => {
                    $rootScope.prodcut.push(element)

                });
                
                $rootScope.prodcut.forEach(product => {
                        
                    let option = document.createElement("option");
                    option.value = product.id;
                    option.text = product.productname;
                    termekekdropdown.appendChild(option);
                });

                $rootScope.arfeltoltes();
            }
        })

    $rootScope.arfeltoltes = function() {
        
        let index = termekekdropdown.selectedIndex;

        let selectedProduct = termekekdropdown.options[index].text;
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
        
        let product = $rootScope.ossz_termekek.find(p => p.id == item.id);
    
        if (product) {
            item.ar = product.price;
            item.osszeg = item.mennyiseg * product.price;
        }
    };
    
    
    $rootScope.tablazattoltes = function() {

        let index = termekekdropdown.selectedIndex;

        let newItem = {
            id: termekekdropdown.value,

            category: kategoria.value,
            termek: termekekdropdown.options[index].text,
            mennyiseg: parseInt(mennyiseg.value),
            ar: egysegar.innerText,
            osszeg: osszes.innerText
        };
    
        $rootScope.hozzadotTermek.push(newItem);
    }

    $rootScope.OsszesSzamitas = function() {
        let total = 0;
        $rootScope.hozzadotTermek.forEach(function(item) {
            total += parseFloat(item.osszeg);
        });
        return total;
    };

    $rootScope.removeItem = function(index) {
        $rootScope.hozzadotTermek.splice(index, 1);
        $rootScope.arfeltoltes(); 
    }

    $rootScope.ListaTorlese = function() {
        $rootScope.hozzadotTermek = [];
    };
    

    $rootScope.ListaMentesAdatbazisba = function() {
        let data = {
            name: list_name.value
        }
        let list_id = 0

        axios.post('http://localhost:3000/lista', data)
        .then(res => {
            list_id = res.data.insertId
            
            $rootScope.hozzadotTermek.forEach(termek => {
                let data = {
                    termek_id: termek.id,
                    count: termek.mennyiseg
                }

                axios.post(`http://localhost:3000/lista/${list_id}`,data).then(res=>{
                    console.log(res)
                })
            });
        })
    };

    $rootScope.load_list = function(){
        
        let selected_id = listak_dropdown.value
        console.log(selected_id)
        $rootScope.hozzadotTermek = []
        axios.get(`http://localhost:3000/lista/${selected_id}`).then(res=>{
            console.log(res.data)
            
            res.data.forEach(adat => {
                axios.get(`http://localhost:3000/termekek/id/${adat.termek_id}`).then(res=>{
                    let listas_termek = {
                        id: res.id,
                        category: res.data.category,
                        termek: res.data.productname,
                        mennyiseg: adat.count,
                        ar: res.data.price,
                        osszeg: Number(res.data.price) * Number(adat.count)
                    }
                    $rootScope.hozzadotTermek.push(listas_termek)
                })
            });
            console.log($rootScope.hozzadotTermek)
        })
    }
    
}});

app.directive('ngChangeManual', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('change', function() {
                scope.arfeltoltes();
            });
        }
    };
});

