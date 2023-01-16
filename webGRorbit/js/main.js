// var i;
//====================================================================================
/* 
    <GlowScript>

    GlowScript makes it easy to write programs in JavaScript 
    that generate navigable real-time 3D animations, 
    using the WebGL 3D graphics library available in modern browsers.

    see more: https://github.com/vpython/glowscript
*/
window.__context = {
    glowscript_container: $("#glowscript").removeAttr("id")
};
// Some texture
textures.MilkyWay = "https://raw.githubusercontent.com/Jeffreymaomao/General_Relativity_Precession/main/assets/re8kMilkyWay.jpg";
textures.Sun = "https://raw.githubusercontent.com/Jeffreymaomao/General_Relativity_Precession/main/assets/Sun.jpg";
textures.Earth = "https://raw.githubusercontent.com/Jeffreymaomao/General_Relativity_Precession/main/assets/8kEarth.jpg";

//====================================================================================
/*
    <MathQuill>

    MathQuill is a web formula editor designed 
    to make typing math easy and beautiful.

    see more: https://github.com/mathquill/mathquill
*/

var MQ = MathQuill.getInterface(2);
// For all the static 
var StaticLatexId = ["M0","M0unit","R0","R0unit","V0","V0unit","dt","dtunit"];
for(i=0;i<StaticLatexId.length;i++){
    var latex = document.getElementById(StaticLatexId[i]);
    MQ.StaticMath(latex);
}
// 4 different intial value input 
var M0input = document.getElementById('M0input');
var R0input = document.getElementById('R0input');
var V0input = document.getElementById('V0input');
var dtinput = document.getElementById('dtinput');

var M0mathField = MQ.MathField(M0input, {
    handlers: {
        edit: function() {
            var latex = M0mathField.latex();
            if(latex==undefined){latex="1"}
            if(latex==0){latex="1"}
            Data.M = latex2math(latex);
            initRef.selectedIndex = 0;
            init();
        }
    }
});

var R0mathField = MQ.MathField(R0input, {
    handlers: {
        edit: function() {
            var latex = R0mathField.latex();
            if(latex==undefined){latex="1"}
            if(latex==0){latex="1"}
            Data.r0 = latex2math(latex);
            Y0 = new vec6(Data.r0, 0, 0, 0, 0, Data.v0);
            initRef.selectedIndex = 0;
            init();
        }
    }
});
var V0mathField = MQ.MathField(V0input, {
    handlers: {
        edit: function() {
            var latex = V0mathField.latex();
            if(latex==undefined){latex="1"}
            if(latex==0){latex="1"}
            Data.v0 = latex2math(latex);
            Y0 = new vec6(Data.r0, 0, 0, 0, 0, Data.v0);
            initRef.selectedIndex = 0;
            init();
        }
    }
});
var DtmathField = MQ.MathField(dtinput, {
    handlers: {
        edit: function() {
            var latex = DtmathField.latex();
            if(latex==undefined){latex="1"}
            if(latex==0){latex="1"}
            dt = latex2math(latex);
            initRef.selectedIndex = 0;
            init();
        }
    }
});


//====================================================================================
/* Runge Kutta function: js/RungeKutta.js */
var rk = RK3;

function rgb(r, g, b) {
    return vec(r / 255, g / 255, b / 255)
}
//====================================================================================
var Data = {
    G: 2.9593e-4,  // gravitational constant (AU^3/M☉/day^2)
    c: 1.7314e2,   // speed of light (AU/day)
    M: 1,          // solar mass (M☉)
    r0: 0.3074,    // Perihelion radius (AU)
    v0: 0.0340,    // Perihelion velocity (AU/day)
}
var Rsolar =  Data.r0/10
var Rplanet = Data.r0/20

function f(t, Y) {
    var gamma, r,a,f0,f1,f2,f3,f4,f5;
    r = Y.position.mag;
    gamma = 6 * Data.r0 ** 2 * Data.v0 ** 2 / Data.c ** 2;
    a =Data.G * Data.M / r ** 2 * (1 + gamma / r ** 2);
    f0 = Y.vx;
    f1 = Y.vy;
    f2 = Y.vz;
    f3 = -a * Y.px / r;
    f4 = -a * Y.py / r;
    f5 = -a * Y.pz / r;
    return new vec6(f0, f1, f2, f3, f4, f5)
}

