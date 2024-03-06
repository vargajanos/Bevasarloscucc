var app = angular.module('bevasarlas', []);
let kategoria = document.querySelector('#kategoria');
let termekekdropdown = document.querySelector('#termek');
let tablazat = document.querySelector('#lista');
let termekek = []

app.run(function(){


    axios.get('http://localhost:3000/termekek').then(res => {
        termekek = res.data;
        
        
        termekek.forEach(termek => {
            let option = document.createElement('option');  
            option.value = termek.category;
            option.innerText = termek.category;
            kategoria.appendChild(option);
    

            let option2 = document.createElement('option');
            option2.value = termek.productname;
            option2.innerText = termek.productname;
            termekekdropdown.appendChild(option2);

        });
        
    }); 


});