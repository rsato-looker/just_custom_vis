const overwrapping_bar = {

    create: function(element, config) {
        const css = element.innerHTML = `
        <style>
        #container {
            max-width: 100%;
            min-width: 100%;
            margin: auto;
        }        
        </style>
        `
        const container = element.appendChild(document.createElement("div"))
        // container.className = "container"
        container.setAttribute("id", "container")

    },

    updateAsync: function(data, element, config, queryResponse, details, done) {

        // Clear any errors from previous updates
        this.clearErrors();
        const {fields} = queryResponse
        const { dimensions, measures, tableCalcs, dimension_like, measure_like} = fields
        const labelFields = dimension_like[0].name
        const xLabel = dimension_like[0].label_short
        const yLabel = measure_like[0].label_short
        const measureFields_1 = measure_like[0].name
        const measureFields_2 = measure_like[1].name

        // console.log(measureFields_1, measureFields_2)

        // Throw some errors and exit if the shape of the data isn't what this chart needs
        if (queryResponse.fields.dimensions.length == 0) {
        this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
        return;
        }

        // console.log(queryResponse)

        // const chartData = data.map(function (record) {
        //     // const rec = []
        //     // rec.push(record[queryResponse.fields.dimensions[0].name].value)
        //     return record[queryResponse.fields.dimensions[0].name].value
        // })

        const chartData = data.map(function (record) {
          const rec = []
          rec.push(record[labelFields].value)
          rec.push(record[measureFields_1].value)
          rec.push(record[measureFields_2].value)
          return rec
      })

      console.log(chartData[1].at(1))

        Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
          return Highcharts.Color(color)
            .setOpacity(0.5)
            .get('rgba');
        });
  
        Highcharts.chart('container', {
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'Selected Period vs Total Period'
              },
              // subtitle: {
              //     text: 'Source: WorldClimate.com'
              // },
              xAxis: {
                  categories: [
                    chartData[0].at(0),
                    chartData[1].at(0),  
                  ]
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: 'Count'
                  }
              },
              legend: {
                  layout: 'vertical',
                  backgroundColor: '#FFFFFF',
                  align: 'left',
                  verticalAlign: 'top',
                  x: 100,
                  y: 70,
                  floating: true,
                  shadow: true
              },
              tooltip: {
                  shared: true,
                  // valueSuffix: ' mm'
              },
              plotOptions: {
                  column: {
                    grouping: false,
                    shadow: false
                  }
              },
              series: [{
                  name: 'Selected Period',
                  data: [chartData[0].at(2),chartData[1].at(2)],
                  pointPadding: 0
  
              }, {
                  name: 'Total Period',
                  data: [chartData[0].at(1),chartData[1].at(1)],
                  pointPadding: 0.1
  
              }]
          });
    }
}
looker.plugins.visualizations.add(overwrapping_bar)
