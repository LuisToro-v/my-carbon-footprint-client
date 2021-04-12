import React from "react";
import XMLParser from 'react-xml-parser';
import {Pie} from 'react-chartjs-2'; 
//Feature 1: user is presented with a form with 3 values that they must input: location, income and houshold size

function GetUserInfo(){
    const [location, setLocation] = React.useState("1");
    const [place, setPlace] = React.useState("New York City");
    const [income, setIncome] = React.useState("1");
    const [size, setSize] = React.useState("1");
    const [chartData, setChartData] = React.useState({});    
    const [totalEmissions, setTotalEmissions] = React.useState();
    

    const changePlace = (e) => {
        setPlace(e.target.value)
        // console.log(setPlace)
    };
    const changeLocationMode = (e) => {
        setLocation(e.target.value)
    };
    const changeIncome = (e) => {
        setIncome(e.target.value)
    }
    const changeSize = (e) => {
        setSize(e.target.value)
    }
    // let xml = null;
    const handleSubmit = (event) => {
        event.preventDefault(); 
        console.log(place)
        console.log(income)
        console.log(size)
        console.log(location)
        console.log("submit form")
        let url = `https://apis.berkeley.edu/coolclimate/footprint-defaults?input_location_mode=${location}&input_location=${place}&input_income=${income}&input_size=${size}`
        console.log(url)

        fetch(url, {
            method: "GET",
            headers: {
                app_id: "f69e66f2",
                app_key: "8945dbb265921be3f110a47ff6cf44cf"
            }
        })
        .then(res => res.text())
        .then(results => {
            var xml = new XMLParser().parseFromString(results); 
            console.log(xml)
            //get data objs
            let foodEmission = xml.children[264]['value'];
            let housingEmission = xml.children[263]['value'];
            let transportationEmission = xml.children[262]['value'];
            let goodsEmission = xml.children[265]['value'];
            let serviceEmission = xml.children[266]['value'];

            setTotalEmissions(xml.children[267]['value']);
            //add the comparison to average 
   
            setChartData({
                labels: ["Food","Housing","Transportation", "Goods/Products", "Services"],
                datasets: [{
                    data: [foodEmission, housingEmission, transportationEmission, goodsEmission, serviceEmission],
                    backgroundColor: ['red','blue','green','yellow','pink']
                }]
            })
        })
        .catch((error)=> console.log(error));   
    };

    return (
        <div>
            <p>Let's get started with a quick carbon footprint estimate</p>
            
            <form onSubmit={handleSubmit}>
                <p>Location type:</p>
                <select onChange={changeLocationMode}>
                    <option value="1">ZIP code</option> 
                    <option value="2">City</option>
                    <option value="3">County</option>
                    <option value="4">State</option>
                </select>
                
                <input id="place" type="text" onChange={changePlace} />

                <p>What is your annual household income?</p>
                <select onChange={changeIncome}> 
                <option value="1">Average</option> 
                <option value="2">Less than $10,000</option>
                <option value="3">$10,000 to $19,999</option>
                <option value="4">$20,000 to $29,999</option>
                <option value="5">$30,000 to $39,999</option>
                <option value="6">$40,000 to $49,999</option>
                <option value="7">$50,000 to $59,999</option>
                <option value="8">$60,000 to $79,999</option>
                <option value="9">$80,000 to $99,999</option>
                <option value="10">$100,000 to $119,999</option>
                <option value="11">$120,000 or more</option>
                </select>

                <p>How many people live in your household?</p>
                <select onChange={changeSize}> 
                <option value="0">Average (2.5 persons)</option>
                <option value="1">1 person</option>
                <option value="2">2 person</option>
                <option value="3">3 person</option>
                <option value="4">4 person</option>
                <option value="5">5 of more people</option>
                </select>

                <p></p>
                <input id="submitbtn" type="submit" value="Submit"/>
            </form>

            <div>
                <p>Here is your estimated carbon footprint: {totalEmissions} tons CO2eq/year</p>
                <p>Here is the breakdown of your carbon emissions</p>
                <Pie data={chartData}/>
            </div>
        </div>
    )
}

export default GetUserInfo;