
let fs = require("fs");

let inputPath = "c:\\users\\baby\\desktop\\input10.txt";

let input = fs.readFileSync(inputPath,"utf-8");

class Meteorit {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class Solve {

    constructor(input) {
        this.meteorits = [];
        this.linesCount;        
        this.parseInput(input);        
    }

    parseInput(input) {
        let inputLines = input.split('\r\n');
        this.linesCount = inputLines.length;
        inputLines.forEach( (line, row) => {
            for(let column = 0; column < line.length; ++column) {
                let value = line[column];
                if(value == '#') {
                    let meteorit = new Meteorit(column, row);
                    this.meteorits.push(meteorit);
                }
            }                   
        });
    }

    getMaxScore() {
        let max = 0;
        let maxArray = [];
        let seenMeteorites = [];
        let meteorit;
        this.meteorits.forEach(m => {
            let scoreMeteo = this.getScoreForMeteorite(m);
            if(m.x == 5 && m.y == 8) {
                scoreMeteo == this.getScoreForMeteorite(m);
            }
            let currentMax = scoreMeteo.count;
            maxArray.push({currentMax, m});
            if(currentMax > max){
                max = currentMax;
                seenMeteorites = [...scoreMeteo.meteorites]; 
                meteorit = {'x':m.x,'y':m.y};
            } 
        })
        return {
                'max':max,
                'meteorit':meteorit,
                'seen':seenMeteorites,
            };
    }
    
    getScoreForMeteorite(start) {        
        let seenMeteorites = [];
        let count= 0;
        let endArray = [];
        this.meteorits.forEach(m=>{
            let isStart = ((m.x == start.x) && (m.y == start.y));
            if(!isStart) endArray.push(m);
        });

        for(let i = 0; i < endArray.length; ++i) {
            let end = endArray[i];
             
            let falseOrder = false;
            for(let j = 0; j < endArray.length; ++j) {
                if (i == j) continue;
                let between = endArray[j];
                let areColiniar = this.areMeteoritsColiniar(start, between, end);
                
                if(!areColiniar) continue;

                if( areColiniar && !this.areMeteoritesInRightOrder(start, end, between)) {
                    falseOrder = true;
                    break;
                }
            }
            if(!falseOrder) {
                count++;
                seenMeteorites.push(end);
            }
        }
        return {'count':count,'meteorites':seenMeteorites};        
    }

    areMeteoritsColiniar(m1, m2, m3) {
        if(m1.y == m2.y && m2.y == m3.y) return true;
                
        let tangentOne = (m2.x - m1.x) / (m2.y - m1.y);
        let tangentTwo = (m3.x - m1.x) / (m3.y - m1.y);

        return tangentOne == tangentTwo;
    }

    areMeteoritesInRightOrder(start, end, between) {
       
        let xSmaller = between.x <= start.x && between.x <= end.x;
        let ySmaller = between.y <= start.y && between.y <= end.y;
        let xBigger = between.x >= start.x && between.x >= end.x;
        let yBigger = between.y >= start.y && between.y >= end.y;        
         
        let caseOne = xSmaller && ySmaller;
        if(caseOne) return caseOne;

        let caseTwo = xBigger && yBigger;
        if(caseTwo) return caseTwo;

        let caseThree = xSmaller && yBigger;
        if(caseThree) return caseThree;
        
        let caseFour = xBigger && ySmaller;
        if(caseFour) return caseFour;
        
        return false;        
    }

    getMeteorOrder(index) {
        this.adjustAxis();
        let laser = this.getMaxScore().meteorit;
        let seenMeteoritesCount = 1;
        
        while (true) {            
            //get all the meteorites visible from the laser
            let seenMeteorites = this.getScoreForMeteorite(laser).meteorites;
            let seenMeteoritesAugmented = this.augmentMeteoritesWithAngle(seenMeteorites, laser);
            //the searched meteorite lies in the current iteration
            if(index <= seenMeteoritesAugmented.length) {
                return seenMeteoritesAugmented[index];                    
            }
            else {
                // we remove all seen meteorites to end and recalculate the seen meteorites
                let newInput = this.calculateNewInput(seenMeteoritesAugmented);
                //!! we change the state
                this.meteorits = [...newInput];
                //we subtract the number of deleted meteorites
                index = index - seenMeteoritesAugmented.length - 1;
            }            
        }
    }

