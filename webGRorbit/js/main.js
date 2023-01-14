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
for(var i=0;i<StaticLatexId.length;i++){
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
            M = latex2math(latex);
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
            r0 = latex2math(latex);
            Y0 = new vec6(r0, 0, 0, 0, 0, v0);
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
            v0 = latex2math(latex);
            Y0 = new vec6(r0, 0, 0, 0, 0, v0);
            initRef.selectedIndex = 0;
            init();
        }
    }
});
var dtmathField = MQ.MathField(dtinput, {
    handlers: {
        edit: function() {
            var latex = dtmathField.latex();
            if(latex==undefined){latex="1"}
            if(latex==0){latex="1"}
            dt = latex2math(latex);
            initRef.selectedIndex = 0;
            init();
        }
    }
});


//====================================================================================
var rk = RK4;

function rgb(r, g, b) {
    return vec(r / 255, g / 255, b / 255)
}
//====================================================================================
var G = 2.9593e-4 // gravitational constant (AU^3/M☉/day^2)
var c = 1.7314e2 // speed of light (AU/day)
var M = 1 // solar mass (M☉)
var r0 = 0.3074 // Perihelion radius (AU)
var v0 = 0.0340 // Perihelion velocity (AU/day)

var inir0 = r0
var iniM = M
var iniv0 = v0

var Rsolar = r0 / 3
var Rplanet = r0 / 5

function f(t, Y) {
    var gamma,r,a,f0,f1,f2,f3,f4,f5;
    gamma = 6 * r0 ** 2 * v0 ** 2 / c ** 2;
    r = Y.position.mag;
    a = G * M / r ** 2 * (1 + gamma / r ** 2);
    f0 = Y.vx;
    f1 = Y.vy;
    f2 = Y.vz;
    f3 = -a * Y.px / r;
    f4 = -a * Y.py / r;
    f5 = -a * Y.pz / r;
    return new vec6(f0, f1, f2, f3, f4, f5)
}

var Y0 = new vec6(r0, 0, 0, 0, 0, v0)
var Y = Y0
var t = 0
var dt = 0.001 * ((r0 / inir0) ** 2) * ((iniM / M) ** 1.5)
//------------------------------------------------------------------------------------
// scene setting
let scene = canvas({
    background:rgb(0,0,0),
    center:vec(0, 0, 0)
})
scene.lights[0].visible = false;
scene.lights[1].visible = false;

function winResize() {
    scene.width = window.innerWidth;
    scene.height = window.innerHeight;
};
winResize();
window.onresize = winResize;
//------------------------------------------------------------------------------------
// Object
var backgroundScale = 7;
var Universe = sphere({
    pos: vec(0, 0, 0),
    radius: backgroundScale * r0,
    emissive: true
})

var Solar = sphere({
    pos:vec(0, 0, 0),
    v: vec(0, 0, 0),
    radius: Rsolar,
    emissive : true,
})

var SolarLight = local_light({
    pos: vec(0, 0, 0),
    color: rgb(255, 100, 30),
})

var Planet = sphere({
    make_trail: true,
    trail_radius: Rplanet / 40,
    trail_color: color.yellow,
    pos: Y.position,
    v: Y.velocity,
    radius: Rplanet
});

Planet.__trail_object.__trail.emissive = true;

//------------------------------------------------------------------------------------
// texture 
var MilkyWay_img = "https://raw.githubusercontent.com/Jeffreymaomao/General_Relativity_Precession/main/assets/re8kMilkyWay.jpg"
var Sun_img = "https://raw.githubusercontent.com/Jeffreymaomao/General_Relativity_Precession/main/assets/Sun.jpg"
var Earth_img = "https://raw.githubusercontent.com/Jeffreymaomao/General_Relativity_Precession/main/assets/8kEarth.jpg"

//------------------------------------------------------------------------------------
// axis arrow
var axis_length = 0.2
var axis_width = 0.001
// Axis X
var axisX = arrow({
    pos: vec(0, 0, 0),
    axis: vec(1, 0, 0).multiply(axis_length),
    shaftwidth: axis_width,
    color: color.red,
    emissive: true
})

// Axis Y
var axisY = arrow({
    pos: vec(0, 0, 0),
    axis: vec(0, 1, 0).multiply(axis_length),
    shaftwidth: axis_width,
    color: color.green,
    emissive: true
})