var Y0 = new vec6(Data.r0, 0, 0, 0, 0, Data.v0)
var Y = Y0
var t = 0
var dt = 0.001
//------------------------------------------------------------------------------------
// Scene setting
let Scene = canvas({
    background:rgb(0,0,0),
    center:vec(0, 0, 0),
    init: function (){
        this.userzoom = true;
        this.lights[0].visible = false;
        this.lights[1].visible = false;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
})
window.addEventListener('resize', function(){
    Scene.width = window.innerWidth;
    Scene.height = window.innerHeight;
});

Scene.init()
Scene.camera.pos = vec(1, 1.3, 1).multiply(2 * Data.r0);
Scene.camera.axis = Scene.camera.pos.multiply(-1);
//------------------------------------------------------------------------------------
// Object

var Spheres = {
    backgroundScale: 7,
    Universe: sphere({
        pos: vec(0, 0, 0),
        radius: this.backgroundScale * Data.r0,
        emissive: true
    }),
    Solar: sphere({
        pos:vec(0, 0, 0),
        v: vec(0, 0, 0),
        radius: Rsolar,
        emissive : true,
    }),
    SolarLight: local_light({
        pos: vec(0, 0, 0),
        color: rgb(255, 100, 30),
    }),
    Planet: sphere({
        make_trail: true,
        trail_radius: Rplanet / 40,
        trail_color: color.yellow,
        pos: Y.position,
        v: Y.velocity,
        radius: Rplanet
    }),
    __texture: false, 
    get texture(){
        return this.__texture;
    },
    set texture(bool){
        this.__texture = bool;
        if(this.__texture){
            this.Universe.color = rgb(255,255,255);
            this.Solar.color = rgb(255,255,255);
            this.Planet.color = rgb(255,255,255);
            this.Universe.texture = textures.MilkyWay;
            this.Solar.texture = textures.Sun;
            this.Planet.texture = textures.Earth;
        }else{
            this.Universe.color = rgb(0,0,0);
            this.Solar.color = rgb(219,102,42);
            this.Planet.color = rgb(50,135,204);
            this.Universe.texture = null;
            this.Solar.texture = null;
            this.Planet.texture = null;
        };
    },
    StartInit: function(){
        // this.texture = true;
        this.texture = true;
        this.Planet.__trail_object.__trail.emissive = true;
        this.Planet.clear_trail();
        this.Universe.radius = this.backgroundScale*Data.r0;
    },
    init: function(){
        this.Solar.radius = Data.r0/10;
        this.Planet.radius = Data.r0/20;
        this.Planet.__trail_object.__trail.emissive = true;
        this.Planet.clear_trail();
        this.Universe.radius = this.backgroundScale*Data.r0;
    },
    update: function(GeneralVector){
        this.Planet.pos = GeneralVector.position;
        this.Planet.v = GeneralVector.velocity;
    }
}
Spheres.StartInit();
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
// axis arrow
var Axis = {
    x: arrow({
        color: color.red,
        axis: vec(1,0,0)
    }),
    y: arrow({
        color: color.green,
        axis: vec(0,1,0)
    }),
    z: arrow({
        color: color.blue,
        axis: vec(0,0,1)
    }),
    __pos: vec(0,0,0),
    __length: 0.2,
    __width: 0.001,
    __visible: false,
    __emissive: true,

    get pos(){
        return this.__pos;
    },
    get length(){
        return this.__length;
    },
    get width(){
        return this.__width;
    },
    get visible(){
        return this.__visible;
    },
    get emissive(){
        return this.__emissive;
    },

    set pos(vec3){
        this.x.pos = vec3;
        this.y.pos = vec3;
        this.z.pos = vec3;
    },
    set length(float){
        this.__length = float;
        this.pos = this.__pos;
        this.x.axis = this.pos.add(this.x.axis.multiply(this.__length));
        this.y.axis = this.pos.add(this.y.axis.multiply(this.__length));
        this.z.axis = this.pos.add(this.z.axis.multiply(this.__length));
    },
    set width(float){
        this.__width = float;
        this.x.shaftwidth = this.__width;
        this.y.shaftwidth = this.__width;
        this.z.shaftwidth = this.__width;
    },
    set visible(bool){
        this.x.visible = bool;
        this.y.visible = bool;
        this.z.visible = bool;
    },
    set emissive(bool){
        // axis.__components = [box, pyramid]
        this.x.__components[0].emissive = bool;
        this.y.__components[0].emissive = bool;
        this.z.__components[0].emissive = bool;
        this.x.__components[1].emissive = bool;
        this.y.__components[1].emissive = bool;
        this.z.__components[1].emissive = bool;
    },
    open: function(){
        this.x.visible = true;
        this.y.visible = true;
        this.z.visible = true;
    },
    close: function () {
        this.x.visible = false;
        this.y.visible = false;
        this.z.visible = false;
    },
    init: function(){
        this.pos = vec(0,0,0);
        this.length = 0.2;
        this.width = 0.001;
        this.emissive = true;
        this.visible = false;
    }
}

Axis.init()

//-----------------------------------------------------------------------------------
// button & check box
var running = false;
/*
    < Oject.addEventListener() >
CAN NOT WRITE IN THE OBJECT HRUNCTION
NEED TO WRITE IT IN LAST PART OF THE main().
*/
// Controllers.init();

var Title = document.getElementsByClassName("Title")[0];
var ShowTitle = document.getElementById("ShowTitle");

var SideBar = document.getElementById("SideBar");
var SideBarIcon = document.getElementById("SideBarIcon");

var RunningButton = document.getElementById("RunningButton")
var RunIcon = document.getElementById("run")
var RestartButton = document.getElementById("RestartButton")
var StopButton = document.getElementById("StopButton")
var AxisCheckBox = document.getElementById("AxisCheckBox")
var TextureCheckBox = document.getElementById("TextureCheckBox")
var ScrollCheckBox = document.getElementById("ScrollCheckBox")

ShowTitle.addEventListener("click",function() {
    Title.classList.toggle("TitleToogle");
});

SideBarIcon.addEventListener("click",function() {
    SideBar.classList.toggle("SideBarToogle");
});

RunningButton.addEventListener("click",function () {
    running = !running;
    if(!running){
        RunIcon.id = "run"  // show run icon when not running
    }else{
        RunIcon.id = "pause" // show pause icon when running
    }
});

RestartButton.addEventListener("click",function () {
    init();
})

StopButton.addEventListener("click",function () {
    window.clearInterval(UpdateInterval);
    RunningButton.appendChild(document.createTextNode(" ( NOT WORK ) "));
    RestartButton.appendChild(document.createTextNode(" ( NOT WORK ) "));
});

AxisCheckBox.addEventListener("click",function () {
    Axis.visible = AxisCheckBox.checked;
});

TextureCheckBox.addEventListener("click",function () {
    Spheres.texture = TextureCheckBox.checked;
});

ScrollCheckBox.addEventListener("click",function () {
    Scene.userzoom = ScrollCheckBox.checked;
});

var selectFocus = document.getElementById("CameraFocus");
function changeFocus(){
    if(selectFocus.value=="none"){
        Scene.camera.follower = null;
    }else if(selectFocus.value=="solar"){
        Scene.camera.follower = Spheres.Solar;
    }else if(selectFocus.value=="planet"){
        Scene.camera.follower = Spheres.Planet;
    }
}

var initRef = document.getElementById("InitialValueReference");
function changeRef(){
    if(initRef.value=="suggestion"){
        M0mathField.latex("1000000");
        R0mathField.latex("0.3074");
        V0mathField.latex("40.6");
        DtmathField.latex("0.000005");
        initRef.selectedIndex = 1;
    }else if(initRef.value=="mercury"){
        M0mathField.latex("1");
        R0mathField.latex("0.3074");
        V0mathField.latex("0.0340");
        DtmathField.latex("0.001");
        initRef.selectedIndex = 2;
    }
}
// RK1: Euler
// RK2: Explicit, Heun, Ralston
// RK3: Kutta, Heun, Wray, Ralston, SSP
// RK4: Classical, 38rule, Ralston
var selectRK = document.getElementById("IterationMethod");
function changeRK(){
    if(selectRK.value=="RK1_Euler"){
        rk = RK1_Euler;
        init();
    }else if(selectRK.value=="RK2_Explicit"){
        rk = RK2_Explicit;
        init();
    }else if(selectRK.value=="RK2_Heun"){
        rk = RK2_Heun;
        init();
    }else if(selectRK.value=="RK2_Ralston"){
        rk = RK2_Ralston;
        init();
    }else if(selectRK.value=="RK3_Kutta"){
        rk = RK3_Kutta;
        init();
    }else if(selectRK.value=="RK3_Heun"){
        rk = RK3_Heun;
        init();
    }else if(selectRK.value=="RK3_Wray"){
        rk = RK3_Wray;
        init();
    }else if(selectRK.value=="RK3_Ralston"){
        rk = RK3_Ralston;
        init();
    }else if(selectRK.value=="RK3_SSP"){
        rk = RK3_SSP;
       init();
    }else if(selectRK.value=="RK4_Classical"){
        rk = RK4_Classical;
        init();
    }else if(selectRK.value=="RK4_38rule"){
        rk = RK4_38rule;
        init();
    }else if(selectRK.value=="RK4_Ralston"){
        rk = RK4_Ralston;
        init();
    }
}
//====================================================================================
function init() {
    Y = Y0;
    running = false;
    RunIcon.id = "run";
    Spheres.update(Y);
    Spheres.init();

    var centerPos = Scene.center.hat.multiply(Scene.center.mag)
    Scene.camera.pos = vec(1, 1.3, 1).multiply(2 * Data.r0);
    Scene.camera.axis = centerPos.multiply(2).add(Scene.camera.pos.multiply(-1));
    // Scene.camera.pos = vec(1, 1.3, 1).multiply(1.8 * Data.r0);
    // Scene.camera.axis = Scene.camera.pos.multiply(-1);
    // dt = 1e-4/(r0)/(v0)/(M**0.6);
}
//-----------------------------------------------------------------------------------
var StepInUpdate, NumberEveryStep=100;
function update(){
    if(running){
        // do  many times iteration in every update
        for(StepInUpdate=0;StepInUpdate<NumberEveryStep;StepInUpdate++){
            Y = rk(f, t, Y, dt);
            t = t + dt;
        }
        Spheres.update(Y)
    }
}
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
var UpdateInterval = window.setInterval(update, 10);
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////



// Find all Event
function showEvent(){
    Array.from(document.querySelectorAll("*")).forEach(e => {
        const ev = getEventListeners(e); 
        if (Object.keys(ev).length !== 0) {
            console.log(e, ev)
        } 
    });
}

var CANVAS = document.getElementsByTagName("canvas")[1];
CANVAS.addEventListener('wheel', (event) => {
    var MaxRadius = Spheres.Universe.radius
    var centerPos = Scene.center.hat.multiply(Scene.center.mag)
    if(Scene.camera.pos.mag>Spheres.Universe.radius){
        Scene.camera.pos = Scene.camera.pos.hat.multiply(MaxRadius*0.9);
        Scene.camera.axis = centerPos.multiply(2).add(Scene.camera.pos.multiply(-1));
    }
    // if(Scene.camera.pos.mag < Spheres.Solar.radius){
    //     Scene.camera.pos = Scene.camera.pos.hat.multiply(Spheres.Solar.radius*0.9);
    //     Scene.camera.axis = centerPos.multiply(2).add(Scene.camera.pos.multiply(-1));
    // }
    if(Scene.camera.pos.mag < 0.25){
        Scene.camera.pos = Scene.camera.pos.hat.multiply(0.25);
        Scene.camera.axis = centerPos.multiply(2).add(Scene.camera.pos.multiply(-1));
    }
});