    //here will modify the y values
    //y -> linesNumber - y
    adjustAxis() {
        let newInput = [];
        this.meteorits.forEach((meteorite) => {
            let adjustedMeteorite = new Meteorit(meteorite.x, this.linesCount - 1 - meteorite.y);
            newInput.push(adjustedMeteorite);
        });
        this.meteorits = [...newInput];
    }

    augmentMeteoritesWithAngle(seenMeteorites, laser){
                
        let augmentedSeenMeteorites = [];
        //calculate the tangent and structure in a different data structure
        seenMeteorites.forEach(meteorite => {
            //we need a vertical line between laser point and 
            laser = {'x':laser.x,'y':laser.y};
            let p1 = {'x':laser.x,'y':(this.linesCount - 1)};
            let p2 = {'x':meteorite.x,'y':meteorite.y};
            let angle = this.getAngleInBetweenInGrades(laser, p1, p2);// * (180/3.14);
            let meteoriteAugmented = {
                'x':meteorite.x,
                'y':meteorite.y,
                'angle':angle,
            };
            augmentedSeenMeteorites.push(meteoriteAugmented);  
        });
        //order by angle - TEST
        augmentedSeenMeteorites.sort((a,b) => a.angle - b.angle);
        return augmentedSeenMeteorites;
    }
    
    getAngleInBetweenInRadian(laser, p1, p2) {
        let smallAngleInRadian = this.getSmallAngleBetweenInRadian(laser, p1, p2);
        if(p2.x < p1.x || (p2.x == p1.x && p2.y > laser.y)){
            smallAngleInRadian = (3.1415926536 * 2 - smallAngleInRadian) ;
        }    
        return smallAngleInRadian;    
    }

    getAngleInBetweenInGrades(laser, p1, p2) {
        let angleInGradians = this.getAngleInBetweenInRadian(laser, p1, p2);
        let pi = 3.1415926536;
        return (angleInGradians * (180 / pi)) % 360;
    }

    
    getSmallAngleBetweenInRadian(laser, p1, p2) {
        let p1Translated = {'x':(p1.x - laser.x),'y':(p1.y - laser.y) }
        let p2Translated = {'x':(p2.x - laser.x),'y':(p2.y - laser.y) }

        let dot = this.dotProduct(p1Translated, p2Translated);
        
        return Math.acos(dot);
    }

    //calculate dot prod between p1 and p2
    dotProduct(p1, p2){
        let product = p1.x * p2.x + p1.y * p2.y;
        let magnitude1 = Math.sqrt(p1.x * p1.x + p1.y * p1.y);
        let magnitude2 = Math.sqrt(p2.x * p2.x + p2.y * p2.y);

        return product / (magnitude1 * magnitude2);
    }

    calculateNewInput(meteoritesToDelete) {
        let newInput = [];
        this.meteorits.forEach(m => {
            let toDelete = false;
            for(let i = 0; i < meteoritesToDelete.length; ++i){
                if(m.x == meteoritesToDelete[i].x && m.y == meteoritesToDelete[i].y){
                    toDelete = true;
                    break;
                }
            }
            if(!toDelete){
                newInput.push(new Meteorit(m.x, m.y));
            }
        })
        return [...newInput];       
    }
}

let solve = new Solve(input);
let result = solve.getMaxScore();
console.log(result.max + ' ' + 'met:' + result.meteorit.x + ',' + result.meteorit.y);

let t = solve.getMeteorOrder(199);
console.log(t)





/*
function areMeteoritesInRightOrder(start, end, between) {
    //case 1
    let YaxisIsOK =  ((start.y <= between.y && between.y <= end.y) || (start.y >= between.y) && (between.y >= end.y) ); 

    if (!YaxisIsOK) return false;

    let caseOne = (start.x <= between.x && between.x <= end.x) && YaxisIsOK
                 
    let caseTwo = (start.x >= between.x && between.x >= end.x) && YaxisIsOK;
       
    return (caseOne || caseTwo);
}

function  areMeteoritsColiniar(m1, m2, m3) {
    if(m1.y == m2.y && m2.y == m3.y) return true;
            
    let tangentOne = (m2.x - m1.x) / (m2.y - m1.y);
    let tangentTwo = (m3.x - m1.x) / (m3.y - m1.y);

    return tangentOne == tangentTwo;
}


let p1 = {x:1, y:3}
let p2 = {x:2, y:2}
let p3 = {x:3, y:1}

let result = areMeteoritesInRightOrder(p1,p2,p3)

console.log(result)

let result2 = areMeteoritsColiniar(p2,p1,p3)
console.log(result2)
*/
	
	
	
