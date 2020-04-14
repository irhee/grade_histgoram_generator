let datum = {};

const inputFile = document.querySelector('input[type="file"]')
inputFile.addEventListener('change', () => procssData(), false)

let histogramValuesDefault = {"A+":0, "A":0, "A-":0, "B+":0, "B":0, "B-":0, "C+":0, "C":0, "C-":0, "D":0, "F":0};
let histogramValues = {"A+":0, "A":0, "A-":0, "B+":0, "B":0, "B-":0, "C+":0, "C":0, "C-":0, "D":0, "F":0};

let formDataDefault = {"A+":95, "A":90, "A-":85, "B+":80, "B":75, "B-":70, "C+":65, "C":60, "C-":55, "D":50};


async function procssData() {
    document.getElementById("fileInput").hidden = true;

    var reader = new FileReader();
    // Read file into memory as UTF-8 
    reader.readAsText(inputFile.files[0]);
    // Handle errors load
    reader.onload  = function(event){
        var allText = event.target.result;
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var students = [];
    
        var checkTotalSum = 0;
        var TotalObj = {};
        for (var i=1; i<allTextLines.length; i++) {
            var lines = allTextLines[i].split(',');
            if (lines.length == headers.length) {
                var tarr = {};
                for (var j=0; j<headers.length; j++) {
                    tarr[headers[j]] = isNaN(parseFloat(lines[j])) ? lines[j]: parseFloat(lines[j]);
                }
    
                if(tarr["studentId"] == "total")
                {
                    for (let [key, value] of Object.entries(tarr)) {
                        if(key != "studentId")
                        {
                            checkTotalSum += isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                            TotalObj[key] = value;
                        }
                    }

                } else {
                    students.push(tarr);
                }
            }
        }
        
        if(checkTotalSum == 100) {
    
            datum = processGrades({'TotalObj':TotalObj, 'students':students, 'cutoffs': formDataDefault});
            
            createGradesWeights(datum);

            formCutoffValues(datum.cutoffs);
            createStudents(datum);
        } else {
            alert('Total does not sum up to 100. Upload another file.')
            window.location.href = '/';
        }
        
      };
      
}

function resetHistogram(){
    console.log('histogramValuesDefault',histogramValuesDefault)
    for (let [key, value] of Object.entries(histogramValuesDefault)) {
        histogramValues[key] = value;
    }
}

function processGrades(data){
    var {TotalObj, students, cutoffs} = data;
    resetHistogram();

    students.map(student => {
        let percentage = 0;

        for (let [key, value] of Object.entries(TotalObj)) {
            percentage += student[key] * value / 100;
        }

        student['percentage'] = percentage.toFixed(2);
        student['letter-grades'] = letterGrades(percentage.toFixed(2), cutoffs);
    })

    return {TotalObj, students, cutoffs};
}

function letterGrades(grades, cutoffs){
    if(grades > cutoffs['A+']) {
        histogramValues["A+"]++;
        return "A+";
    }
    if (grades > cutoffs['A']) {
        histogramValues["A"]++;
        return "A";
    }
    if (grades > cutoffs['A-']) {
        histogramValues["A-"]++;
        return "A-";
    }
    if (grades > cutoffs['B+']) {
        histogramValues["B+"]++;
        return "B+";
    }
    if (grades > cutoffs['B']) {
        histogramValues["B"]++;
        return "B";
    }
    if (grades > cutoffs['B-']) {
        histogramValues["B-"]++;
        return "B-";
    }
    if (grades > cutoffs['C+']) {
        histogramValues["C+"]++;
        return "C+";
    }
    if (grades > cutoffs['C']) {
        histogramValues["C"]++;
        return "C";
    }
    if (grades > cutoffs['C-']) {
        histogramValues["C-"]++;
        return "C-";
    }
    if (grades > cutoffs['D']) {
        histogramValues["D"]++;
        return "D";
    }

    histogramValues["F"]++;
    return "F";
}

function createGradesWeights(data){
    let {TotalObj} = data;
    //header
    document.getElementById("fileName").innerHTML = inputFile.files[0].name;
    //tableGradesWeights
    let tableGradesHead = document.getElementById('tableGradesWeights').getElementsByTagName('thead')[0];
    let tableGradesHeadRow = tableGradesHead.insertRow(tableGradesHead.length);

    let tableGradesBody = document.getElementById('tableGradesWeights').getElementsByTagName('tbody')[0];
    let tableGradesBodyRow = tableGradesBody.insertRow(tableGradesBody.length);

    let index = 0;
    for (let [key, value] of Object.entries(TotalObj)) {

        tableGradesHeadRow.insertCell(index).innerHTML = key;
        tableGradesBodyRow.insertCell(index).innerHTML = value;
        index++;
    }

}

function createStudents(data){
    let {TotalObj, students, cutoffs} = data;
    
    //header
    document.getElementById("fileName").innerHTML = inputFile.files[0].name;

    ///tableStudents
    let tableStudentsHead = document.getElementById('tableStudents').getElementsByTagName('thead')[0];

    if(tableStudentsHead.children.length == 0){
        let tableStudentsRow = tableStudentsHead.insertRow(0);
        index = 0;
        for (let [key, value] of Object.entries(students[0])) {
            tableStudentsRow.insertCell(index).innerHTML = key;
            index++;
        }
    }

    let tableStudentsBody = document.getElementById('tableStudents').getElementsByTagName('tbody')[0];
    if(tableStudentsBody.children.length != 0){
        students.map(student=>{
            tableStudentsBody.deleteRow(0);
        })
    }

    let rowIndex = 0;
    students.map(student=>{
        tableStudentsBodyRow = tableStudentsBody.insertRow(rowIndex);
        rowIndex++;

        index = 0;
        for (let [key, value] of Object.entries(student)) {
            tableStudentsBodyRow.insertCell(index).innerHTML = value;
            index++;
        }
    })

}

function formCutoffValues(cutoffs){
    ///formCutoffs
    for (let [key, value] of Object.entries(cutoffs)) {
        document.getElementById(key).value = value;
        document.getElementById(key).disabled = false;
    }
    document.getElementById("formCutoffs").hidden = false;
    document.getElementById("ascendingByPercentage").hidden = false;
    document.getElementById("descendingByPercentage").hidden = false;

}

function ascendingByPercentage(){
    let {students} = datum; 

    students = students.sort((a,b)=>{
        if(a.percentage > b.percentage) return 1;
        else if (b.percentage > a.percentage) return -1;
        else return 0;
    })

    datum.students = students;
    createStudents(datum);

}

function descendingByPercentage(){
    let {students} = datum; 

    students = students.sort((a,b)=>{
        if(a.percentage > b.percentage) return -1;
        else if (b.percentage > a.percentage) return 1;
        else return 0;
    })

    datum.students = students;
    createStudents(datum);

}