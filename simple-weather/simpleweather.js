
class forecast
{
    baseUrl; cwa; gridX; gridY; latitude; longitude;
    constructor (lat = 33.90597058201411, long = -118.01659580883346)
    {
        this.latitude = lat;
        this.longitude = long;
        this.baseUrl = "https://api.weather.gov";

        this.requestGridInfo ();
    }

    /** API Get code
        let apiUrl = `${this.baseUrl}/_the_rest_of_the_api_url`;
        fetch(apiUrl)
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data =>
        {
            call_some_handler_function (data);
        })
        .catch (error => {
            console.error('Error:', error);
        });
    */

    catchDailyForecast (data)
    {
        for (let i = 0; i < 10; i++)
        {
            let fcData = data.properties.periods[i];
            let divHtml =
`<div class="day-info">
<h3> ${fcData.name}</h3>
<div class="temp-precip">${this.writeTempAndPrecip(fcData.temperature, fcData.probabilityOfPrecipitation.value)}</div>
<div class="wind">${this.writeWind(fcData.windSpeed, fcData.windDirection)}</div>
</div>
</div>`;
            document.getElementById ("daily-info").innerHTML += divHtml;
        }
    }

    catchHourlyForecast (data)
    {
        let container = document.getElementById("hourly-info")
        container.innerHTML = `<div class="hourly-header"><i class="fa-regular fa-clock"></i></div>
<div class="hourly-header"><i class="fa-solid fa-temperature-high"></i>&nbsp; &sol; &nbsp;<i class="fa-solid fa-droplet"></i></div>
<div class="hourly-header"><i class="fa-solid fa-wind"></i></div>`;
        
        for (let i = 0; i < 10; i++)
        {
            let fcData = data.properties.periods[i];
            let rowClass = (i%2==0 ? 'even' : 'odd');
            let time = `<div class="${rowClass}">${fcData.startTime.match(/T([0-9\:]{5})/)[1]}</div>`;
            let TandP = `<div class="${rowClass} temp-precip">${this.writeTempAndPrecip(fcData.temperature, fcData.probabilityOfPrecipitation.value)}</div>`;
            let wind = `<div class="${rowClass} wind">${this.writeWind(fcData.windSpeed, fcData.windDirection)}</div>`;

            container.innerHTML += time + TandP + wind;                        
        }
    }

    catchGridInfo (data)
    {
        this.cwa = data.properties.cwa;
        this.gridX = data.properties.gridX;
        this.gridY = data.properties.gridY;
        this.requestDailyForecast ();
        this.requestHourlyForecast ();
    }

    drawArrow (arrowDirection)
    {
        var angles = ["S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE"];
        let arrowAngle = angles.indexOf (arrowDirection) * 22.5;
        let arrow = 
`<svg viewbox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
<circle
cx="30" cy="30" r="29"
style="fill-opacity: 0; stroke: rgb(0,0,0); stroke-width: 1px;"
/>
<polyline
points="30,5 20,55 40,55 30,5"
style="stroke: rgb(0,0,0); stroke-width: 1px;"
transform="rotate(${arrowAngle} 30 30)"
/>
</svg>`;
        return arrow;
    }

    requestDailyForecast ()
    {
        let apiUrl = `${this.baseUrl}/gridpoints/${this.cwa}/${this.gridX},${this.gridY}/forecast`;
        fetch(apiUrl)
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data =>
        {
            this.catchDailyForecast (data);
        })
        .catch (error => {
            console.error('Error:', error);
        });
        
    }

    requestHourlyForecast ()
    {
        let apiUrl = `${this.baseUrl}/gridpoints/${this.cwa}/${this.gridX},${this.gridY}/forecast/hourly`;
        fetch(apiUrl)
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data =>
        {
            this.catchHourlyForecast (data);
        })
        .catch (error => {
            console.error('Error:', error);
        });
        
    }

    requestGridInfo ()
    {
        let apiUrl = `${this.baseUrl}/points/${this.latitude},${this.longitude}`;

        fetch(apiUrl).then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data =>
        {
            this.catchGridInfo (data);
        })
        .catch (error => {
            console.error('Error:', error);
        });
    }

    writeTempAndPrecip (temp, precip)
    {
        return `<div><i class="fa-solid fa-temperature-high"></i> ${temp}&deg;</div><div>&sol;</div><div>${precip===null ? 0 : precip}&percnt; <i class="fa-solid fa-droplet"></i></div>`;
    }

    writeWind (speed, direction)
    {
        return `<div>${speed}</div><div>${this.drawArrow(direction)}</div>`;
    }
}

function ecDays ()
{
    let diElt = document.getElementById("daily-info");
    diElt.classList.toggle ("expanded");
    if ( diElt.classList.contains ("expanded") )
        document.getElementById("expand-days").innerHTML = `<i class="fa-solid fa-angle-up"></i> Less <i class="fa-solid fa-angle-up"></i>`;
    else
        document.getElementById("expand-days").innerHTML = `<i class="fa-solid fa-angle-down"></i> More <i class="fa-solid fa-angle-down"></i>`;

}
var biola = new forecast ();

