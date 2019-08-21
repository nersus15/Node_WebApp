// import packages dan moduls
import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

// global variable
const Event_Category = {
    Cheap: { min: 1, max: 150000 },
    Normal: { min: 150001, max: 300000 },
    Expensive: { min: 300001, max: 5000000 },

}

const BookingChart = (props) => {
    const chartData = { labels: [], datasets: [] };
    let values = []
    for (const label in Event_Category) {
        const filterBookings = props.myBookings.reduce((prev, current) => {
            if (current.event.price <= Event_Category[label].max && current.event.price >= Event_Category[label].min) {
                return prev + 1;
            }
            return prev;
        }, 0)
        values.push(filterBookings);
        chartData.labels.push(label);
        chartData.datasets.push({
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: values
        });
        values = [...values];
        values[values.length - 1] = 0

    }
    return (<div style={{ textAlign: 'center' }}>
        <BarChart data={chartData} />
    </div>

    );
}

export default BookingChart;