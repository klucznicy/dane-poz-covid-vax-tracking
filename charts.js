// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart', 'bar'], 'language': 'pl'});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChartProgressBar);
google.charts.setOnLoadCallback(drawChartDailyVaxers);
google.charts.setOnLoadCallback(drawChartWeeklyVaxers);
google.charts.setOnLoadCallback(drawChartTotalVaxers);

docUrl = 'https://docs.google.com/spreadsheets/d/1RQAg-gqb8MfzXF30QC9CCAVpWF5U5YkL8gnnq54q4C8';

function drawChartProgressBar() {
  var queryString = encodeURIComponent('SELECT A, B, C, D');

  var query = new google.visualization.Query( docUrl + '/gviz/tq?gid=1577334276&tq=' + queryString );
  query.send(handleQueryResponseProgressBar);
}

function drawChartDailyVaxers() {
  var queryString = encodeURIComponent('SELECT B, D, F');

  var query = new google.visualization.Query( docUrl + '/gviz/tq?gid=1008697565&tq=' + queryString );
  query.send(handleQueryResponseDaily);
}

function drawChartWeeklyVaxers() {
  var queryString = encodeURIComponent('SELECT B, C');

  var query = new google.visualization.Query( docUrl + '/gviz/tq?tq=' + queryString );
  query.send(handleQueryResponseWeekly);
}

function drawChartTotalVaxers() {
  var queryString = encodeURIComponent('SELECT B, D');

  var query = new google.visualization.Query( docUrl + '/gviz/tq?tq=' + queryString );
  query.send(handleQueryResponseTotal);
}

function handleQueryResponseProgressBar(response) {
  var data = response.getDataTable();

  var options = {
    isStacked: 'percent',
    animation: {
      duration: 750,
      "startup": true
    },
    hAxis: {
      position: 'none'
    },
    vAxis: {
      gridlines: {
        color: 'transparent'
      }
    },
   legend: {
      position: 'bottom'
   },
   colors: ['#34a853', '#4285f4', '#DC3912'],
    annotations: {
      alwaysOutside: true
    }
  };

  var view = new google.visualization.DataView(data);

  var chart = new google.visualization.BarChart(document.getElementById('progress_bar'));

  chart.draw(view, options);
}

function handleQueryResponseDaily(response) {
  var data = response.getDataTable();

  var options = {
    chart: {title:'Postęp szczepień dzień po dniu'},
    animation: {
      startup: true,
      duration: 750,
    },
    hAxis: {
      gridlines: {
        color: 'transparent'
      }
    },
    colors: ['#4285f4', '#34a853'],
    legend: { position: 'top' }
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('daily_vaxers'));

  chart.draw(data, options);
}

function handleQueryResponseWeekly(response) {
  var data = response.getDataTable();

  var options = {
    chart: {title:'Podane pierwsze dawki'},
    animation: {
      startup: true,
      duration: 750,
    },
    hAxis: {
      gridlines: {
        color: 'transparent'
      }
    },
    legend: { position: 'top' }
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('weekly_vaxers'));

  chart.draw(data, options);
}

function handleQueryResponseTotal(response) {
  var data = response.getDataTable();

  var options = {
    chart: {title:'Zaszczepieni'},
    animation: {
      startup: true,
      duration: 750,
    },
    hAxis: {
      gridlines: {
        color: 'transparent'
      }
    },
    legend: {position: 'top'},
  };


  var chart = new google.visualization.AreaChart(document.getElementById('total_vaxers'));

  chart.draw(data, options);
}

function fetchCSV( type ) {
  var queryString = encodeURIComponent('SELECT A, B');

  var query = new google.visualization.Query( docUrl + '/gviz/tq?tq=' + queryString );
  query.send(deliverCSV);
}

function deliverCSV( response ) {
  var data = response.getDataTable();

  var csv = google.visualization.dataTableToCsv(data);
  console.log(csv);

  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'dane-szczepionki.csv';
  hiddenElement.click();
}
