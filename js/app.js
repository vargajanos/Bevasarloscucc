var app = angular.module('bevasarlas', []);
let kategoria = document.querySelector('#kategoria');
let termekekdropdown = document.querySelector('#termek');
let tablazat = document.querySelector('#lista');
let termekek = []

app.run(function(){


    axios.get('http://localhost:3000/termekek').then(res => {
        termekek = res.data;
        
        let egyedikategoria =[];
    

        termekek.forEach(termek => {
             
            if (!egyedikategoria.includes(termek.category)) {
                egyedikategoria.push(termek.category);
                
                let option = document.createElement('option');  
                option.value = termek.category;
                option.innerText = termek.category;
                kategoria.appendChild(option);
            }


        });
        
    }); 

});

function termekekdropdownfeltoltes(){
    removeOptions(termekekdropdown);
    
    let option2 = document.createElement('option');
    option2.value = "Válassz";
    option2.innerText = "Válassz";
    termekekdropdown.appendChild(option2);

    let mennyiseg = document.querySelector('#mennyiseg');
    let egysegar = document.querySelector('#egysegar');
    let osszes = document.querySelector('#osszes');

    mennyiseg.value  = 1;
    egysegar.innerText ="Még nincs termék";
    osszes.innerText ="Még nincs termék";

    if(kategoria.innerText != "Válassz"){
        let kategoriaselect = document.querySelector('#kategoria');
        let kategoria = kategoriaselect.value;
    
    
        axios.get(`http://localhost:3000/termekek/${kategoria}`).then(res => {
    
        let termekek = res.data;
    
            termekek.forEach(termek=>{
    
                let option2 = document.createElement('option');
                option2.value = termek.productname;
                option2.innerText = termek.productname;
                termekekdropdown.appendChild(option2);
            })  
        })
        arfeltoltes();
    }


}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }
 
function arfeltoltes(){

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