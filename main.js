/*
var bb = [];
[... document.querySelectorAll(".main td")].map((e)=>{
var text = e.textContent;
if(text.match("取得合計")){
bb.push(parseFloat(text.match(/[0-9]+\.[0-9]/)[0]));
}
});
console.log(bb);
var sum = 0;
bb.map(n=>{sum += n});
sum;
*/


var getJson = function(){
    var tbody = document.querySelector(".main > tbody");
    var rows = [... tbody.children];
    var json = processRows(rows);
    return json;
};

var processRows = function(rows){
    var json = [];
    var currentField = [];
    for(var i = 0; i < rows.length; i++){
        var row = rows[i];
        var classname = row.classList[0];
        if(classname === "field"){
            if(currentField.length !== 0){
                var field = processField(currentField);
                json.push(field);
            }
            currentField = [];
            currentField.push(row);
        }else if(classname === "subject"){
            currentField.push(row);
        }
    }
    var field = processField(currentField);
    json.push(field);
    return json;
};

var processField = function(field){
    var json = {};
    json.detail = field[0].children[0].textContent;
    var list = json.detail.split(/\s/);
    json.list1 = list;
    json.type1 = list[1];
    json.name = list[list.length-1];
    json.credits = parseFloat(field[0].children[1].textContent.match(/[0-9]+\.[0-9]/)[0]);
    json.subjects = [];

    for(var i = 1; i < field.length; i++){
        var sub = {};
        var row = field[i];
        var texts = [... row.children].map(a=>a.textContent);
        sub.name = texts[0];
        sub.teacher = texts[1];
        sub.grade = texts[2];
        sub.pass = true;
        sub.credits = parseFloat(texts[3]);
        sub.validCredits = sub.credits
        if(sub.grade === "D" || sub.grade === "F" || sub.grade === "－"){
            sub.pass = false;
            sub.validCredits = 0;
        }
        sub.year = texts[5];
        sub.semester = texts[6];
        sub.schoolyear = texts[7];
        json.subjects.push(sub);
    }
    return json;
};


var copy = function(obj){
    return JSON.parse(JSON.stringify(obj));
};


var getClassProfile = function(){
    var fields = getJson();
    var jsontext = JSON.stringify(fields)
    console.log(jsontext);
    var classes = [];
    for(var i = 0; i < fields.length; i++){
        var field = fields[i];
        var subjects = field.subjects;
        for(var j = 0; j < subjects.length; j++){
            var subject = subjects[j];
            //var subject = copy(subject);
            subject.field = field;
            classes.push(subject);
        }
    }

    console.log("基盤科目: "+calculateKibanSum(classes)+"単位");
    console.log("先端科目: "+calculateSentanSum(classes)+"単位");
    console.log("言語科目: "+calculateGengoSum(classes)+"単位");
};

var calculateKibanSum = function(classes){
    var credits = 0;
    for(var i = 0; i < classes.length; i++){
        var subject = classes[i];
        if(subject.field.list1[1] === "基盤科目"){
            credits += subject.validCredits;
        }
    }
    return credits;
};

var calculateSentanSum = function(classes){
    var credits = 0;
    for(var i = 0; i < classes.length; i++){
        var subject = classes[i];
        if(subject.field.list1[1] === "先端科目"){
            credits += subject.validCredits;
        }
    }
    return credits;
};

var calculateGengoSum = function(classes){
    var credits = 0;
    for(var i = 0; i < classes.length; i++){
        var subject = classes[i];
        if(subject.field.list1[2] === "言語コミュニケーション科目"){
            credits += subject.validCredits;
        }
    }
    return credits;
};




getClassProfile();

