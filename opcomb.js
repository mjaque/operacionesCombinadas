window.onload = iniciar;

class Operacion{
	constructor(){
		this._numeros = [];
		this._operadores = [];
		this._numeros.push(new Expresion());	//Cargamos el primero
		for (let i = 0; i < niveles[nivel].numOperaciones; i++){
			//Evitamos dos divisiones seguidas
			var operador = niveles[nivel].operadores[Math.floor(Math.random() * niveles[nivel].operadores.length)];
			if (this._operadores.length > 1)
				if (this._operadores[this._operadores.length - 1] == '/')
					do{
						operador = niveles[nivel].operadores[Math.floor(Math.random() * niveles[nivel].operadores.length)];
					}while (operador != '/');
			
			this._operadores.push(operador);
			if (operador == '/'){
				this._numeros.push(this._numeros[this._numeros.length - 1]);
				var expresion = new Expresion();
				var expresion2 = new Expresion(this._numeros[this._numeros.length - 2].ver() * expresion.ver());
				this._numeros[this._numeros.length - 2] = expresion2;
			}
			else{
				this._numeros.push(new Expresion());
			}
		}
	}
	
	ver(){
		var texto = "" + this._numeros[0].ver();
		for(let i = 1; i < this._numeros.length; i++){
			texto += this._operadores[i-1];
			if (this._numeros[i].ver() < 0){
				texto += "(" + this._numeros[i].ver() + ")";
			}
			else{
				texto += this._numeros[i].ver();
			}
		}
		return texto;
	}
}

//Expresión - Puede ser un número o una operación
class Expresion{
	constructor(a){
		if (a)
			this._a = a;
		else if (Math.random() > niveles[nivel].probSubOperacion)
			this._a = this.aleatorio();
		else{
			this._a = new Operacion();
		}
	}
	
	aleatorio(){
		var numDec = niveles[nivel].numDecimales;
		if (Math.random() > niveles[nivel].probDecimal)
			numDec = 0;
		return Math.floor(Math.random()*(niveles[nivel].limiteSuperior - niveles[nivel].limiteInferior)*Math.pow(10,numDec))/Math.pow(10,numDec) + niveles[nivel].limiteInferior;
	}
	
	ver(){
		if (typeof this._a == 'number'){
			return this._a;
		}
		else{;
			return "(" + this._a.ver() + ")";
		}
	}
}



var niveles = [
	{
	'operadores' : ['+', '-'],
	'numOperaciones': 2,
	'limiteInferior' : 0,
	'limiteSuperior' : 10,
	'probDecimal'    : 0,
	'numDecimales'	 : 0,
	'probSubOperacion' : 0
	},
	{
	'operadores' : ['+', '-', '*'],
	'numOperaciones': 2,
	'limiteInferior' : 0,
	'limiteSuperior' : 10,
	'probDecimal'    : 0,
	'numDecimales'	 : 0,
	'probSubOperacion' : 0
	},
	{
	'operadores' : ['+', '-', '*', '/'],
	'numOperaciones': 2,
	'limiteInferior' : 0,
	'limiteSuperior' : 10,
	'probDecimal'    : 0,
	'numDecimales'	 : 0,
	'probSubOperacion' : 0
	}
];

var nivel = 0;
var puntos = 0;

var operacion;
var textoOperacion;

var spanOperacion;
var tfRespuesta;
var btnComprobar;
var pResultado;
var spanNivel;
var spanPuntos;
var numFallosNivel;
var numAciertosSeguidos;

function iniciar(){
	spanOperacion = document.getElementById("operacion");
	tfRespuesta = document.getElementById("respuesta");
	btnComprobar = document.getElementById("comprobar");
	pResultado = document.getElementById("resultado");
	spanNivel = document.getElementById("nivel");
	spanPuntos = document.getElementById("puntos");
	
	btnComprobar.addEventListener('click', comprobar);
	tfRespuesta.addEventListener("keyup", function(event){
		event.preventDefault();
		if (event.keyCode === 13) {
			btnComprobar.click();
		}
	});
	
	numFallosNivel = 0;
	numAciertosSeguidos = 0;
	
	verPuntosNivel();
	ponerOperacion();
}

function ponerOperacion(){
	operacion = new Operacion();
	spanOperacion.innerHTML = traducir(operacion);
	
	tfRespuesta.value = '';
	tfRespuesta.focus();

}

function traducir(operacion){
	textoOperacion = " " + operacion.ver();
	console.log(textoOperacion);
	textoOperacion = textoOperacion.replace(/\*/g, "·");
	textoOperacion = textoOperacion.replace(/\//g, "&#247;");
	textoOperacion += " = ";
	
	return textoOperacion;
}

function comprobar(){
	
	if(isNaN(tfRespuesta.value)){
		pResultado.innerHTML = "No entiendo lo que has contestado.";
		return;
	}
	if (eval(tfRespuesta.value) == eval(operacion.ver())){
		pResultado.innerHTML = "¡Correcto!";
		if (puntos == 0)
			puntos = 1 * (nivel + 1);
		else
			puntos += puntos * (nivel + 1);
		numAciertosSeguidos++;
		if (numAciertosSeguidos == 5){
			nivel++;
			numAciertosSeguidos = 0;
			numFallosNivel = 0;
		}
	}
	else{
		pResultado.innerHTML = "Incorrecto: " + textoOperacion + eval(operacion.ver());
		puntos -= (nivel + 1);
		if (puntos < 0)
			puntos = 0;
		numFallosNivel++;
		if (numFallosNivel == 2){
			if (nivel > 0){
				nivel--;
				numFallosNivel = 0;
				numAciertosSeguidos = 0;
			}
		}
	}
	verPuntosNivel();
	setTimeout(ponerOperacion, 700);
}

function verPuntosNivel(){
	spanNivel.innerHTML = nivel + 1;
	spanPuntos.innerHTML = puntos;
}