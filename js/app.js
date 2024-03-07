var app = angular.module('bevasarlas', ['ngRoute','ngChange']);
let kategoria = document.querySelector('#kategoria');
let termekekdropdown = document.querySelector('#termek');
let tablazat = document.querySelector('#lista');


let hozzadotTermek = [];

app.run(function($rootScope){

    $rootScope.termekek = [];
    $rootScope.egyedikategoria =[];
    $rootScope.prodcut = [];

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
        removeOptions(termekekdropdown);
        axios.get(`http://localhost:3000/termekek/${kategoria.value}`).then(res => {
            $rootScope.prodcut = res.data;
        })
        console.log($rootScope.prodcut)
    }


    $rootScope.removeOptions = function(){
        var i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
           selectElement.remove(i);
        }
    }

    $rootScope.arfeltoltes = function(){
        let kategoriadropdown = document.querySelector('#kategoria');
        let termekdropdown = document.querySelector('#termek');
        let mennyiseg = document.querySelector('#mennyiseg');
        let egysegar = document.querySelector('#egysegar');
        let osszes = document.querySelector('#osszes');
    
    
        if (kategoriadropdown.innerText!="Válassz") {
    
        termekek.forEach(termek=>{
            if(termek.productname == termekdropdown.value && kategoriadropdown.value == termek.category)  
            {
                egysegar.innerText = termek.price
    
                osszes.innerText =  Number(termek.price) * Number(mennyiseg.value)
            }   
    
        })  
    
        }
        else{
            mennyiseg.value = 1;
            egysegar.innerText ="Még nincs termék";
            osszes.innerText ="Még nincs termék";
        }
    }

    $rootScope.tablazattoltes = function(){
        let kategoriadropdown = document.querySelector('#kategoria');
        let termekdropdown = document.querySelector('#termek');
        let mennyiseg = document.querySelector('#mennyiseg');
        let egysegar = document.querySelector('#egysegar');
        let osszes = document.querySelector('#osszes');
    
        hozzadotTermek.push(kategoriadropdown.value)
        hozzadotTermek.push(termekdropdown.value);
        hozzadotTermek.push(mennyiseg.value);
        hozzadotTermek.push(egysegar.value);
        hozzadotTermek.push(osszes.value);
    }


    

});

 
