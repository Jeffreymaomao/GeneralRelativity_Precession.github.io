/*
 * ==UserScript==
 * @name            General Relativity Orbits near a compact body
 * @author          Yange Chang Mao
 * @description     This is an extended version from the Basic Physics Experiment homework project. 
 *                      Since it is a little bit clumsy to using python writting the Web Interface, 
 *                      so here I write all the user interface and physics numerical method my self.
 * @refference      Classical Dynamics, glowscript vector
 * ==/UserScript==
 */

/* 
 * Global variable
 * - i : use to for loop.
 * - running : use for determine play or pause.
 * - NumberEveryUpdate : Animation will be very slow 
 *      when you update the position every numerical iteration, 
 *      so here update the position every 100 numerica literation.
 */
var i,running = false,NumberEveryUpdate=100;
/* 
 * Runge Kutta function: 
 *      Since there are many Runge Kutta method, 
 *      in other file (js/RungeKutta.js) have 
 *      a bunch of Runge Kutta method.
 */
var rk = RK3; 
/* ------------------------------------------------- */
window.__context = {
    /* 
     *   <GlowScript>
     *
     *   GlowScript makes it easy to write programs in JavaScript 
     *   that generate navigable real-time 3D animations, 
     *   using the WebGL 3D graphics library available in modern browsers.
     *
     *  see more: https://github.com/vpython/glowscript
    */
    glowscript_container: $("#glowscript").removeAttr("id")
};
/* --(Object) MathQuill -----------------------------*/
let LaTeX_MQ = {
    /*
     *   <MathQuill>
     *
     *   MathQuill is a web formula editor designed 
     *   to make typing math easy and beautiful.
     *   see more: https://github.com/mathquill/mathquill
    */
    MQ: MathQuill.getInterface(2),
    StaticLatexId: ["M0","M0unit","R0","R0unit","V0","V0unit","dt","dtunit"],
    M0input: document.getElementById('M0input'),
    R0input: document.getElementById('R0input'),
    V0input: document.getElementById('V0input'),
    dtinput: document.getElementById('dtinput'),
    init: function(){
        for(i=0;i<this.StaticLatexId.length;i++){
            var latex = document.getElementById(this.StaticLatexId[i]);
            this.MQ.StaticMath(latex);
        };
        LaTeX_MQ.M0mathField = LaTeX_MQ.MQ.MathField(this.M0input, {
            handlers: {
                edit: function() {
                    var latex = LaTeX_MQ.M0mathField.latex();
                    if(latex==undefined){latex="1"}
                    if(latex==0){latex="1"}
                    Data.M = latex2math(latex);
                    Controllers.Reference.selectedIndex = 0;
                }
            }
        });
        LaTeX_MQ.R0mathField = LaTeX_MQ.MQ.MathField(this.R0input, {
            handlers: {
                edit: function() {
                    var latex = LaTeX_MQ.R0mathField.latex();
                    if(latex==undefined){latex="1"}
                    if(latex==0){latex="1"}
                    Data.r0 = latex2math(latex);
                    Data.Y0 = new vec6(Data.r0, 0, 0, 0, 0, Data.v0);
                    Controllers.Reference.selectedIndex = 0;
                }
            }
        });
        LaTeX_MQ.V0mathField = LaTeX_MQ.MQ.MathField(this.V0input, {
            handlers: {
                edit: function() {
                    var latex = LaTeX_MQ.V0mathField.latex();
                    if(latex==undefined){latex="1"}
                    if(latex==0){latex="1"}
                    Data.v0 = latex2math(latex);
                    Data.Y0 = new vec6(Data.r0, 0, 0, 0, 0, Data.v0);
                    Controllers.Reference.selectedIndex = 0;
                }
            }
        });
        LaTeX_MQ.DtmathField = LaTeX_MQ.MQ.MathField(this.dtinput, {
            handlers: {
                edit: function() {
                    var latex = LaTeX_MQ.DtmathField.latex();
                    if(latex==undefined){latex="1"}
                    if(latex==0){latex="1"}
                    Data.dt = latex2math(latex);
                    Controllers.Reference.selectedIndex = 0;
                }
            }
        });
    }
};
/* --(function) Useful function--------------------- */
function rgb(r, g, b) {
    /* Convert rgb value to Vpython vector, where (r,g,b) in [0,255] */
    return vec(r / 255, g / 255, b / 255);
};
function ShowAllEvent(){
    /* To Show all the Event Listener */
    Array.from(document.querySelectorAll("*")).forEach(e => {
        const ev = getEventListeners(e); 
        if (Object.keys(ev).length !== 0) {
            console.log(e, ev)
        } 
    });
};
/* --(Object) Orbit, Parameters--------------------- */
var Data = {
    G: 2.9593e-4,  // gravitational constant (AU^3/M☉/day^2)
    c: 1.7314e2,   // speed of light (AU/day)
    __M: 1, // solar mass (M☉)
    get M () {
        return this.__M;
        init();
    },
    set M (m) {
        this.__M = m;
    },
    __r0: 0.3074,    // Perihelion radius (AU)
    get r0 () {
        return this.__r0;
    },
    set r0 (R) {
        this.__r0 = R;
    },
    __v0: 0.0340,    // Perihelion velocity (AU/day)
    get v0 () {
        return this.__v0;
    },
    set v0 (V) {
        this.__v0 = V;
    },
    __Rsolar: 0.3/10, //initalize value
    get Rsolar () {
        return this.__Rsolar;
    },
    set Rsolar (R) {
        this.__Rsolar = R;
    },
    __Rplanet: 0.3/20, //initalize value
    get Rplanet () {
        return this.__Rplanet;
    },
    set Rplanet (R) {
        this.__Rplanet = R;
    },
    __Y0: new vec6(0.3074, 0, 0, 0, 0, 0.0340), //initalize value
    get Y0 () {
        return this.__Y0;
    },
    set Y0 (GeneralVector) {
        this.__Y0 = GeneralVector;
        init();
    },
    __Y: new vec6(0.3074, 0, 0, 0, 0, 0.0340), //initalize value
    get Y () {
        return this.__Y;
    },
    set Y (GeneralVector) {
        this.__Y = GeneralVector;
    },
    __t: 0,
    get t () {
        return this.__t;
    },
    set t (time) {
        this.__t = time;
    },
    __dt: 0.001, //initalize value
    get dt () {
        return this.__dt;
    },
    set dt (time_step) {
        this.__dt = time_step;
        init();
    },
};
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
};
/* --(Object) Scene----------------------------------*/
let Scene = canvas({
    background:rgb(0,0,0),
    center:vec(0, 0, 0),
    resize: function () {
        this.width = window.innerWidth;
        this.height = window.innerHeight; 
    },
    ZoomAdjust: function(){
        var MaxRadius = Spheres.Universe.radius;
        var centerPos = Scene.center.hat.multiply(Scene.center.mag);
        var solar2camera = centerPos.add(Scene.camera.pos);
        if(solar2camera.mag>Spheres.Universe.radius){
            Scene.camera.pos = solar2camera.hat.multiply(MaxRadius*0.8);
            Scene.camera.axis = centerPos.multiply(2).add(Scene.camera.pos.multiply(-1));
        }
        if(Scene.camera.pos.mag < 0.25){
            Scene.camera.pos = Scene.camera.pos.hat.multiply(0.25);
            Scene.camera.axis = centerPos.multiply(2).add(Scene.camera.pos.multiply(-1));
        }
    },
    init: function (){
        this.userzoom = true;
        this.lights[0].visible = false;
        this.lights[1].visible = false;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.pos = vec(1, 1.3, 1).multiply(2 * Data.r0);
        this.camera.axis = this.camera.pos.multiply(-1);
        window.addEventListener('resize', function(){
            Scene.resize()
        });
        /* 
         * Since this EventListener, we need to initalize Scene 
         * after all canvas object has initialized. 
         * Or you can define seTimeOut to wait for canvas exist.
         */
        var Canvas_container = document.getElementsByTagName("canvas")[1];
        Canvas_container.addEventListener('wheel', function(){Scene.ZoomAdjust()})
        
    },
});
/* --(Object) Sphere-------------------------------- */
let Spheres = {
    backgroundScale: 7,
    Universe: sphere({
        pos: vec(0, 0, 0),
        radius: this.backgroundScale * Data.r0,
        emissive: true
    }),
    Solar: sphere({
        pos:vec(0, 0, 0),
        v: vec(0, 0, 0),
        radius: Data.Rsolar,
        emissive : true,
    }),
    SolarLight: local_light({
        pos: vec(0, 0, 0),
        color: rgb(255, 100, 30),
    }),
    Planet: sphere({
        make_trail: true,
        trail_radius: Data.Rplanet / 40,
        trail_color: color.yellow,
        pos: Data.Y.position,
        v: Data.Y.velocity,
        radius: Data.Rplanet
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
    init: function(){
        textures.MilkyWay = "https://raw.githubusercontent.com/Jeffreymaomao/General_Relativity_Precession/main/assets/re8kMilkyWay.jpg";
        textures.Sun = "https://raw.githubusercontent.com/Jeffreymaomao/General_Relativity_Precession/main/assets/Sun.jpg";
        textures.Earth = "https://raw.githubusercontent.com/Jeffreymaomao/General_Relativity_Precession/main/assets/8kEarth.jpg";
        this.texture = true;
        // this.texture = false;
        this.Planet.__trail_object.__trail.emissive = true;
        this.Planet.clear_trail();
        this.Universe.radius = this.backgroundScale*Data.r0;
    },
    restart: function(){
        this.Solar.radius = Data.Rsolar;
        this.Planet.radius = Data.Rplanet;
        this.Planet.__trail_object.__trail.emissive = true;
        this.Planet.clear_trail();
        this.Universe.radius = this.backgroundScale*Data.r0;
    },
    update: function(GeneralVector){
        this.Planet.pos = GeneralVector.position;
        this.Planet.v = GeneralVector.velocity;
    }
};
/* --(Object) Axis arror---------------------------- */
let Axis = {
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
};
/* --(Object) Button, Check Box, Selecter----------- */
let Controllers = {
    Canvas: document.getElementsByTagName("canvas")[1],
    Title: document.getElementsByClassName("Title")[0],
    TitleCheckBox: document.getElementById("TitleCheckBox"),
    SideBar: document.getElementById("SideBar"),
    SideBarIcon: document.getElementById("SideBarIcon"),
    RunningButton: document.getElementById("RunningButton"),
    RunningIcon: document.getElementById("run"),
    RestartButton: document.getElementById("RestartButton"),
    StopButton: document.getElementById("StopButton"),
    AxisCheckBox: document.getElementById("AxisCheckBox"),
    TextureCheckBox: document.getElementById("TextureCheckBox"),
    ScrollCheckBox: document.getElementById("ScrollCheckBox"),
    Focus: document.getElementById("CameraFocus"),
    Reference: document.getElementById("InitialValueReference"),
    RungeKutta: document.getElementById("IterationMethod"),
    Title_Toogle: function (){
        this.Title.classList.toggle("TitleToogle");
    },
    SideBar_Toogle: function (){
        this.SideBar.classList.toggle("SideBarToogle");
    },
    SideBar_Close: function (){
        var List = Controllers.SideBar.classList;
        if(List[0] == 'SideBarToogle'||List[1] == 'SideBarToogle'){
            this.SideBar.classList.toggle("SideBarToogle");
        }
    },
    Running_Toogle: function (){
        running = !running;
        if(!running){
            this.RunningIcon.id = "run"; // show run icon when not running
        }else{
            this.RunningIcon.id = "pause"; // show pause icon when running
        }
    },
    Restart_Triger: function (){
        init();
    },
    Stop_Triger: function () {
        window.clearInterval(UpdateInterval);
        this.RunningButton.appendChild(document.createTextNode(" ( NOT WORK ) "));
        this.RestartButton.appendChild(document.createTextNode(" ( NOT WORK ) "));
    },
    Axis_Toogle: function (){
        Axis.visible = this.AxisCheckBox.checked;
    },
    Texture_Toogle: function (){
        Spheres.texture = this.TextureCheckBox.checked;
    },
    Zoomming_Toogle: function (){
        Scene.userzoom = this.ScrollCheckBox.checked;
    },
    Focus_Change: function () {
        if(this.Focus.value=="none"){
            Scene.camera.follower = null;
        }else if(this.Focus.value=="solar"){
            Scene.camera.follower = Spheres.Solar;
        }else if(this.Focus.value=="planet"){
            Scene.camera.follower = Spheres.Planet;
        }
    },
    Reference_Change: function (){
        if(this.Reference.value=="suggestion"){
            LaTeX_MQ.M0mathField.latex("1000000");
            LaTeX_MQ.R0mathField.latex("0.3074");
            LaTeX_MQ.V0mathField.latex("40.6");
            LaTeX_MQ.DtmathField.latex("0.000005");
            this.Reference.selectedIndex = 1;
        }else if(this.Reference.value=="mercury"){
            LaTeX_MQ.M0mathField.latex("1");
            LaTeX_MQ.R0mathField.latex("0.3074");
            LaTeX_MQ.V0mathField.latex("0.0340");
            LaTeX_MQ.DtmathField.latex("0.001");
            this.Reference.selectedIndex = 2;
        }
    },
    RungeKutta_Change: function () {
        if(this.RungeKutta.value=="RK1_Euler"){
            rk = RK1_Euler;
            init();
        }else if(this.RungeKutta.value=="RK2_Explicit"){
            rk = RK2_Explicit;
            init();
        }else if(this.RungeKutta.value=="RK2_Heun"){
            rk = RK2_Heun;
            init();
        }else if(this.RungeKutta.value=="RK2_Ralston"){
            rk = RK2_Ralston;
            init();
        }else if(this.RungeKutta.value=="RK3_Kutta"){
            rk = RK3_Kutta;
            init();
        }else if(this.RungeKutta.value=="RK3_Heun"){
            rk = RK3_Heun;
            init();
        }else if(this.RungeKutta.value=="RK3_Wray"){
            rk = RK3_Wray;
            init();
        }else if(this.RungeKutta.value=="RK3_Ralston"){
            rk = RK3_Ralston;
            init();
        }else if(this.RungeKutta.value=="RK3_SSP"){
            rk = RK3_SSP;
           init();
        }else if(this.RungeKutta.value=="RK4_Classical"){
            rk = RK4_Classical;
            init();
        }else if(this.RungeKutta.value=="RK4_38rule"){
            rk = RK4_38rule;
            init();
        }else if(this.RungeKutta.value=="RK4_Ralston"){
            rk = RK4_Ralston;
            init();
        }
    },
    init: function(){
        /* 
         * When Object.addEventListener write in this object, 
         * the function should be call from Object, not this.
         */
        this.TitleCheckBox.addEventListener('click',function(){Controllers.Title_Toogle()});
        this.SideBarIcon.addEventListener('click',function(){Controllers.SideBar_Toogle()});
        this.Canvas.addEventListener('click',function(){Controllers.SideBar_Close()});
        this.RunningButton.addEventListener('click',function(){Controllers.Running_Toogle()});
        this.RestartButton.addEventListener('click',function(){Controllers.Restart_Triger()});
        this.StopButton.addEventListener('click',function(){Controllers.Stop_Triger()});
        this.AxisCheckBox.addEventListener('click',function(){Controllers.Axis_Toogle()});
        this.TextureCheckBox.addEventListener('click',function(){Controllers.Texture_Toogle()});
        this.ScrollCheckBox.addEventListener('click',function(){Controllers.Zoomming_Toogle()});
        this.Focus.addEventListener('change',function(){Controllers.Focus_Change()});
        this.Reference.addEventListener('change',function(){Controllers.Reference_Change()});
        this.RungeKutta.addEventListener('change',function(){Controllers.RungeKutta_Change()});
    }
};
/* --(function) Total Intialize--------------------- */
function init() {
    Data.Y = Data.Y0;
    running = false;
    Controllers.RunningIcon.id = "run";
    Spheres.update(Data.Y);
    Spheres.restart();

    var centerPos = Scene.center.hat.multiply(Scene.center.mag);
    Scene.camera.pos = vec(1, 1.3, 1).multiply(2 * Data.r0);
    Scene.camera.axis = centerPos.multiply(2).add(Scene.camera.pos.multiply(-1));
};
/* --(function) Update------------------------------ */
function update(){
    if(running){
        // do  many times iteration in every update
        for(i=0;i<NumberEveryUpdate;i++){
            Data.Y = rk(f, Data.t, Data.Y, Data.dt);
            Data.t = Data.t + Data.dt;
        }
        Spheres.update(Data.Y);
    };
};
/* --Initialize------------------------------------- */
LaTeX_MQ.init();
Spheres.init();
Axis.init();
Controllers.init();
Scene.init();
/* --Update----------------------------------------- */
var UpdateInterval = window.setInterval(update, 10);