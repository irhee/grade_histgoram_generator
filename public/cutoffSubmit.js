const formCutoffs = document.getElementById('formCutoffs');

let histogramArr = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];


async function onFormSubmit(e) {
    e.preventDefault();
    let formData = {};
    formData["A+"] = document.getElementById("A+").value;
    formData["A"] = document.getElementById("A").value;
    formData["A-"] = document.getElementById("A-").value;
    formData["B+"] = document.getElementById("B+").value;
    formData["B"] = document.getElementById("B").value;
    formData["B-"] = document.getElementById("B-").value;
    formData["C+"] = document.getElementById("C+").value;
    formData["C"] = document.getElementById("C").value;
    formData["C-"] = document.getElementById("C-").value;
    formData["D"] = document.getElementById("D").value;

    let {TotalObj, students, cutoffs} = datum;
    cutoffs = formData;

    if(formData["A+"]>formData["A"] &&
    formData["A"]>formData["A-"] &&
    formData["A-"]>formData["B+"] &&
    formData["B+"]>formData["B"] &&
    formData["B"]>formData["B-"] &&
    formData["B-"]>formData["C+"] &&
    formData["C+"]>formData["C"] &&
    formData["C"]>formData["C-"] &&
    formData["C-"]>formData["D"]
    ){
        formCutoffValues(cutoffs);
        processGrades({TotalObj, students, cutoffs});
        createStudents({TotalObj, students, cutoffs});
        histogram(histogramValues);
    } else {
        alert("Please make sure A+ is greater than A, A is greater than A- and so on.")
    }

}

async function histogram(histogramValues) {
    var {TotalObj, students, cutoffs} = datum;

    // for (let [key, value] of Object.entries(histogramValues)) {
    //     if(key != "studentId")
    //     {
    //         histogramValues[key] = Math.round(value / students.length * 100);
    //     }
    // }

    let tableHistogramFoot = document.getElementById('tableHistogram').getElementsByTagName('tfoot')[0];
    if(tableHistogramFoot.children.length == 0){
        let tableHistogramRow = tableHistogramFoot.insertRow(0);
        index = 0;
        histogramArr.map(item =>{
            tableHistogramRow.insertCell(index).innerHTML = item;
            index++;
        })
    }

    let tableHistogramBody = document.getElementById('tableHistogram').getElementsByTagName('tbody')[0];

    let maxValue = 0;
    for (let [key, value] of Object.entries(histogramValues)) {
        if(maxValue < value)
        {
            maxValue = value;
        }
    }

    if(tableHistogramBody.children.length != 0){
        for (let [key, value] of Object.entries(tableHistogramBody.children)) {
            tableHistogramBody.deleteRow(0);
        }
    }

    var i;
    for(i=0; i<=maxValue; i++)
    {
        tableHistogramBodyRow = tableHistogramBody.insertRow(i);
        let rowIndex = 0;
        for (let [key, value] of Object.entries(histogramValues)) {
            if(value <= maxValue-i)
            {
                tableHistogramBodyRow.insertCell(rowIndex).innerHTML = "";
            } 
            else {
                tableHistogramBodyRow.insertCell(rowIndex).innerHTML = "o";
            }
            rowIndex++
        }
    }

}

formCutoffs.addEventListener('submit', onFormSubmit)