// Axis Z
var axisZ = arrow({
    pos: vec(0, 0, 0),
    axis: vec(0, 0, 1).multiply(axis_length),
    shaftwidth: axis_width,
    color: color.blue,
    emissive: true
})

var axis = {
    x: axisX,
    y: axisY,
    z: axisZ,
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
    toggle: function(){
        this.x.visible = !this.x.visible;
        this.y.visible = !this.y.visible;
        this.z.visible = !this.z.visible
        console.log("The axis arrows' visible are "+String(this.x.visible)+".")
    }
}
/*
    For some reason, the axis.emissive is not work, 
    so here change the components of axis directly.
    axis.__components = [box, pyramid]
*/
for(var i=0;i<2;i++){
    axisX.__components[i].emissive = true;
    axisY.__components[i].emissive = true;
    axisZ.__components[i].emissive = true;
}

//-----------------------------------------------------------------------------------
// button & check box
var running = false;
var RunningButton = document.getElementById("RunningButton")
var RunIcon = document.getElementById("run")
RunningButton.addEventListener("click",function(){
    running = !running;
    if(!running){
        RunIcon.id = "run"  // show run icon when not running
    }else{
        RunIcon.id = "pause" // show pause icon when running
    }
});
var RestartButton = document.getElementById("RestartButton")
RestartButton.addEventListener("click",function(){
    init();
})

var StopButton = document.getElementById("StopButton")
StopButton.addEventListener("click",function(){
    window.clearInterval(UpdateInterval);
    RunningButton.appendChild(document.createTextNode(" ( NOT WORK ) "));
    RestartButton.appendChild(document.createTextNode(" ( NOT WORK ) "));
});


var AxisCheckBox = document.getElementById("AxisCheckBox")
function AnimationAxis(){
    if(AxisCheckBox.checked){
        axis.open();
    }else{
        axis.close();
    }
};
var TextureCheckBox = document.getElementById("TextureCheckBox")
function AnimationTexture(){
    if(TextureCheckBox.checked){
        Universe.color = rgb(255,255,255);
        Solar.color = rgb(255,255,255);
        Planet.color = rgb(255,255,255);
        Universe.texture = MilkyWay_img;
        Solar.texture = Sun_img;
        Planet.texture = Earth_img;
    }else{
        Universe.color = rgb(0,0,0);
        Solar.color = rgb(219,102,42);
        Planet.color = rgb(50,135,204);
        Universe.texture = null;
        Solar.texture = null;
        Planet.texture = null;
    }
}
var ScrollCheckBox = document.getElementById("ScrollCheckBox")
function AnimationScroll(){
    scene.userzoom = ScrollCheckBox.checked;
}

AnimationAxis()
AnimationTexture()
AnimationScroll()

var initRef = document.getElementById("InitialValueReference");
function changeRef(){
    if(initRef.value=="suggestion"){
        console.log(1);
        M0mathField.latex("1000000");
        R0mathField.latex("0.3074");
        V0mathField.latex("40.6");
        dtmathField.latex("0.000005");
        initRef.selectedIndex = 1;
    }else if(initRef.value=="mercury"){
        console.log(1);
        M0mathField.latex("1");
        R0mathField.latex("0.3074");
        V0mathField.latex("0.0340");
        dtmathField.latex("0.001");
        initRef.selectedIndex = 2;
    }
}



//====================================================================================
// camera setting
scene.camera.pos = vec(1, 1.3, 1).multiply(1.8 * r0);
scene.camera.axis = scene.camera.pos.multiply(-1);
//------------------------------------------------------------------------------------
function init() {
    running = false;
    RunIcon.id = "run";
    Planet.pos = Y0.position;
    Planet.v = Y0.velocity;
    Universe.radius = backgroundScale*r0;
    Planet.clear_trail();
    scene.camera.pos = vec(1, 1.3, 1).multiply(1.8 * r0);
    scene.camera.axis = scene.camera.pos.multiply(-1);
    // dt = 1e-4/(r0)/(v0)/(M**0.6);
    Y = Y0;
}
//-----------------------------------------------------------------------------------
var StepInUpdate, NumberEveryStep=100;
function update(){
    if(running){
        // do  many times iteration in every update
        for(StepInUpdate=0;StepInUpdate<NumberEveryStep;StepInUpdate++){
            Y = rk(f, t, Y, dt);
            Planet.pos = Y.position;  // update position
            Planet.v = Y.velocity;    // redundant update velocity
            t = t + dt;
        }
    }
}


var UpdateInterval = window.setInterval(update, 10);







