let marca = document.querySelector("#marca");
let anio = document.querySelector("#anio");
let btnCotizar = document.querySelector("#cotizar");
let formulario = document.querySelector("#formulario");
let tipoSeguro =document.querySelectorAll(".tipo-seguro");
let checkTipo;

function prepareForm(){
//models for the select
    let marcas = ["americano", "japones","europeo"];
    for(let i =0; i < marcas.length; i++){
        marca.innerHTML+=`<option value="${marcas[i]}">${marcas[i]}</option>`;
    }

    //years for the select
    let year = new Date().getFullYear();
    let limit=20;
    let min = year - limit;
    for(let i = year; i >= min; i--){
        anio.innerHTML+=`<option value="${i}">${i}</option>`;
    }

    //type of ensurance
    for(let i=0 ; i < tipoSeguro.length; i++){
        tipoSeguro[i].addEventListener("click",checkEnsurance);
    }

    function checkEnsurance(e){
        e.stopPropagation();
        checkTipo = e.target.value;
    }
}
prepareForm();

//creating an interface
class Interfaz{

    showError(type,...message){
        if(type && message){
            const div = document.createElement('div');
            let messageText;
            let text; 
            for(let i=0; i <message.length; i++){
                messageText = document.createElement('h5');
                text = document.createTextNode(message[i]);
                messageText.appendChild(text);
                div.appendChild(messageText);
            }

            if(type.trim()=="error"){
                div.classList.add("error");
                div.classList.add("message-box");
            }else if(type.trim()=="success"){
                div.classList.add("success");
                div.classList.add("message-box");   
            }  
            let divExist = document.querySelector(".message-box");

            if(divExist==null){
                //formulario.appendChild(div);
                formulario.insertBefore(div,document.querySelector("#init"));
                setTimeout(() => {
                    formulario.removeChild(formulario.firstElementChild);           
                }, 3000);
            }else if(divExist!=null){
                formulario.removeChild(formulario.firstElementChild);
                formulario.insertBefore(div,document.querySelector("#init"));
                //formulario.appendChild(div);
                
            }
            

        }
    }
    
    showResult(seguro,total){
        if(seguro && total){
            const divR = document.createElement("div");
            divR.classList="result-box";
            divR.innerHTML=`<h5>Marca : ${seguro.marca}</h5>
            <h5>Año : ${seguro.anio}</h5>
            <h5>Tipo : ${seguro.tipo}</h5>
            <h5>Total: ${total}</h5>`;
            if(document.querySelector(".result-box")!=null){
                formulario.removeChild(formulario.lastElementChild);
                formulario.appendChild(divR);
            }else{
                formulario.appendChild(divR);
            }
        }
    }
}


//constructor
class Seguro{
    constructor(marca,anio,tipo){
        this.marca = marca;
        this.anio = anio;
        this.tipo = tipo;
    }

    cotizarSeguro(info){
        const base = 2000;
        let costo;
        if(info.marca==="americano"){
            costo = (base * 1.15);
        }else if(info.marca==="japones"){
            costo = (base * 1.05);
        }else if(info.marca==="europeo"){
            costo = (base * 1.35);
        }
        //obtener año actual
        const diferencia = (new Date().getFullYear() - info.anio);
        //cada año de diferencia hay que reducir 3% el valor del seguro 
        const porcentaje = (costo/100 )*3;
        let total = costo - (porcentaje * diferencia);
    
        if(info.tipo=="basico"){
            total *= 1.30;
        }else if(info.tipo=="completo"){
            total *= 1.50;
        }
        return total;
    }
    
}



//listeners
btnCotizar.addEventListener("click",(e)=>{
    let marcaS = marca.options[marca.selectedIndex].value;
    let anioS = anio.options[anio.selectedIndex].value;
    
    const interfaz = new Interfaz();

    //validando formulario
    if( marcaS.trim()==="" && anioS.trim()==="" && checkTipo!=undefined){
        interfaz.showError("error","Marca no seleccionada","Año no seleccionado");
    }else if( marcaS.trim()!=="" && anioS.trim()==="" && checkTipo==undefined){
        interfaz.showError("error","Año no seleccionado"," Tipo de seguro no seleccionado");
    }else if(marcaS.trim()==="" && anioS.trim()==="" && checkTipo==undefined){
        interfaz.showError("error","Marca no seleccionada","Año no seleccionado","Tipo de seguro no seleccionado");
    }else if(marcaS.trim()==="" && anioS.trim()!=="" && checkTipo!=undefined){
        interfaz.showError("error","Marca no seleccionada");
    }else if(anioS.trim()==="" && marcaS.trim()!=="" && checkTipo!=undefined){
        interfaz.showError("error","Año no seleccionado");
    }else if( marcaS.trim()!=="" && anioS.trim()!=="" && checkTipo==undefined){
        interfaz.showError("error","Tipo de seguro no seleccionado");
    }else if(marcaS.trim()!=="" && anioS.trim()!=="" && checkTipo!=undefined){
        interfaz.showError("success","Solicitud realizada con exito!");
        const seguro = new Seguro(marcaS,anioS,checkTipo);
        //seguro.showResult();
        const total = seguro.cotizarSeguro(seguro);

        interfaz.showResult(seguro,total);
    }
});
