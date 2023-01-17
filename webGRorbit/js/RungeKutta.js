

/*
 * ==JavaScript function==
 * @name            Runge Kutta methos
 * @author          Yange Chang Mao
 * @description     This is a bunch of Runge Kutta methods, using Javascript function.
 * @refference      https://en.wikipedia.org/wiki/List_of_Runge–Kutta_methods  
 * @arguments
 *      1. f: function for y' = f(t,y)
 *      2. t: time 
 *      3. y: vector:
 *          i.  addistion: y.add()
 *          ii. multiplication: y.multiply())
 *      4. h: time step
 * ==/JavaScript function==
 */

/* ------------------------------------------------- */
var RK1 = RK1_Euler
var RK2 = RK2_Explicit
var RK3 = RK3_Kutta
var RK4 = RK4_Classical
/*
 * RK1: Euler
 * RK2: Explicit, Heun, Ralston
 * RK3: Kutta, Heun, Wray, Ralston, SSP
 * RK4: Classical, 38rule, Ralston
*/
/* ------------------------------------------------- */
function RK1_Euler (f, t, y, h) {
    /* Euler method */
    var Y = y.add(f(t,y).multiply(h))
    return Y;
}
/* ------------------------------------------------- */
function RK2_Explicit (f, t, y, h) {
    /* Heun's method */
    var b1=0, b2=1
    var c1=0, c2=1/2
    var a21=1/2
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2)))
    return Y;
}

function RK2_Heun (f, t, y, h) {
    /* Explicit midpoint method */
    var b1=1/2, b2=1/2
    var c1=0, c2=1
    var a21=1
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2)))
    return Y;
}

function RK2_Ralston (f, t, y, h) {
    /* Ralston's method */
    var b1=1/4, b2=3/4
    var c1=0, c2=2/3
    var a21=2/3
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2)))
    return Y;
}
/* ------------------------------------------------- */
function RK3_Kutta (f, t, y, h) {
    /* Kutta's third-order method */
    var b1=1/6, b2=2/3, b3=1/6
    var c1=0, c2=1/2, c3=1
    var a21=1/2
    var a31=-1, a32=2
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var f3 = f(t + c3 * h, y.add(f1.multiply(h * a31).add(f2.multiply(h * a32))))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2).add(f3.multiply(h * b3))))
    return Y;
}

function RK3_Heun (f, t, y, h) {
    /* Heun's third-order method */
    var b1=1/4, b2=0, b3=3/4
    var c1=0, c2=1/3, c3=2/3
    var a21=1/3
    var a31=0, a32=2/3
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var f3 = f(t + c3 * h, y.add(f1.multiply(h * a31).add(f2.multiply(h * a32))))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2).add(f3.multiply(h * b3))))
    return Y;
}

function RK3_Wray (f, t, y, h) {
    /* Van der Houwen's / Wray third-order method */
    var b1=1/4, b2=0, b3=3/4
    var c1=0, c2=8/15, c3=2/3
    var a21=5/15
    var a31=1/4, a32=5/12
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var f3 = f(t + c3 * h, y.add(f1.multiply(h * a31).add(f2.multiply(h * a32))))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2).add(f3.multiply(h * b3))))
    return Y;
}

function RK3_Ralston (f, t, y, h) {
    /* Ralston's third-order method */
    var b1=2/9, b2=1/3, b3=4/9
    var c1=0, c2=1/2, c3=3/4
    var a21=1/2
    var a31=0, a32=3/4
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var f3 = f(t + c3 * h, y.add(f1.multiply(h * a31).add(f2.multiply(h * a32))))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2).add(f3.multiply(h * b3))))
    return Y;
}

function RK3_SSP (f, t, y, h) {
    /* Third-order Strong Stability Preserving Runge-Kutta (SSPRK3) */
    var b1=1/6, b2=1/6, b3=2/3
    var c1=0, c2=1, c3=1/2
    var a21=1
    var a31=1/4, a32=1/4
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var f3 = f(t + c3 * h, y.add(f1.multiply(h * a31).add(f2.multiply(h * a32))))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2).add(f3.multiply(h * b3))))
    return Y;
}

/* ------------------------------------------------- */
function RK4_Classical (f, t, y, h) {
    /* Classical fourth-order method */
    var b1=1/6, b2=1/3, b3=1/3, b4=1/6
    var c1=0, c2=1/2, c3=1/2, c4=1
    var a21=1/2
    var a31=0, a32=1/2
    var a41=0, a42=0, a43=1
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var f3 = f(t + c3 * h, y.add(f1.multiply(h * a31).add(f2.multiply(h * a32))))
    var f4 = f(t + c4 * h, y.add(f1.multiply(h * a41).add(f2.multiply(h * a42).add(f3.multiply(h * a42)))))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2).add(f3.multiply(h * b3).add(f4.multiply(h * b4)))))
    return Y;
}
function RK4_38rule (f, t, y, h) {
    /* 3/8-rule fourth-order method */
    var b1=1/8, b2=3/8, b3=3/8, b4=1/8
    var c1=0, c2=1/3, c3=2/3, c4=1
    var a21=1/3
    var a31=-1/3, a32=1
    var a41=1, a42=-1, a43=1
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var f3 = f(t + c3 * h, y.add(f1.multiply(h * a31).add(f2.multiply(h * a32))))
    var f4 = f(t + c4 * h, y.add(f1.multiply(h * a41).add(f2.multiply(h * a42).add(f3.multiply(h * a42)))))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2).add(f3.multiply(h * b3).add(f4.multiply(h * b4)))))
    return Y;
}
function RK4_Ralston (f, t, y, h) {
    /* Ralston's fourth-order method 
     * by Anthony Ralston, where this is method
     * has minimum truncation error for stage 4.
     * https://www.ams.org/journals/mcom/1962-16-080/S0025-5718-1962-0150954-0
     */
    var s5 = Math.sqrt(5);
    var b1=(263+24*s5)/1812, b2=(125-1000*s5)/3828, b3=1024*(3346+1623*s5)/5924787, b4=(30-4*s5)/123
    var c1=0, c2=2/5, c3=(7/8-3*s5/16), c4=1
    var a21=2/5
    var a31=(-2889+1428*s5)/1024, a32=(3785-1620*s5)/1024
    var a41=(-3365+2094*s5)/6040, a42=(-975-3046*s5)/2552, a43=(467040+203968*s5)/2400845
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var f3 = f(t + c3 * h, y.add(f1.multiply(h * a31).add(f2.multiply(h * a32))))
    var f4 = f(t + c4 * h, y.add(f1.multiply(h * a41).add(f2.multiply(h * a42).add(f3.multiply(h * a42)))))
    var Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2).add(f3.multiply(h * b3).add(f4.multiply(h * b4)))))
    return Y;
}
/* ------------------------------------------------- */





