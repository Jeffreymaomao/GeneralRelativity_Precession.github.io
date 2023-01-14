
function RK4(f, t, y, h) {
    var b1=1/6, b2=1/2, b3=1/6, b4=1/6
    var c1=0, c2=1/2, c3=1/2, c4=1
    var a21=1/2
    var a31=17/36, a32=1/36
    var a41=0, a42=1/2, a43=1/2
    var f1 = f(t + c1 * h, y)
    var f2 = f(t + c2 * h, y.add(f1.multiply(h * a21)))
    var f3 = f(t + c3 * h, y.add(f1.multiply(h * a31).add(f2.multiply(h * a32))))
    var f4 = f(t + c4 * h, y.add(f1.multiply(h * a41).add(f2.multiply(h * a42).add(f3.multiply(h * a42)))))
    Y = y.add(f1.multiply(h * b1).add(f2.multiply(h * b2).add(f3.multiply(h * b3).add(f4.multiply(h * b4)))))
    return Y
}