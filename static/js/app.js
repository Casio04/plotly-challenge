// init function to get the list of "names" to populate the selection list
function init(){
    // Read Json
    d3.json("../../data/samples.json").then(function(namesList){
    // Select the id corresponding to the select tag
    let selection = d3.select("#selDataset")
    // select all option tags
    .selectAll("option")
    // bind the data
    selection.data(namesList.names)
    // update selection with all new entries
    .enter()
    // create new option tags for each new entry
    .append("option")
    // merge the old values with the new ones
    .merge(selection)
    // add the value attribute of each name or ID to the option tag (for programmer use)
    .attr("value", d=>d)
    // add the visible text of each name or ID (for the User)
    .text(d=>d)
    // Remove all the unmatching entries from the selection
    selection.exit().remove()  
    let firstResult = namesList.names[0]
    optionChanged(firstResult)
})
}

// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
// }

function barChart(id_value){
// Emptying the bar id to clear all the information before
    d3.select("#bar").html("")
    // Reading data and obtaining the index for the value
    d3.json("../../data/samples.json").then(function(data){
        let index = data.names.findIndex(function(i){
            return id_value === i
        })
        let sample_data = data.samples[index]
        // Using slice to get the first 10 results and then reverse to get the correct
        // descending order when plotting
        let xSlice = sample_data.sample_values.slice(0,10).reverse()
        let y_ids = sample_data.otu_ids.slice(0,10).reverse()
        let labels = sample_data.otu_labels.slice(0,10).reverse()
        // Adding the prefix "OTU" to the labels as requested
        let ySlice = y_ids.map(d => 'OTU ' + d)
        // Creating the trace
        let trace1 = {
            x: xSlice,
            y: ySlice,
            type: 'bar',
            orientation: 'h',
            hoverinfo: labels
        }
        // Adding the trace to an array in case there are other arrays in the future
        let trace_data = [trace1]
        let layout ={
            title: {
                text: "Top 10 Bacteria present in subject. <br> Shown by ID",
                size: 1}
        }
        // Plotting the bar chart
        Plotly.newPlot("bar", trace_data, layout)
    })
}


function demographicData(id_value){
    // Create table inside panel body and select the corresponding tags to create
    // a header and populate it
    let table = d3.select("#sample-metadata").html("").append("table").attr("class", "table-responsive")
    let thead = table.append("thead")
    let tr = thead.append("tr")
    tr.append("th").text("Indicator")
    tr.append("th").text("Data")
    let tbody = table.append("tbody").attr("id", "table-body")
    // read Json and use a function to retrieve the index number of the ID selected
    d3.json("../../data/samples.json").then(function(data){
        let index = data.names.findIndex(function(i){
            return id_value === i
        })
        let metadata = data.metadata[index]
        // After having the specific index needed, I convert the entry into an array of 
        // arrays, so I can manipulate it and insert all the values
        Object.entries(metadata).forEach(([key, value])=>{
            let row = tbody.append("tr")
            row.append("td").text(key)
            row.append("td").text(value)
        })
        
        
    })
}

function bubbleChart(id_value){
    // Clear data from bubble id
    d3.select("#bubble").html("")
    d3.json("../../data/samples.json").then(function(data){
        let index = data.names.findIndex(function(i){
            return id_value === i
        })
        let sample_data = data.samples[index]
        let ids = sample_data.otu_ids
        let yValues = sample_data.sample_values
        let labels = sample_data.otu_labels
        
        var trace1 = {
            x: ids,
            y: yValues,
            text: labels,
            mode: 'markers',
            marker: {
              size: yValues,
              color: ids
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Marker Size',
          };
          
          Plotly.newPlot('bubble', data, layout);
    })
}

function optionChanged(value){
    demographicData(value)
    barChart(value)
    bubbleChart(value)
}

init()