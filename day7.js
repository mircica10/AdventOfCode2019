
let fs = require("fs")

let inputPath = "c:\\users\\baby\\desktop\\input5.txt";
let inputArray = fs.readFileSync(inputPath, 'utf8').split(',');

function ProcessInput(inputArray, init1, init2) {
    let values = [...inputArray].map(x => parseInt(x,10));
    let i = 0;
    let input = init1;

    while(i < values.length) {
        let code = values[i].toString(10);
        code = code.padStart(5, '0');

        let opCode = code.substring(code.length - 2);
        if(opCode == '99') break;   

        let modeParam1 = code.substring(code.length - 3, code.length - 2) == 1 ? 1 : 0;
        let modeParam2 = code.substring(code.length - 4, code.length - 3) == 1 ? 1 : 0;
        let modeParam3 = code.substring(code.length - 5, code.length - 4) == 1 ? 1 : 0;

        let param1 = modeParam1 == 0 ? values[i + 1] : (i + 1);
        let param2 = modeParam2 == 0 ? values[i + 2] : (i + 2);
        let param3 = modeParam3 == 0 ? values[i + 3] : (i + 3);
        
        if(opCode == '01') {
            values[param3] = values[param2] + values[param1];
            i = i + 4;            
        }
        else if (opCode == '02') {
            values[param3] = values[param2] * values[param1];
            i = i + 4;            
        }
        else if (opCode == '03') {
            values[param1] = input;
            input = init2;
            i = i + 2;            
        }             
        else if (opCode == '04') {
            input = values[param1];
            i = i + 2;            
        }   
        else if (opCode == '05') {
            i = values[param1] != 0 ? values[param2] : (i + 3)            
        }   
        else if(opCode == '06') {
            i = values[param1] == 0 ? values[param2] : (i + 3)           
        }
        else if(opCode == '07') {
            values[param3] = values[param1] < values[param2] ? 1 : 0;
            i = i + 4;            
        }
        else if(opCode == '08') {
            values[param3] = values[param1] == values[param2] ? 1 : 0;
            i = i + 4;            
        }
        else {
            console.log("bad operation code");            
        }                
    }
    return input;
}

let result = ProcessInput(inputArray, 5);
console.log('part 1 result is ' + result)

function ProcessInputPart2(id) {
    let output;
    let i = statesOfIteration[id];
    let values = inputs[id];
    
    while(i < values.length) {
        let code = values[i].toString(10);
        code = code.padStart(5, '0');

        let opCode = code.substring(code.length - 2);
        if(opCode == '99') break;   

        let modeParam1 = code.substring(code.length - 3, code.length - 2) == 1 ? 1 : 0;
        let modeParam2 = code.substring(code.length - 4, code.length - 3) == 1 ? 1 : 0;
        let modeParam3 = code.substring(code.length - 5, code.length - 4) == 1 ? 1 : 0;

        let param1 = modeParam1 == 0 ? values[i + 1] : (i + 1);
        let param2 = modeParam2 == 0 ? values[i + 2] : (i + 2);
        let param3 = modeParam3 == 0 ? values[i + 3] : (i + 3);
        
        if(opCode == '01') {
            values[param3] = values[param2] + values[param1];
            i = i + 4;            
        }
        else if (opCode == '02') {
            values[param3] = values[param2] * values[param1];
            i = i + 4;            
        }
        else if (opCode == '03') {
            values[param1] = inputParameters[id].shift();
            i = i + 2;               
        }             
        else if (opCode == '04') {
            output = values[param1];
            i = i + 2;
            statesOfIteration[id] = i;    
            inputs[id] = values;  
            return {
                'done': false,
                'value': output,                               
            };                
        }   
        else if (opCode == '05') {
            i = values[param1] != 0 ? values[param2] : (i + 3)            
        }   
        else if(opCode == '06') {
            i = values[param1] == 0 ? values[param2] : (i + 3)           
        }
        else if(opCode == '07') {
            values[param3] = values[param1] < values[param2] ? 1 : 0;
            i = i + 4;            
        }
        else if(opCode == '08') {
            values[param3] = values[param1] == values[param2] ? 1 : 0;
            i = i + 4;            
        }
        else {
            console.log("bad operation code");
            return NaN;
        }                
    }
    return {
        'done': true,
        'value':output
    };
}


    

function daySevenPart1(){
    let comb = generateAllCombinations(0,4);
    let maxVal = 0;
    comb.forEach(c => {
        let currentVal = calculateOneCombination(input, c);
        maxVal = currentVal > maxVal ? currentVal : maxVal;
    });
    return maxVal;
}

function generateAllCombinations(min, max) {
    let combinations = [];
    
    for(let i = min; i <= max; i++){
        for(let j = min; j <= max ; j++){
            for(let k = min; k <= max ; k++){
                for(let l = min; l <= max ; l++){
                    for(let m = min; m <= max; m++) {    
                        if (!hasDoubles([i,j,k,l,m]) ) {
                            combinations.push([i,j,k,l,m]);
                        } 
                    }
                }
            }    
        }
    }
    return combinations;
}

function hasDoubles(arr) {
    let map = [];
    for(let i = 0; i < arr.length; ++i){
        if(map.includes(arr[i])) return true;
        map.push(arr[i]);
    }    
    return false;
}


function calculateOneCombination() {
    let init = {"value":0};
   
    while(true) {
        inputParameters[0].push(init['value']);
        let a = ProcessInputPart2(0);
        if (a['done']) return init['value'];        

        inputParameters[1].push(a['value']);
        let b = ProcessInputPart2(1);
        if (b['done']) return init['value'];        
        
        inputParameters[2].push(b['value']);
        let c = ProcessInputPart2(2);
        if (c['done']) return init['value'];        
        
        inputParameters[3].push(c['value']);
        let d = ProcessInputPart2(3);
        if (d['done']) return init['value'];        
        
        inputParameters[4].push(d['value']);
        init  = ProcessInputPart2(4);
        if (init['done']) return init['value'];               
    }    
}

let input = [3,8,1001,8,10,8,105,1,0,0,21,46,59,72,93,110,191,272,353,434,99999,3,9,101,4,9,9,1002,9,3,9,1001,9,5,9,102,2,9,9,1001,9,5,9,4,9,99,3,9,1002,9,5,9,1001,9,5,9,4,9,99,3,9,101,4,9,9,1002,9,4,9,4,9,99,3,9,102,3,9,9,101,3,9,9,1002,9,2,9,1001,9,5,9,4,9,99,3,9,1001,9,2,9,102,4,9,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,99]

let comb = [9,8,7,6,5]
let statesOfIteration = [0,0,0,0,0]
let inputs = [[...input], [...input], [...input], [...input], [...input]];
let inputParameters = [ [comb[0]],[comb[1]],[comb[2]],[comb[3]],[comb[4]] ];

//console.log(calculateOneCombination())

function daySevenPart2(){
    let comb = generateAllCombinations(5,9);
    let maxVal = 0;
    comb.forEach(c => {
        comb = [...c]
        statesOfIteration = [0,0,0,0,0]
        inputs = [[...input], [...input], [...input], [...input], [...input]];
        inputParameters = [ [comb[0]],[comb[1]],[comb[2]],[comb[3]],[comb[4]] ];

        let currentVal = calculateOneCombination();
        maxVal = currentVal > maxVal ? currentVal : maxVal;
    });
    return maxVal;
}




console.log(daySevenPart2());
