//====================================================================================
// define the constructor method of generalized vector
//====================================================================================
// testing for the general vector
//var v1 = new vec6(0, 1, 1, 2, 3, 4)
//var v2 = new vec6(3, 5, 8, 9, 0, 1)
//console.log("v1 =", v1.toString())
//console.log("v2 =", v2.toString())
//console.log("v1.position =", v1.position.toString())
//console.log("v1.velocity =", v1.velocity.toString())
//console.log("v1+v2 =", v1.add(v2).toString())

(function () {
    "use strict";

    function vec6(px, py, pz, vx, vy, vz) {
        this.px = px; // position x
        this.py = py; // position y
        this.pz = pz; // position z
        this.vx = vx; // velocity x
        this.vy = vy; // velocity y
        this.vz = vz; // velocity z

    }

    // transfer vec6 to string
    vec6.prototype.toString = function () {
        return "vec6 ( " + this.px + ", " + this.py + ", " + this.pz + ", " + this.vx + ", " + this.vy + ", " + this.vz + " )"
    };
    // vec6 addition function (vec6+vec6)
    vec6.prototype.add = function (v) {
        if (v instanceof vec) add_vec_error();
        if (!(v instanceof vec6)) add_scalar_error();
        return new vec6(this.px + v.px, this.py + v.py, this.pz + v.pz, this.vx + v.vx, this.vy + v.vy, this.vz + v.vz)
    };
    // vec6 subtract function (vec6-vec6)
    vec6.prototype.sub = function (v) {
        if (v instanceof vec) sub_vec_error();
        if (!(v instanceof vec6)) sub_scalar_error();
        return new vec6(this.px - v.px, this.py - v.py, this.pz - v.pz, this.vx - v.vx, this.vy - v.vy, this.vz - v.vz)
    };

    // vec6 multiply function (vec6*number)
    vec6.prototype.multiply = function (r) {
        if (r instanceof vec6) multiply_error();
        if (r === undefined || Number.isNaN(r)) badnumber(r);
        return new vec6(this.px * r, this.py * r, this.pz * r, this.vx * r, this.vy * r, this.vz * r)
    };

    // vec6 divide function (vec6/number)
    vec6.prototype.divide = function (r) {
        if (r instanceof vec6) divide_error();
        if (r === undefined || Number.isNaN(r)) badnumber(r);
        return new vec6(this.px / r, this.py / r, this.pz / r, this.vx / r, this.vy / r, this.vz / r)
    };
    // vec6 normalize function (vec6/vec6.mag)
    vec6.prototype.norm = function () {
        var r = this.mag;
        if (r == 0) return new vec6(0, 0, 0, 0, 0, 0);
        return new vec(this.px / r, this.py / r, this.pz / r, this.vx / r, this.vy / r, this.vz / r)
    };
    vec6.prototype.dot = function (v) {
        return this.px * v.px + this.py * v.py + this.pz * v.pz + this.vx * v.vx + this.vy * v.vy + this.vz * v.vz
    };
    vec6.prototype.equals = function (v) {
        if (v === null) return false;
        return this.px === v.px && this.py === v.py && this.pz === v.pz && this.vx === v.vx && this.vy === v.vy && this.vz === v.vz
    };

    property.declare(vec6.prototype, {
        position: {
            get: function () {
                return vec(this.px, this.py, this.pz)
            },
            set: function (v) {
                this.px = v.x;
                this.py = v.y;
                this.pz = v.z
            }
        },
        velocity: {
            get: function () {
                return vec(this.vx, this.vy, this.vz)
            },
            set: function (v) {
                this.vx = v.x;
                this.vy = v.y;
                this.vz = v.z
            }
        },
        mag: {
            get: function () {
                return Math.sqrt(this.px * this.px + this.py * this.py + this.pz * this.pz + this.vx * this.vx + this.vy * this.vy + this.vz * this.vz)
            },
            set: function (value) {
                var v = this.norm().multiply(value);
                this.px = v.px;
                this.py = v.py;
                this.pz = v.pz;
                this.vx = v.vx;
                this.vy = v.vy;
                this.vz = v.vz
            }
        },
        mag2: {
            get: function () {
                return this.px * this.px + this.py * this.py + this.pz * this.pz + this.vx * this.vx + this.vy * this.vy + this.vz * this.vz
            },
            set: function (value) {
                var v = this.norm().multiply(Math.sqrt(value));
                this.px = v.px;
                this.py = v.py;
                this.pz = v.pz;
                this.vx = v.vx;
                this.vy = v.vy;
                this.vz = v.vz
            }
        },
        hat: {
            get: function () {
                return this.norm()
            },
            set: function (value) {
                var v = this.hat.multiply(this.mag);
                this.px = v.px;
                this.py = v.py;
                this.pz = v.pz;
                this.vx = v.vx;
                this.vy = v.vy;
                this.vz = v.vz
            }
        }
    });
    
    vec6.prototype["+"] = vec6.prototype.add;
    vec6.prototype["-"] = vec6.prototype.sub;
    vec6.prototype["*"] = vec6.prototype.multiply;
    vec6.prototype["/"] = function (r) {
        return this.divide(r)
    };
    vec6.prototype["**"] = function (r) {
        power_error()
    };
    vec6.prototype["-u"] = function () {
        return new vec6(-this.xp, -this.py, -this.pz, -this.vx, -this.vy, -this.vz)
    };
    vec6.prototype[">"] = function (r) {
        greater_error()
    };
    vec6.prototype["<"] = function (r) {
        less_error()
    };
    vec6.prototype[">="] = function (r) {
        greaterorequal_error()
    };
    vec6.prototype["<="] = function (r) {
        lessorequal_error()
    };


    function add_scalar_error() {
        throw new Error("Cannot add a scalar and a vector.")
    }

    function add_vec_error() {
        throw new Error("Cannot add a 6d vector and a 3d vector.")
    }

    function sub_scalar_error() {
        throw new Error("Cannot subtract a scalar and a vector.")
    }

    function sub_vec_error() {
        throw new Error("Cannot subtract a 6d vector and a 3d vector.")
    }

    function multiply_error() {
        throw new Error("Cannot multiply a vector by a vector.")
    }

    function divide_error() {
        throw new Error("Cannot divide by a vector.")
    }

    function power_error() {
        throw new Error("Cannot raise a vector to a power.")
    }

    function num_power_error() {
        throw new Error("Cannot raise a number to a power that is a vector.")
    }

    function greater_error() {
        throw new Error("Cannot use > with vectors.")
    }

    function less_error() {
        throw new Error("Cannot use < with vectors.")
    }

    function greaterorequal_error() {
        throw new Error("Cannot use >= with vectors.")
    }

    function lessorequal_error() {
        throw new Error("Cannot use <= with vectors.")
    }

    function Badnumber(r) {
        if (r === undefined) throw new Error("A variable is undefined.");
        else throw new Error("A variable is 'NaN', not a number.")
    }
    Export({
        vec6: vec6
    })
})();

