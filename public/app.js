function tabSwitcher(selection) {
  var toHide;
  var toShow;
  if (selection === 'report') {
    toHide = 'graphs';
    toShow = 'report';
  }

  if (selection === 'graphs') {
    toHide = 'report';
    toShow = 'graphs';
  }

  document.getElementById(toHide).classList.add('hidden');
  document.getElementById(`${toHide}-tab`).classList.remove('active');
  document.getElementById(toShow).classList.remove('hidden');
  document.getElementById(`${toShow}-tab`).classList.add('active');
}

function httpGetAsync(theUrl, callback){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}

function statementSwitcher(statementObject) {
  var statement = statementObject.value;
  if (statement !== 'undefined') {
    generateGraphs(statement);
    httpGetAsync('data/' + statement + '/breakdown.json', function (breakdown) {
      generateReport(breakdown);
    });
  }
}

statements.forEach(statement => {
  document.getElementById('statement-selector').innerHTML += `<option value="${statement}">${statement}</option>`;
});