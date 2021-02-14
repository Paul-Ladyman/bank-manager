function tabSwitcher(selection) {
  const tabs = ['statements', 'report', 'graphs'];

  tabs.forEach((tab) => {
    if(tab === selection) {
      document.getElementById(tab).classList.remove('hidden');
      document.getElementById(`${tab}-tab`).classList.add('active');
    } else {
      document.getElementById(tab).classList.add('hidden');
      document.getElementById(`${tab}-tab`).classList.remove('active');
    }
  });
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
      generateStatements(breakdown);
    });
  }
}

statements.forEach(statement => {
  document.getElementById('statement-selector').innerHTML += `<option value="${statement}">${statement}</option>`;
});