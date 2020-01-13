
let fs = require("fs")

let inputPath = "c:\\users\\baby\\desktop\\input9.txt";
let inputArray = fs.readFileSync(inputPath, 'utf8').split(',');

class Memory {
    constructor(input){
        this.internal = {}
        input.forEach((val, idx) => {
            this.internal[idx] = val;
        })
    }

    get(i) {
        if(!this.internal.hasOwnProperty(i)) {
            this.set(i, 0);        
        }
        return this.internal[i]; 
    }

    set(idx, val) {
        this.internal[idx] = val;
    }
}


class Interpretor {

    constructor(arr, init){
        this.array = new Memory(arr);
        this.init = [init];
    }

    getParam(modeParam, idx, relative) {
        let param = modeParam == 0 ? 
                        this.array.get(idx) : 
                        modeParam == 1 ? 
                            (idx) : 
                            (relative + this.array.get(idx));
        return param;                    
    }

    processInput() {
        let i = 0;
        let input = this.init;
        let relative = 0;

        while(true) {
            let code = this.array.get(i).toString(10);
            code = code.padStart(5, '0');

            let opCode = code.substring(code.length - 2);
            if(opCode == '99') break;   

            let modeParam1 = code.substring(code.length - 3, code.length - 2)
            let modeParam2 = code.substring(code.length - 4, code.length - 3)
            let modeParam3 = code.substring(code.length - 5, code.length - 4)

            let param1 = this.getParam(modeParam1, i + 1, relative);
            let param2 = this.getParam(modeParam2, i + 2, relative);
            let param3 = this.getParam(modeParam3, i + 3, relative);
                

        if(opCode == '01') {
            let sum = this.array.get(param1) + this.array.get(param2);
            this.array.set(param3, sum); 
            i = i + 4;            
        }
        else if (opCode == '02') {
            let mul = this.array.get(param1) * this.array.get(param2);
            this.array.set(param3, mul); 
            i = i + 4;            
        }
        else if (opCode == '03') {
            let first = input.shift()
            this.array.set(param1, first);
            i = i + 2;            
        }             
        else if (opCode == '04') {            
            input.push(this.array.get(param1));            
            i = i + 2;            
        }   
        else if (opCode == '05') {
            i = this.array.get(param1) != 0 ? this.array.get(param2) : (i + 3);            
        }   
        else if(opCode == '06') {
            i = this.array.get(param1) == 0 ? this.array.get(param2) : (i + 3);           
        }
        else if(opCode == '07') {
            this.array.set(param3, this.array.get(param1) < this.array.get(param2) ? 1 : 0)
            i = i + 4;            
        }
        else if(opCode == '08') {
            this.array.set(param3, this.array.get(param1) == this.array.get(param2) ? 1 : 0)
            i = i + 4;            
        }
        else if(opCode == '09') {
            relative = relative + this.array.get(param1);
            i = i + 2;            
        }
        else {
            console.log("bad operation code");            
        }           
    }
    return input;
}

}

//inputArray = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]

let input = [...inputArray].map(x => parseInt(x,10));
let inter = new Interpretor(input, 2);
let output = inter.processInput();
console.log(output);
